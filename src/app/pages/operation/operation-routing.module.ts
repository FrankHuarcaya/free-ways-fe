import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {TrafficLightComponent} from "./traffic-light/component/traffic-light.component";
import {AvenueComponent} from "./avenue/component/avenue.component";
import {IntersectionComponent} from "./intersection/component/intersection.component";


const routes: Routes = [
  { path: "traffic-light", component: TrafficLightComponent},
  { path: "avenue", component: AvenueComponent},
  { path: "intersection", component: IntersectionComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationRoutingModule { }
