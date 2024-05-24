import {LaneGroup} from "../models/lane-group.model";

export interface SearchResult {
  laneGroup: LaneGroup[];
  total: number;
}
