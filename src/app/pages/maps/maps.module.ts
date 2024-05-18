import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Google Map
import { GoogleMapsModule } from '@angular/google-maps';
// Leaflet Map
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { UIModule } from '../../shared/ui/ui.module';

import { MapsRoutingModule } from './maps-routing.module';
import { GoogleComponent } from './google/google.component';
import { LeafletComponent } from './leaflet/leaflet.component';
import { AmchartsComponent } from './amcharts/amcharts.component';
import { FlujoFuturoComponent } from './flujo_futuro/flujo_futuro.component';

@NgModule({
  declarations: [GoogleComponent, LeafletComponent,
    AmchartsComponent,FlujoFuturoComponent],
  imports: [
    CommonModule,
    MapsRoutingModule,
    UIModule,
    GoogleMapsModule,
    LeafletModule
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MapsModule { }
