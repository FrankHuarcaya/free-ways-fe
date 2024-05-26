import {Intersection} from "../../intersection/models/intersection.model";
import {Avenue} from "../../avenue/models/avenue.model";

export class LaneGroup {
  id: any;
  avenue:Avenue;
  direction:string;
  capacity:number;
  numLanes:number;
  intersection:Intersection;
}
