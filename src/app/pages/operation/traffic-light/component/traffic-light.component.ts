import {Component, OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {TrafficLight} from "../models/traffic-light.model";
import {Observable} from "rxjs";
import {TrafficLightService} from "../services/traffic-light.service";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {first} from "rxjs/operators";
import {DatePipe} from "@angular/common";
import {Intersection} from "../../intersection/models/intersection.model";
import {IntersectionService} from "../../intersection/services/intersection.service";
import {Avenue} from "../../avenue/models/avenue.model";
import {AvenueService} from "../../avenue/services/avenue.service";
@Component({
  selector: 'app-traffic-light',
  templateUrl: './traffic-light.component.html',
  styleUrls: ['./traffic-light.component.css']
})
export class TrafficLightComponent implements OnInit{

  idTrafficLightOuput: number = 0;

  errorMessage: string = '';
  selectedLatitude:any;
  selectedLongitude:any;


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

  intersection?:any;
  selectIntersection=null;

  avenue?:any;
  selectAvenue=null;

  private updateInterval: any;


  constructor(public service: TrafficLightService,
              private avenueService:AvenueService,
              private intersectionServices:IntersectionService,
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
      greenTime: ['',[Validators.required]],
      intersection: ['', [Validators.required]],
      avenue: ['', [Validators.required]],

      btnSave: []
    });

    this.trafficLightList.subscribe(x => {
      this.content = this.trafficLight;
      this.trafficLight = Object.assign([], x);
    });
    this.idTrafficLightOuput = 0;

    this.listIntersection();
    this.listTrafficLight();
    this.listAvenue();

    this.updateInterval = setInterval(() => {
      this.listTrafficLight();
    }, 60000);  // 60000 ms = 1 minuto

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
          this.deleteTrafficLight(id);
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
    this.selectIntersection=null;
    this.selectAvenue=null;
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
    this.submitted = true
    if (this.trafficLightForm.valid) {
      this.pipe = new DatePipe('en-US');
      const intersectionId = this.selectIntersection.id;
      const avenueId =this.selectAvenue.id;
      const status = this.trafficLightForm.get('status')?.value.toUpperCase();
      const latitude = this.trafficLightForm.get('latitude')?.value;
      const longitude = this.trafficLightForm.get('longitude')?.value;
      const brand = this.trafficLightForm.get('brand')?.value;
      const redTime = this.trafficLightForm.get('redTime')?.value;
      const greenTime = this.trafficLightForm.get('greenTime')?.value;


      let trafficLight = new TrafficLight();
      let intersection=new Intersection();
      let avenue=new Avenue();

      intersection.id=intersectionId;
      avenue.id=avenueId;

      trafficLight.avenue = avenueId;

      trafficLight.intersection = intersectionId;

      trafficLight.status = status;
      trafficLight.latitude = latitude;
      trafficLight.longitude = longitude;
      trafficLight.brand = brand;
      trafficLight.redTime = redTime;
      trafficLight.greenTime = greenTime;

      const id = this.trafficLightForm.get('id')?.value;
      if (id == '0') {
        this.registerTrafficLight(trafficLight);
      } else {
        trafficLight.id = id;
        this.updateTrafficLight(trafficLight);
      }
      this.modalService.dismissAll();
      setTimeout(() => {
        this.trafficLightForm.reset();
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
    var listData = this.trafficLight.filter((data: { id: any; }) => data.id === id);

    this.trafficLightForm.controls['id'].setValue(listData[0].id);
    this.trafficLightForm.controls['status'].setValue(listData[0].status);
    this.trafficLightForm.controls['latitude'].setValue(listData[0].latitude);
    this.trafficLightForm.controls['longitude'].setValue(listData[0].longitude);
    this.trafficLightForm.controls['brand'].setValue(listData[0].brand);
    this.trafficLightForm.controls['redTime'].setValue(listData[0].redTime);
    this.trafficLightForm.controls['greenTime'].setValue(listData[0].greenTime);
    this.idTrafficLightOuput = id;


    this.selectIntersection=listData[0].intersection;
    this.selectAvenue=listData[0].avenue;

    // Centramos el mapa en las coordenadas actuales
    this.selectedLatitude = listData[0].latitude;
    this.selectedLongitude = listData[0].longitude;

  }

  listTrafficLight() {
    this.service.listTrafficLights()
      .pipe(first())
      .subscribe(
        response => {
          console.log("Response:", response);
          if (response && Array.isArray(response)) { // Asegura que la respuesta es un arreglo
            // Ordena el arreglo de semáforos por 'id' de forma ascendente
            this.trafficLight = response.sort((a, b) => a.id - b.id);
            this.service.paginationTable(this.trafficLight);
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
  registerTrafficLight(trafficLight) {
    this.service.registerTrafficLight(trafficLight)
      .pipe(first())
      .subscribe(response => {
        this.listTrafficLight();
        Swal.fire({
          icon: 'success',
          title: 'Registrado',
          text: 'Semáforo registrado correctamente.',
        });
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo registrar el semáforo.',
        });
      });

  }

  updateTrafficLight(trafficLight) {
    this.service.updateTrafficLight(trafficLight)
      .pipe(first())
      .subscribe(response => {
        this.listTrafficLight();
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'Semáforo actualizado correctamente.',
        });
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el semáforo.',
        });
      });
  }

  clear() {
    this.trafficLightForm.controls['id'].setValue("0");
    this.trafficLightForm.controls['intersection'].setValue(null);
    this.trafficLightForm.controls['avenue'].setValue(null);

    this.trafficLightForm.controls['status'].setValue("");
    this.trafficLightForm.controls['latitude'].setValue("");
    this.trafficLightForm.controls['longitude'].setValue("");
    this.trafficLightForm.controls['brand'].setValue("");
    this.trafficLightForm.controls['redTime'].setValue("");
    this.trafficLightForm.controls['greenTime'].setValue("");
  }

  enableInputs() {
    this.trafficLightForm.controls['id'].enable();
    this.trafficLightForm.controls['intersection'].enable();
    this.trafficLightForm.controls['avenue'].enable();

    this.trafficLightForm.controls['status'].enable();
    this.trafficLightForm.controls['latitude'].enable();
    this.trafficLightForm.controls['longitude'].enable();
    this.trafficLightForm.controls['brand'].enable();
    this.trafficLightForm.controls['redTime'].enable();
    this.trafficLightForm.controls['greenTime'].enable();
  }

  deleteTrafficLight(id) {
    this.service.deleteTrafficLight(id)
      .pipe(first())
      .subscribe(response => {
        this.listTrafficLight();
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'Semáforo eliminado correctamente.',
        });
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el semáforo.',
        });
      });
  }

  updateLocation(event: {latitude: number, longitude: number}) {
    this.selectedLatitude = event.latitude;
    this.selectedLongitude = event.longitude;
    this.trafficLightForm.controls['latitude'].setValue(this.selectedLatitude);
    this.trafficLightForm.controls['longitude'].setValue(this.selectedLongitude);
  }

  listIntersection() {
    this.intersectionServices.listIntersection()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            this.intersection = response; // Asumiendo que tus datos están directamente en la respuesta
            this.service.paginationTable(this.intersection);
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

  listAvenue() {
    this.avenueService.listAvenue()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            this.avenue = response; // Asumiendo que tus datos están directamente en la respuesta
            this.service.paginationTable(this.avenue);
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

}
