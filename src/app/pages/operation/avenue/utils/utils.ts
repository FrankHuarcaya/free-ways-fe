import {PipeTransform} from "@angular/core";
import {Avenue} from "../models/avenue.model";

export type SortColumn = keyof Avenue | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(avenue: Avenue[], column: SortColumn, direction: string): Avenue[] {
  if (direction === '' || column === '') {
    return avenue;
  } else {
    return [...avenue].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

export function matches(avenue: Avenue, term: string,pipe: PipeTransform) {
  return avenue.name.toLowerCase().includes(term.toLowerCase());
}
