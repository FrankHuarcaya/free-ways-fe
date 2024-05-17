import { Injectable } from '@angular/core';

import { getFirebaseBackend } from '../../authUtils';
import { User } from 'src/app/store/Authentication/auth.models';
import { BehaviorSubject, Observable, from, map } from 'rxjs';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })

export class AuthenticationService {
    public currentUser: Observable<User>;
    private currentUserSubject: BehaviorSubject<User>
    private httpClient: HttpClient;

    constructor(handler: HttpBackend) {
        this.httpClient = new HttpClient(handler);
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem("access")));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    /**
     * Returns the current user
     */
    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }


    /**
     * Performs the auth
     * @param email email of user
     * @param password password of user
     */
    login(user) {
        return this.httpClient.post(environment.server + environment.security.user.login, user)
            .pipe(map((user: any) => {
                // login successful if there's a jwt token in the response
                if (user && user.access) {
                    localStorage.setItem('refresh', JSON.stringify(user.refresh));
                    localStorage.setItem('access', JSON.stringify(user.access));
                    this.currentUserSubject.next(user);
                }
                return user;
            }));
    }

    /**
     * Performs the register
     * @param email email
     * @param password password
     */


    /**
     * Reset password
     * @param email email
     */
    resetPassword(email: string) {
        return getFirebaseBackend().forgetPassword(email).then((response: any) => {
            const message = response.data;
            return message;
        });
    }

    /**
     * Logout the user
     */
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        this.currentUserSubject.next(null);
    }
}

