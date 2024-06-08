import {User} from "../models/user.model";

export interface SearchResult {
  user: User[];
  total: number;
}
