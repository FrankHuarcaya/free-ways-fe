import {PipeTransform} from "@angular/core";
import {TrafficFlow} from "../models/traffic-flow.model";

export type SortColumn = keyof TrafficFlow | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(trafficFlow: TrafficFlow[], column: SortColumn, direction: string): TrafficFlow[] {
  if (direction === '' || column === '') {
    return trafficFlow;
  } else {
    return [...trafficFlow].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

export function matches(trafficFlow: TrafficFlow, term: string,pipe: PipeTransform) {
  return trafficFlow.laneGroup.intersection.name.toLowerCase().includes(term.toLowerCase());
}
