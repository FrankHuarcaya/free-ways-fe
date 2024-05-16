import {TrafficLight} from "../models/traffic-light.model";

export interface SearchResult {
  trafficLight: TrafficLight[];
  total: number;
}
