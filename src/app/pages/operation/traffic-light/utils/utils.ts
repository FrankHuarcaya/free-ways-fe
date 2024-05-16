import {PipeTransform} from "@angular/core";
import {TrafficLight} from "../models/traffic-light.model";

export type SortColumn = keyof TrafficLight | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(trafficLight: TrafficLight[], column: SortColumn, direction: string): TrafficLight[] {
  if (direction === '' || column === '') {
    return trafficLight;
  } else {
    return [...trafficLight].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

export function matches(trafficLight: TrafficLight, term: string,pipe: PipeTransform) {
  return trafficLight.brand.toLowerCase().includes(term.toLowerCase());
}
