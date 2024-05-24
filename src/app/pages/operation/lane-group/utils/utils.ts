import {PipeTransform} from "@angular/core";
import {LaneGroup} from "../models/lane-group.model";

export type SortColumn = keyof LaneGroup | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(laneGroup: LaneGroup[], column: SortColumn, direction: string): LaneGroup[] {
  if (direction === '' || column === '') {
    return laneGroup;
  } else {
    return [...laneGroup].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

export function matches(laneGroup: LaneGroup, term: string,pipe: PipeTransform) {
  return laneGroup.direction.toLowerCase().includes(term.toLowerCase());
}
