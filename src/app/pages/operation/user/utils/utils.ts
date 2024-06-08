import {PipeTransform} from "@angular/core";
import {User} from "../models/user.model";

export type SortColumn = keyof User | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(user: User[], column: SortColumn, direction: string): User[] {
  if (direction === '' || column === '') {
    return user;
  } else {
    return [...user].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

export function matches(user: User, term: string,pipe: PipeTransform) {
  return user.first_name.toLowerCase().includes(term.toLowerCase());
}
