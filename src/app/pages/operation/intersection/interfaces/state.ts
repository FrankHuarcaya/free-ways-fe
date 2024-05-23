import {Intersection} from "../models/intersection.model";

export interface State {

  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: keyof Intersection | '';
  sortDirection: 'asc' | 'desc' | '';
  startIndex: number;
  endIndex: number;
  totalRecords: number;
  status: string;
  payment: string;
  date: string;
}
