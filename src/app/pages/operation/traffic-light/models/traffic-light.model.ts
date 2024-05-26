import {Intersection} from "../../intersection/models/intersection.model";
import {Avenue} from "../../avenue/models/avenue.model";

export class TrafficLight {
  id: any;
  status:string;
  latitude:string;
  longitude:string;
  brand:string;
  redTime:number;
  greenTime:number;
  intersection:Intersection;
  avenue:Avenue;
}
