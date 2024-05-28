import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {Intersection} from "../models/intersection.model";
import {IntersectionService} from "../services/intersection.service";

@Component({
  selector: 'app-intersection',
  templateUrl: './intersection.component.html',
  styleUrls: ['./intersection.component.css']
})
export class IntersectionComponent implements OnInit{

  idIntersectionOuput: number = 0;

  errorMessage: string = '';
  selectedLatitude:any;
  selectedLongitude:any;


  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  intersectionForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  intersection?: any;
  test: Intersection[] = [];
  intersectionList!: Observable<Intersection[]>;
  total: Observable<number>;
  pipe: any;

  constructor(public service: IntersectionService,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder) {
    this.intersectionList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Operaciobes' }, { label: 'intersecciones', active: true }];

    /**
     * Form Validation
     */
    this.intersectionForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      location: [''],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],

      btnSave: []
    });

    this.intersectionList.subscribe(x => {
      this.content = this.intersection;
      this.intersection = Object.assign([], x);
    });
    this.idIntersectionOuput = 0;

    this.listIntersection();
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
          this.deleteIntersection(id);
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
    return this.intersectionForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.intersectionForm.valid) {
      this.pipe = new DatePipe('en-US');
      const name = this.intersectionForm.get('name')?.value.toUpperCase();
      const location = this.intersectionForm.get('location')?.value;
      const latitude = this.intersectionForm.get('latitude')?.value;
      const longitude = this.intersectionForm.get('longitude')?.value;

      let intersection = new Intersection();
      intersection.name = name;
      intersection.location = location;
      intersection.latitude = latitude;
      intersection.longitude = longitude;


      const id = this.intersectionForm.get('id')?.value;
      if (id == '0') {
        this.registerIntersection(intersection);
      } else {
        intersection.id = id;
        this.updateIntersection(intersection);
      }
      this.modalService.dismissAll();
      setTimeout(() => {
        this.intersectionForm.reset();
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
    var listData = this.intersection.filter((data: { id: any; }) => data.id === id);

    this.intersectionForm.controls['id'].setValue(listData[0].id);
    this.intersectionForm.controls['name'].setValue(listData[0].name);
    this.intersectionForm.controls['location'].setValue(listData[0].location);
    this.intersectionForm.controls['latitude'].setValue(listData[0].latitude);
    this.intersectionForm.controls['longitude'].setValue(listData[0].longitude);

    this.idIntersectionOuput = id;
    // Centramos el mapa en las coordenadas actuales
    this.selectedLatitude = listData[0].latitude;
    this.selectedLongitude = listData[0].longitude;
  }

  listIntersection() {
    this.service.listIntersection()
      .pipe(first())
      .subscribe(
        response => {
          console.log("Response:", response);
          if (response) {
            this.intersection = response; // Asumiendo que tus datos están directamente en la respuesta
            this.service.paginationTable(this.intersection);
          } else {
            Swal.fire({
              icon: 'success',
              title: 'Lista',
              text: 'Se pudieron obtener las intersecciones.',
            });
          }
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron obtener las intersecciones.',
          });
        }
      );
  }
  registerIntersection(intersection) {
    this.service.registerIntersection(intersection)
      .pipe(first())
      .subscribe(response => {
        this.listIntersection();
        Swal.fire({
          icon: 'success',
          title: 'Registrado',
          text: 'Interseccion registrado correctamente.',
        });
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo registrar la interseccion.',
        });
      });
  }

  updateIntersection(intersection) {
    this.service.updateIntersection(intersection)
      .pipe(first())
      .subscribe(response => {
        this.listIntersection();
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'Interseccion actualizado correctamente.',
        });
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar la Interseccion.',
        });
      });
  }

  clear() {
    this.intersectionForm.controls['id'].setValue("0");
    this.intersectionForm.controls['name'].setValue("");
    this.intersectionForm.controls['location'].setValue("");
    this.intersectionForm.controls['latitude'].setValue("");
    this.intersectionForm.controls['longitude'].setValue("");

  }

  enableInputs() {
    this.intersectionForm.controls['id'].enable();
    this.intersectionForm.controls['name'].enable();
    this.intersectionForm.controls['location'].enable();
    this.intersectionForm.controls['latitude'].enable();
    this.intersectionForm.controls['longitude'].enable();

  }

  deleteIntersection(id) {
    this.service.deleteIntersection(id)
      .pipe(first())
      .subscribe(response => {
        this.listIntersection();
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'Interseccion eliminado correctamente.',
        });
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la interseccion.',
        });
      });
  }

  updateLocation(event: {latitude: number, longitude: number}) {
    this.selectedLatitude = event.latitude;
    this.selectedLongitude = event.longitude;
    this.intersectionForm.controls['latitude'].setValue(this.selectedLatitude);
    this.intersectionForm.controls['longitude'].setValue(this.selectedLongitude);
  }

}
