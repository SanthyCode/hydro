# Documentación de Clases Bootstrap 5 en HydroView

Este documento lista y explica todas las clases de Bootstrap 5 utilizadas en el proyecto HydroView.

## Componentes Principales

### Contenedores y Layout
- `container`: Contenedor responsivo con ancho máximo que se ajusta según breakpoint
- `container-fluid`: Contenedor que ocupa el 100% del ancho
- `row`: Fila del sistema grid
- `col-lg-9`, `col-md-8`, `col-lg-3`, `col-md-4`: Columnas del grid system

### Navegación
- `navbar`: Contenedor principal de la barra de navegación
- `navbar-expand-lg`: Expande la navbar horizontalmente en breakpoint lg
- `navbar-dark`: Tema oscuro para la navbar
- `navbar-toggler`: Botón de hamburguesa para móviles
- `navbar-toggler-icon`: Icono del botón de hamburguesa
- `navbar-collapse`: Área colapsable del navbar
- `navbar-nav`: Contenedor de links de navegación
- `nav-item`: Elemento individual de navegación
- `nav-link`: Estilo para enlaces en la navbar
- `navbar-brand`: Logo/marca del sitio

### Tablas
- `table`: Clase base para tablas
- `table-responsive`: Hace la tabla scrollable horizontal
- `table-dark`: Tema oscuro para tablas
- `table-hover`: Efecto hover en filas

### Formularios
- `form-control`: Estilo base para inputs
- `form-label`: Estilo para etiquetas
- `form-check`: Contenedor para checkbox/radio
- `form-check-input`: Input tipo checkbox/radio
- `form-check-label`: Label para checkbox/radio
- `form-range`: Input tipo range

### Tarjetas
- `card`: Contenedor tipo tarjeta
- `card-header`: Encabezado de tarjeta
- `card-body`: Cuerpo de tarjeta

### Botones
- `btn`: Clase base para botones
- `btn-primary`: Botón con color primario
- `btn-outline-light`: Botón outline claro
- `btn-sm`: Botón pequeño

### Badges
- `badge`: Clase base para badges
- Con variantes: `bg-success`, `bg-warning`, `bg-info`

## Utilidades

### Flexbox
- `d-flex`: Display flex
- `flex-column`: Dirección columna
- `justify-content-center`: Centrar en eje principal
- `justify-content-between`: Espaciar entre elementos
- `align-items-center`: Centrar en eje cruzado
- `flex-wrap`: Permite wrap de elementos

### Espaciado
- Márgenes: `m{lado}-{tamaño}` 
  - `me-2`, `me-1`, `me-4`: Margin-end
  - `ms-3`, `ms-lg-2`: Margin-start
  - `mb-5`, `mb-4`, `mb-3`, `mb-0`: Margin-bottom
  - `mt-4`, `mt-3`: Margin-top
- Padding: `p{lado}-{tamaño}`
  - `px-4`: Padding horizontal
  - `py-5`, `py-4`: Padding vertical
  - `pt-5`: Padding-top

### Texto
- Alineación: `text-center`, `text-start`
- Colores: `text-primary`, `text-muted`, `text-light`
- Peso: `fw-bold`, `fw-semibold`
- Decoración: `text-decoration-underline`

### Fondos
- `bg-dark`, `bg-success`, `bg-warning`, `bg-info`, `bg-secondary`

### Bordes y Posición
- `rounded`: Bordes redondeados
- `border`: Borde simple
- `position-relative`: Posicionamiento relativo

## Bootstrap Icons
Las siguientes clases requieren la librería bootstrap-icons:
- `bi bi-arrow-right`: Flecha derecha
- `bi bi-house-door`: Icono casa
- `bi bi-geo-alt`: Icono ubicación
- `bi bi-info-circle`: Icono información
- `bi bi-droplet`: Icono gota
- `bi bi-lightning-charge`: Icono rayo
- `bi bi-globe2`: Icono globo
- `bi bi-droplet-half`: Icono media gota

## Clases Personalizadas del Proyecto
Las siguientes clases son específicas de HydroView:
- `home-container`
- `title`, `subtitle`
- `search-input`
- `state-badge`
- `custom-navbar`
- `logo-glow`
- `brand-text`
- `login-btn`
- `hero-section`, `hero-content`
- `brand-name`
- `stats-box`, `stat-item`
- `btn-explore`, `btn-learn`
- `about-container`
- `features-list`

## Recomendaciones de Uso
1. Utiliza `container` para secciones principales y `container-fluid` cuando necesites ancho completo
2. Combina `row` y `col-*` para layouts responsivos
3. Las utilidades de flexbox son ideales para centrado y distribución de elementos
4. Aprovecha las utilidades de espaciado para mantener consistencia
5. Los componentes como `navbar`, `card` y `table` tienen variantes que pueden combinarse

## Recursos Adicionales
- [Documentación Bootstrap 5](https://getbootstrap.com/docs/5.0/getting-started/introduction/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [Grid System](https://getbootstrap.com/docs/5.0/layout/grid/)