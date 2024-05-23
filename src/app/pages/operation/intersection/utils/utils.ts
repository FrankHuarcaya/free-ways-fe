import {PipeTransform} from "@angular/core";
import {Intersection} from "../models/intersection.model";

export type SortColumn = keyof Intersection | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(intersection: Intersection[], column: SortColumn, direction: string): Intersection[] {
  if (direction === '' || column === '') {
    return intersection;
  } else {
    return [...intersection].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

export function matches(intersection: Intersection, term: string,pipe: PipeTransform) {
  return intersection.name.toLowerCase().includes(term.toLowerCase());
}
