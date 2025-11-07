import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import * as Cesium from 'cesium';

interface CountryConfig {
  name: string;
  color?: string; // Color en formato hex, ej: '#FF0000'
  label?: boolean; // Si mostrar etiqueta o no
}

@Component({
  selector: 'app-globe-map',
  templateUrl: './globe-map.component.html',
  styleUrls: ['./globe-map.component.scss'],
})
export class GlobeMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;
  
  // Acepta un solo país (retrocompatibilidad)
  @Input() countryName?: string;
  
  // O acepta una lista de países (puede ser string[] o CountryConfig[])
  @Input() countries: (string | CountryConfig)[] = [];
  
  // Configuración de colores
  @Input() defaultColor = '#FF0000'; // Rojo por defecto
  @Input() showLabels = true; // Mostrar etiquetas por defecto
  @Input() enableBlinking = true; // Efecto de parpadeo

  private viewer!: Cesium.Viewer;
  private countriesGeoJson: any | null = null;
  private blinkInterval: any;
  private isViewerReady = false;
  private resizeObserver?: ResizeObserver;

  async ngAfterViewInit() {
    try {
      // 🔐 Sin token Ion (no lo necesitamos)
      Cesium.Ion.defaultAccessToken = '';

      // Ruta base Cesium (importante si lo sirves desde Angular)
      (window as any).CESIUM_BASE_URL = 'assets/cesium';

      // 🌍 Crear visor Cesium sin Bing Maps ni Ion
      this.viewer = new Cesium.Viewer(this.globeContainer.nativeElement, {
        terrainProvider: new Cesium.EllipsoidTerrainProvider(),
        animation: false,
        timeline: false,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        navigationHelpButton: false,
        fullscreenButton: false,
        sceneModePicker: false,
        infoBox: false,
        selectionIndicator: false,
        requestRenderMode: true,
        maximumRenderTimeChange: Infinity,
      } as any);

      // 📏 Ajustar el canvas al tamaño del contenedor
      this.viewer.resolutionScale = window.devicePixelRatio || 1;
      
      // Forzar resize inicial
      this.viewer.resize();

      // 🎯 Vista inicial: mundo completo sin zoom
      this.viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(0, 0, 25000000), // Mayor altura para ver todo el mundo
        orientation: {
          heading: 0,
          pitch: Cesium.Math.toRadians(-90), // Vista desde arriba
          roll: 0
        }
      });

      // 🗺️ Añadir OpenStreetMap
      this.viewer.imageryLayers.removeAll();
      this.viewer.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          credit: '© OpenStreetMap contributors',
        })
      );

      // 📦 Cargar archivo GeoJSON
      const res = await fetch('assets/countries.geojson');
      this.countriesGeoJson = await res.json();

      this.isViewerReady = true;

      // 📐 Observar cambios de tamaño del contenedor
      this.setupResizeObserver();

      // 🔍 Resaltar países iniciales
      await this.highlightCountries();
    } catch (error) {
      console.error('Error inicializando el mapa:', error);
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    if ((changes['countryName'] || changes['countries']) && 
        !changes['countryName']?.firstChange && 
        !changes['countries']?.firstChange && 
        this.isViewerReady) {
      await this.highlightCountries();
    }
  }

  ngOnDestroy() {
    clearInterval(this.blinkInterval);
    
    // Desconectar el observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    
    if (this.viewer && !this.viewer.isDestroyed()) {
      this.viewer.destroy();
    }
  }

  private setupResizeObserver() {
    // Observar cambios en el tamaño del contenedor
    this.resizeObserver = new ResizeObserver(() => {
      if (this.viewer && !this.viewer.isDestroyed()) {
        this.viewer.resize();
        this.viewer.scene.requestRender();
      }
    });

    this.resizeObserver.observe(this.globeContainer.nativeElement);
  }

  private async highlightCountries() {
    if (!this.viewer || !this.countriesGeoJson) {
      console.warn('⚠️ Viewer o GeoJSON no disponible');
      return;
    }

    // Limpiar todo lo anterior
    clearInterval(this.blinkInterval);
    this.viewer.entities.removeAll();
    
    // Limpiar datasources de forma segura
    const toRemove: Cesium.DataSource[] = [];
    for (let i = 0; i < this.viewer.dataSources.length; i++) {
      const ds = this.viewer.dataSources.get(i);
      if (ds instanceof Cesium.GeoJsonDataSource) {
        toRemove.push(ds);
      }
    }
    
    for (const ds of toRemove) {
      try {
        await this.viewer.dataSources.remove(ds, true);
      } catch (e) {
        console.warn('Error removiendo datasource:', e);
      }
    }

    // Determinar qué países resaltar
    let countriesToHighlight: CountryConfig[] = [];
    
    if (this.countries && this.countries.length > 0) {
      // Usar la lista de países
      countriesToHighlight = this.countries.map(c => 
        typeof c === 'string' 
          ? { name: c, color: this.defaultColor, label: this.showLabels }
          : { name: c.name, color: c.color || this.defaultColor, label: c.label ?? this.showLabels }
      );
    } else if (this.countryName) {
      // Usar el país individual (retrocompatibilidad)
      countriesToHighlight = [{ 
        name: this.countryName, 
        color: this.defaultColor, 
        label: this.showLabels 
      }];
    }

    if (countriesToHighlight.length === 0) {
      console.warn('⚠️ No hay países para resaltar');
      return;
    }

    console.log(`🌍 Resaltando ${countriesToHighlight.length} país(es)`);

    const allPositions: Cesium.Cartesian3[] = [];
    const materials: Cesium.ColorMaterialProperty[] = [];

    for (const countryConfig of countriesToHighlight) {
      const feature = this.findCountryFeature(countryConfig.name);
      
      if (!feature) {
        console.warn(`⚠️ País no encontrado: "${countryConfig.name}"`);
        continue;
      }

      console.log(`✅ País encontrado: ${feature.properties?.ADMIN || feature.properties?.NAME}`);

      // Crear GeoJSON para este país
      const singleFeatureGeoJson = {
        type: 'FeatureCollection',
        features: [feature],
      };

      try {
        // Convertir color hex a Cesium Color
        const baseColor = this.hexToColor(countryConfig.color || this.defaultColor, 0.6);
        const blinkColor = this.hexToColor(countryConfig.color || this.defaultColor, 0.9);

        // Cargar país en Cesium
        const ds = await Cesium.GeoJsonDataSource.load(singleFeatureGeoJson, {
          stroke: Cesium.Color.YELLOW,
          fill: baseColor,
          strokeWidth: 3,
          clampToGround: true,
        });
        
        await this.viewer.dataSources.add(ds);

        // Procesar entidades del país
        const entities = ds.entities.values;
        
        entities.forEach(entity => {
          if (entity.polygon) {
            // Configurar material
            const material = new Cesium.ColorMaterialProperty(baseColor);
            entity.polygon.material = material;
            entity.polygon.outline = new Cesium.ConstantProperty(true);
            entity.polygon.outlineColor = new Cesium.ConstantProperty(Cesium.Color.YELLOW);
            entity.polygon.outlineWidth = new Cesium.ConstantProperty(3);

            materials.push(material);

            // Recolectar posiciones para centrar cámara
            const hierarchy = entity.polygon.hierarchy?.getValue(Cesium.JulianDate.now());
            if (hierarchy?.positions) {
              allPositions.push(...hierarchy.positions);
            }
          }
        });

        // Agregar etiqueta si está habilitada
        if (countryConfig.label && allPositions.length > 0) {
          const positions = entities
            .filter(e => e.polygon)
            .flatMap(e => {
              const h = e.polygon?.hierarchy?.getValue(Cesium.JulianDate.now());
              return h?.positions || [];
            });
          
          if (positions.length > 0) {
            const center = Cesium.BoundingSphere.fromPoints(positions).center;
            this.viewer.entities.add({
              position: center,
              label: {
                text: countryConfig.name,
                font: '18px sans-serif',
                fillColor: Cesium.Color.WHITE,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 3,
                outlineColor: Cesium.Color.BLACK,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -10),
              },
            });
          }
        }

      } catch (error) {
        console.error(`❌ Error al cargar el país ${countryConfig.name}:`, error);
      }
    }

    // Animación de parpadeo para todos los países
    if (this.enableBlinking && materials.length > 0) {
      const baseColors = materials.map(m => m.color?.getValue(Cesium.JulianDate.now()));
      
      this.blinkInterval = setInterval(() => {
        materials.forEach((material, index) => {
          const currentColor = material.color?.getValue(Cesium.JulianDate.now());
          const baseColor = baseColors[index];
          
          if (currentColor && baseColor) {
            const isBase = Cesium.Color.equals(currentColor, baseColor);
            const blinkColor = new Cesium.Color(
              baseColor.red,
              baseColor.green,
              baseColor.blue,
              isBase ? 0.9 : 0.6
            );
            material.color = new Cesium.ConstantProperty(isBase ? blinkColor : baseColor);
          }
        });
      }, 800);
    }

    // Centrar cámara en todos los países
    if (allPositions.length > 0) {
      const boundingSphere = Cesium.BoundingSphere.fromPoints(allPositions);
      // Ajustar la distancia para que no haga tanto zoom
      const distance = Math.max(boundingSphere.radius * 3.5, 30000000); // Mínimo 5000km de distancia
      
      this.viewer.camera.flyToBoundingSphere(boundingSphere, {
        duration: 2,
        offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-45), distance)
      });
    }

    console.log('✅ Países resaltados exitosamente');
  }

  private findCountryFeature(countryName: string): any {
    const nameLower = countryName.trim().toLowerCase();
    return (this.countriesGeoJson?.features || []).find((f: any) => {
      const props = f.properties || {};
      const searchFields = [
        'ADMIN', 'NAME', 'SOVEREIGNT', 'NAME_LONG', 
        'FORMAL_EN', 'ISO_A3', 'NAME_ES', 'name', 'admin'
      ];
      
      return searchFields.some(key => {
        const value = props[key];
        return typeof value === 'string' && 
               value.trim().toLowerCase() === nameLower;
      });
    });
  }

  private hexToColor(hex: string, alpha: number = 1): Cesium.Color {
    // Remover el # si existe
    hex = hex.replace('#', '');
    
    // Convertir a RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    return new Cesium.Color(r, g, b, alpha);
  }
}