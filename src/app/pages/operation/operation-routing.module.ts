import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {TrafficLightComponent} from "./traffic-light/component/traffic-light.component";
import {AvenueComponent} from "./avenue/component/avenue.component";
import {IntersectionComponent} from "./intersection/component/intersection.component";
import {LaneGroupComponent} from "./lane-group/component/lane-group.component";
import {TrafficFlow} from "./traffic-flow/models/traffic-flow.model";
import {TrafficFlowComponent} from "./traffic-flow/component/traffic-flow.component";
import {UserComponent} from "./user/component/user.component";


const routes: Routes = [
  { path: "traffic-light", component: TrafficLightComponent},
  { path: "avenue", component: AvenueComponent},
  { path: "intersection", component: IntersectionComponent},
  { path: "lane-group", component: LaneGroupComponent},
  { path: "traffic-flow", component: TrafficFlowComponent},
  { path: "user", component: UserComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationRoutingModule { }
