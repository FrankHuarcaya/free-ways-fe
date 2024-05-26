import {Intersection} from "../../intersection/models/intersection.model";

export class TrafficLight {
  id: any;
  status:string;
  latitude:string;
  longitude:string;
  brand:string;
  redTime:number;
  greenTime:number;
  intersection:Intersection;
}
