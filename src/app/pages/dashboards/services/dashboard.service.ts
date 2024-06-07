import { Injectable } from '@angular/core';
import {BaseService} from "../../../shared/utils/base-service";
import {HttpClient} from "@angular/common/http";
import {DecimalPipe} from "@angular/common";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService{

  constructor(protected httpClient: HttpClient, private pipe: DecimalPipe) {
    super(httpClient);
  }

  getTrafficFlowReport(): Observable<any> {
    return this.httpClient.get(`${environment.server}${environment.operation.dashboard.list}`);
  }


}
