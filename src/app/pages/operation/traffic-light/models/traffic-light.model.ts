import {Intersection} from "../../intersection/models/intersection.model";

export class TrafficLight {
  id: any;
  status:string;
  latitude:string;
  longitude:string;
  brand:string;
  redTime:number;
  redGreen:number;
  intersection:Intersection;
}
