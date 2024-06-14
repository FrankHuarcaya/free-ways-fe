import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../core/services/authfake.service';

import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { login } from 'src/app/store/Authentication/authentication.actions';
import { first } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/store/Authentication/auth.models';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {


  menuItems = [];
  message: any;
  title: any;
  newestOnTop: any;
  progressbar: any;
  toastType: any = 'success';
  easeToast:any = 'ease-in'
  // bread crumb items
  breadCrumbItems: Array<{}>;
  closeButton: any;
  position: any = 'toast-top-right';
  timeouttoast: number = 5000;
  extended: number = 1000;

  fieldTextType!: boolean;


  constructor(private formBuilder: UntypedFormBuilder, private route: ActivatedRoute,
              private router: Router, private authenticationService: AuthenticationService,
              public toastService: ToastrService) { }
  loginForm: UntypedFormGroup;
  submitted = false;
  error = '';
  returnUrl: string;


  // set the currenr year
  year: number = new Date().getFullYear();

  ngOnInit(): void {
    document.body.classList.add("auth-body-bg");
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // swiper config
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true
  };

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {
      let user = new User();
      user.username = this.f.email.value;
      user.password = this.f.password.value;
      this.login(user);
      console.log("usuario prueba",user);
    }
  }

  public showAlert(msg: string, value: string) {
    //const alerta = new AlertView(msg, value);
    //alerta.showToast(this.toastService);
  }

  login(user) {
    this.authenticationService.login(user)
        .pipe(first())
        .subscribe(
            (response) => {
              console.log(response);
              this.router.navigate(['/default']);
              //this.listCheckLists(response.user.id);
            },
            () => {
              this.showAlert("Usuario o contraseña incorrecto", 'error')
            });
  }


  /*
  listCheckLists(idUser) {
    var text = this.title ? this.title : 'Welcome';
    var msg = this.message ? this.message : '';
    var newestontop = this.newestOnTop == true ? true : false
    var progress = this.progressbar == true ? true : false
    var closebtn = this.closeButton == true ? true : false
    this.menuService.listMenusByIdUser(idUser)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.menuItems = response.datos.menuDtoList;
              localStorage.setItem('menuItems', JSON.stringify(this.menuItems));
              this.router.navigate(['/default']);
            } else {
              this.authenticationService.logout();
              this.toastService.error('Debe configurar los permisos para el usuario', 'Error', { timeOut: this.timeouttoast, newestOnTop: newestontop, progressBar: progress, closeButton: closebtn,positionClass:this.position,easing:this.easeToast,extendedTimeOut:this.extended });
            }
          } else {
            this.authenticationService.logout();
          }
        },
        error => {
          this.authenticationService.logout();
        });
  }

  */

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
