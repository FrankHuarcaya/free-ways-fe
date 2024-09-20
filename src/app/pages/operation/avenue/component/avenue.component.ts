import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {TrafficLight} from "../../traffic-light/models/traffic-light.model";
import {Observable} from "rxjs";
import {TrafficLightService} from "../../traffic-light/services/traffic-light.service";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {Avenue} from "../models/avenue.model";
import {AvenueService} from "../services/avenue.service";
import {Intersection} from "../../intersection/models/intersection.model";
import {IntersectionService} from "../../intersection/services/intersection.service";

@Component({
  selector: 'app-avenue',
  templateUrl: './avenue.component.html',
  styleUrls: ['./avenue.component.css']
})
export class AvenueComponent implements OnInit{

  idAvenueOuput: number = 0;

  errorMessage: string = '';
  selectedLatitude:any;
  selectedLongitude:any;


  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  avenueForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  avenue?: any;
  test: Avenue[] = [];
  avenueList!: Observable<Avenue[]>;
  total: Observable<number>;
  pipe: any;



  constructor(public service: AvenueService,
              private intersectionServices:IntersectionService,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder) {
    this.avenueList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Operaciobes' }, { label: 'avenidas', active: true }];

    /**
     * Form Validation
     */
    this.avenueForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      lengthMeters: ['',[Validators.required]],
      btnSave: []
    });

    this.avenueList.subscribe(x => {
      this.content = this.avenue;
      this.avenue = Object.assign([], x);
    });
    this.idAvenueOuput = 0;

    this.listAvenue();
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
          this.deleteAvenue(id);
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
    return this.avenueForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.avenueForm.valid) {
      this.pipe = new DatePipe('en-US');
      const name = this.avenueForm.get('name')?.value.toUpperCase();
      const description = this.avenueForm.get('description')?.value;
      const lengthMeters = this.avenueForm.get('lengthMeters')?.value;


      let avenue = new Avenue();

      avenue.name = name;
      avenue.description = description;
      avenue.lengthMeters = lengthMeters;


      const id = this.avenueForm.get('id')?.value;
      if (id == '0') {
        this.registerAvenue(avenue);
      } else {
        avenue.id = id;
        this.updateAvenue(avenue);
      }
      this.modalService.dismissAll();
      setTimeout(() => {
        this.avenueForm.reset();
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
    modelTitle.innerHTML = 'Actualizar semaforos';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Actualizar";
    var listData = this.avenue.filter((data: { id: any; }) => data.id === id);

    this.avenueForm.controls['id'].setValue(listData[0].id);
    this.avenueForm.controls['name'].setValue(listData[0].name);
    this.avenueForm.controls['description'].setValue(listData[0].description);
    this.avenueForm.controls['lengthMeters'].setValue(listData[0].lengthMeters);



    this.idAvenueOuput = id;

  }

  listAvenue() {
    this.service.listAvenue()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            this.avenue = response;
            this.service.paginationTable(this.avenue);
          } else {
            Swal.fire({
              icon: 'success',
              title: 'Lista',
              text: 'Se pudieron obtener las avenidas.',
            });
          }
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron obtener las avenidas.',
          });
        }
      );
  }
  registerAvenue(avenue) {
    this.service.registerAvenue(avenue)
      .pipe(first())
      .subscribe(response => {
        this.listAvenue();
        Swal.fire({
          icon: 'success',
          title: 'Registrado',
          text: 'Avenida registrado correctamente.',
        });
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo registrar la avenida.',
        });
      });
  }

  updateAvenue(avenue) {
    this.service.updateAvenue(avenue)
      .pipe(first())
      .subscribe(response => {
        this.listAvenue();
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
    this.avenueForm.controls['id'].setValue("0");
    this.avenueForm.controls['name'].setValue(null);
    this.avenueForm.controls['description'].setValue("");
    this.avenueForm.controls['lengthMeters'].setValue("");

  }

  enableInputs() {
    this.avenueForm.controls['id'].enable();
    this.avenueForm.controls['name'].enable();
    this.avenueForm.controls['description'].enable();
    this.avenueForm.controls['lengthMeters'].enable();

  }

  deleteAvenue(id) {
    this.service.deleteAvenue(id)
      .pipe(first())
      .subscribe(response => {
        this.listAvenue();
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'avenida eliminado correctamente.',
        });
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la avenida.',
        });
      });
  }

}
