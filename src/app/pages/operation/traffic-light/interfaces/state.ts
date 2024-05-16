import {TrafficLight} from "../models/traffic-light.model";

export interface State {

  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: keyof TrafficLight | '';
  sortDirection: 'asc' | 'desc' | '';
  startIndex: number;
  endIndex: number;
  totalRecords: number;
  status: string;
  payment: string;
  date: string;
}
