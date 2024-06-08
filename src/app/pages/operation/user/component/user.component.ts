import { Component } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Avenue} from "../../avenue/models/avenue.model";
import {Observable} from "rxjs";
import {AvenueService} from "../../avenue/services/avenue.service";
import {IntersectionService} from "../../intersection/services/intersection.service";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {User} from "../models/user.model";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  idUserOuput: number = 0;

  errorMessage: string = '';
  selectedLatitude:any;
  selectedLongitude:any;


  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  userForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  user?: any;
  test: User[] = [];
  userList!: Observable<User[]>;
  total: Observable<number>;
  pipe: any;
  typeRole: string[] = ['admin', 'monitor','analyst'];
  activeType: string[] = ['False', 'True'];


  constructor(public service: UserService,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder) {
    this.userList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Operaciobes' }, { label: 'usuarios', active: true }];

    /**
     * Form Validation
     */
    this.userForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      first_name: ['',[Validators.required]],
      last_name: ['',[Validators.required]],
      role: ['',[Validators.required]],
      is_active: ['',[Validators.required]],
      password: ['',[Validators.required]],

      btnSave: []
    });

    this.userList.subscribe(x => {
      this.content = this.user;
      this.user = Object.assign([], x);
    });
    this.idUserOuput = 0;

    this.listUser();
    console.log("Test")
  }

  /**
   * Open modal
   * @param content modal content
   */
  openViewModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  delete(id: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ms-2'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons
        .fire({
          title: '¿Está seguro?',
          text: '¡No podrás revertir esto!',
          icon: 'warning',
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar',
          showCancelButton: true
        })
        .then(result => {
          if (result.value) {
            this.deleteUser(id);
          } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire(
                'Cancelled',
                'Your imaginary file is safe :)',
                'error'
            );
          }
        });
  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.clear();
    this.submitted = false;
    this.enableInputs();
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg'
    };
    this.modalService.open(content, ngbModalOptions);
  }

  /**
   * Form data get
   */
  get form() {
    return this.userForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.userForm.valid) {
      this.pipe = new DatePipe('en-US');
      const username = this.userForm.get('username')?.value;
      const email = this.userForm.get('email')?.value;
      const first_name = this.userForm.get('first_name')?.value;
      const last_name = this.userForm.get('last_name')?.value;
      const role = this.userForm.get('role')?.value;
      const is_active = this.userForm.get('is_active')?.value;
      const password = this.userForm.get('password')?.value;


      let user = new User();

      user.username = username;
      user.email = email;
      user.first_name = first_name;
      user.last_name = last_name;
      user.role = role;
      user.is_active = is_active;
      user.password = password;


      const id = this.userForm.get('id')?.value;
      if (id == '0') {
        this.registerUser(user);
      } else {
        user.id = id;
        this.updateUser(user);
      }
      this.modalService.dismissAll();
      setTimeout(() => {
        this.userForm.reset();
      }, 2000);
    }
  }

  /**
   * Open Edit modal
   * @param content modal content
   */
  editDataGet(id: any, content: any) {
    this.submitted = false;
    this.pipe = new DatePipe('en-US');
    this.enableInputs();
    this.modalService.open(content, { size: 'lg', centered: true });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Actualizar usuarios';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.user.filter((data: { id: any; }) => data.id === id);

    this.userForm.controls['id'].setValue(listData[0].id);
    this.userForm.controls['username'].setValue(listData[0].username);
    this.userForm.controls['email'].setValue(listData[0].email);
    this.userForm.controls['first_name'].setValue(listData[0].first_name);
    this.userForm.controls['last_name'].setValue(listData[0].last_name);
    this.userForm.controls['role'].setValue(listData[0].role);
    this.userForm.controls['is_active'].setValue(listData[0].is_active);
    this.userForm.controls['password'].setValue(listData[0].password);

    this.idUserOuput = id;

  }

  listUser() {
    this.service.listUser()
        .pipe(first())
        .subscribe(
            response => {
              console.log("usuarios:", response);
              if (response) {
                this.user = response; // Asumiendo que tus datos están directamente en la respuesta
                this.service.paginationTable(this.user);
              } else {
                Swal.fire({
                  icon: 'success',
                  title: 'Lista',
                  text: 'Se pudieron obtener los usuarios.',
                });
              }
            },
            error => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron obtener los usuarios.',
              });
            }
        );
  }
  registerUser(user) {
    this.service.registerUser(user)
        .pipe(first())
        .subscribe(response => {
          this.listUser();
          Swal.fire({
            icon: 'success',
            title: 'Registrado',
            text: 'usuario registrado correctamente.',
          });
        }, error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo registrar el usuario.',
          });
        });
  }

  updateUser(user) {
    this.service.updateUser(user)
        .pipe(first())
        .subscribe(response => {
          this.listUser();
          Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: 'Avenida actualizado correctamente.',
          });
        }, error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar la avenida.',
          });
        });
  }

  clear() {
    this.userForm.controls['id'].setValue("0");
    this.userForm.controls['username'].setValue("");
    this.userForm.controls['email'].setValue("");
    this.userForm.controls['first_name'].setValue("");
    this.userForm.controls['last_name'].setValue("");
    this.userForm.controls['role'].setValue(null);
    this.userForm.controls['is_active'].setValue("");
    this.userForm.controls['password'].setValue("");

  }

  enableInputs() {
    this.userForm.controls['id'].enable();
    this.userForm.controls['username'].enable();
    this.userForm.controls['email'].enable();
    this.userForm.controls['first_name'].enable();
    this.userForm.controls['last_name'].enable();
    this.userForm.controls['role'].enable();
    this.userForm.controls['is_active'].enable();
    this.userForm.controls['password'].enable();
  }

  deleteUser(id) {
    this.service.deleteUser(id)
        .pipe(first())
        .subscribe(response => {
          this.listUser();
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'usuario eliminado correctamente.',
          });
        }, error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el usuario.',
          });
        });
  }

}
