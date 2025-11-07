import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobeMapComponent } from './globe-map.component';

describe('GlobeMapComponent', () => {
  let component: GlobeMapComponent;
  let fixture: ComponentFixture<GlobeMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GlobeMapComponent]
    });
    fixture = TestBed.createComponent(GlobeMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
