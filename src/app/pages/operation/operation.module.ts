import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TrafficLightComponent} from "./traffic-light/component/traffic-light.component";
import {OperationRoutingModule} from "./operation-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbDatepickerModule, NgbModalModule, NgbNavModule, NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {UIModule} from "../../shared/ui/ui.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {MapsModule} from "../maps/maps.module";
import { AvenueComponent } from './avenue/component/avenue.component';
import { IntersectionComponent } from './intersection/component/intersection.component';
import { LaneGroupComponent } from './lane-group/component/lane-group.component';
@NgModule({
  declarations: [TrafficLightComponent, AvenueComponent, IntersectionComponent, LaneGroupComponent],
    imports: [
        CommonModule,
        OperationRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbNavModule,
        NgbModalModule,
        NgbPaginationModule,
        UIModule,
        // Ng2SearchPipeModule,
        NgbDatepickerModule,
        NgSelectModule,
        MapsModule
    ]
})
export class OperationModule { }
