import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import {config} from "../../shared/shared.config";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {


    constructor(
        private authenticationService: AuthenticationService,
        private toastrService: ToastrService) { }

    public showAlert(msg: string, value: string) {
        //const alerta = new AlertView(msg, value);
        //alerta.showToast(this.toastrService);
    }


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            let error: string = "";
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.showAlert('Credenciales inválidas', 'error')
                this.authenticationService.logout();
                location.reload();
            }

            if (err.status === 403) {
                this.showAlert('El usuario no tiene los permisos suficientes.', 'warning')
                return throwError(error);
            }

            if (err.status === 405) {
                this.showAlert(config.NOTIENEPERMISOS, 'warning')
                return throwError(error);
            }

            if (err.status === 400) {
                error = config.BADREQUEST;
                this.showAlert(config.BADREQUEST, 'error')
                return throwError(error);
            }

            if (err.status === 500) {
                this.showAlert(config.PROBLEMAENELSERVIDOR, 'error')
                return throwError(error);
            }

            if (err.url == null) {
                this.showAlert(config.NOHAYCOMUNICACION, 'error')
                return throwError(error);
            }

            error = err.message || err.statusText;
            return throwError(config.NOHAYCOMUNICACION);
        }));
    }
}
