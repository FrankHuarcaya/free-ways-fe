import {LaneGroup} from "../models/lane-group.model";

export interface State {

  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: keyof LaneGroup | '';
  sortDirection: 'asc' | 'desc' | '';
  startIndex: number;
  endIndex: number;
  totalRecords: number;
  status: string;
  payment: string;
  date: string;
}
