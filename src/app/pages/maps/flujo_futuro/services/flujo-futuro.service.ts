import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DecimalPipe} from "@angular/common";
import {ResponseModel} from "../../../../shared/utils/response-model";
import {environment} from "../../../../../environments/environment";
import {catchError, debounceTime, delay, map, switchMap, tap} from "rxjs/operators";
import {BaseService} from "../../../../shared/utils/base-service";

@Injectable({
  providedIn: 'root'
})
export class FlujoFuturoService extends BaseService{
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _total$ = new BehaviorSubject<number>(0);
  private avenue: any;

  content?: any;
  products?: any;



  constructor(protected httpClient: HttpClient,private pipe: DecimalPipe) {
    super(httpClient);
  }


  //consume APIS
  public twoLanetrafficPrediction(timestamp: any): Observable<ResponseModel<any>> {
    return this.httpClient.post(environment.server + environment.operation.predictions.list, timestamp)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

}
