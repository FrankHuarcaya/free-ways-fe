import {Component, OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {TrafficLight} from "../models/traffic-light.model";
import {Observable} from "rxjs";
import {TrafficLightService} from "../services/traffic-light.service";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {first} from "rxjs/operators";
@Component({
  selector: 'app-traffic-light',
  templateUrl: './traffic-light.component.html',
  styleUrls: ['./traffic-light.component.css']
})
export class TrafficLightComponent implements OnInit{

  idCustomerOuput: number = 0;

  errorMessage: string = '';


  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  trafficLightForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  trafficLight?: any;
  test: TrafficLight[] = [];
  trafficLightList!: Observable<TrafficLight[]>;
  total: Observable<number>;
  pipe: any;

  constructor(public service: TrafficLightService,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder) {
    this.trafficLightList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Operaciobes' }, { label: 'semaforos', active: true }];

    /**
     * Form Validation
     */
    this.trafficLightForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      status: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
      longitude: ['',[Validators.required]],
      brand: [''],
      redTime: ['',[Validators.required]],
      redGreen: ['',[Validators.required]],
      btnSave: []
    });

    this.trafficLightList.subscribe(x => {
      this.content = this.trafficLight;
      this.trafficLight = Object.assign([], x);
    });
    this.idCustomerOuput = 0;

    this.listTrafficLight();
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
          this.deleteCustomer(id);
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
    return this.trafficLightForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {

  }

  /**
   * Open Edit modal
   * @param content modal content
   */
  editDataGet(id: any, content: any) {

  }

  listTrafficLight() {
    this.service.listTrafficLights()
        .pipe(first())
        .subscribe(
            response => {
              console.log("Response:", response);
              if (response) {
                this.trafficLight = response; // Asumiendo que tus datos están directamente en la respuesta
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'No se pudieron obtener los semáforos.',
                });
              }
            },
            error => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron obtener los semáforos.',
              });
            }
        );
  }
  registerCustomer(customers) {

  }

  updateCustomer(customers) {
  }

  clear() {
    this.trafficLightForm.controls['id'].setValue("0");
    this.trafficLightForm.controls['status'].setValue(null);
    this.trafficLightForm.controls['latitude'].setValue("");
    this.trafficLightForm.controls['longitude'].setValue("");
    this.trafficLightForm.controls['brand'].setValue("");
    this.trafficLightForm.controls['redTime'].setValue("");
    this.trafficLightForm.controls['redGreen'].setValue("");
  }

  enableInputs() {
    this.trafficLightForm.controls['id'].enable();
    this.trafficLightForm.controls['status'].enable();
    this.trafficLightForm.controls['latitude'].enable();
    this.trafficLightForm.controls['longitude'].enable();
    this.trafficLightForm.controls['brand'].enable();
    this.trafficLightForm.controls['redTime'].enable();
    this.trafficLightForm.controls['redGreen'].enable();

  }

  deleteCustomer(id) {
  }

}
