import {Intersection} from "../../intersection/models/intersection.model";
import {Avenue} from "../../avenue/models/avenue.model";
import {LaneGroup} from "../../lane-group/models/lane-group.model";

export class TrafficFlow {
  id: any;
  timestamp:any;
  vehicleCount:any;
  intersection:Intersection;
  laneGroup:LaneGroup;
}
