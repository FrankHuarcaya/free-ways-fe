import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {TrafficLightComponent} from "./traffic-light/component/traffic-light.component";


const routes: Routes = [
  { path: "traffic-light", component: TrafficLightComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationRoutingModule { }
