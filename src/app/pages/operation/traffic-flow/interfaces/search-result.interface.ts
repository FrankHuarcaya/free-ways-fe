import {TrafficFlow} from "../models/traffic-flow.model";

export interface SearchResult {
  trafficFlow: TrafficFlow[];
  total: number;
}
