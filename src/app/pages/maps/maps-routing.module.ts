import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GoogleComponent } from './google/google.component';
import { LeafletComponent } from "./leaflet/leaflet.component";
import { AmchartsComponent } from './amcharts/amcharts.component';
import { FlujoFuturoComponent } from './flujo_futuro/flujo_futuro.component';

const routes: Routes = [
    {
        path: 'google',
        component: GoogleComponent
    },
    {
        path: "leaflet",
        component: LeafletComponent
    }
    ,
    {
        path: "AmChart",
        component: AmchartsComponent
    },
    {
        path: "flujo_futuro",
        component: FlujoFuturoComponent
    }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MapsRoutingModule { }
