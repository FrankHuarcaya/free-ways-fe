import { Injectable } from '@angular/core';
import {BaseService} from "../../../shared/utils/base-service";
import {HttpClient} from "@angular/common/http";
import {DecimalPipe} from "@angular/common";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {Intersection} from "../../operation/intersection/models/intersection.model";

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService{

  constructor(protected httpClient: HttpClient, private pipe: DecimalPipe) {
    super(httpClient);
  }

  listIntersection(): Observable<Intersection[]> {
    return this.httpClient.get<Intersection[]>(`${environment.server}${environment.operation.intersection.list}`);
  }

  getTrafficFlowReport(intersectionName: string): Observable<any> {
    const formattedIntersectionName = encodeURIComponent(intersectionName);
    return this.httpClient.get(`${environment.server}${environment.operation.dashboard.getTrafficFlowReport}/${formattedIntersectionName}`);
  }

  getAverageVehicleDay(): Observable<any> {
    return this.httpClient.get(`${environment.server}${environment.operation.dashboard.getAverageVehicleDay}`);
  }


}
