import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {TrafficLight} from "../../traffic-light/models/traffic-light.model";
import {Observable} from "rxjs";
import {TrafficLightService} from "../../traffic-light/services/traffic-light.service";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {first} from "rxjs/operators";
import {BaseService} from "../../../../shared/utils/base-service";
import {LaneGroup} from "../models/lane-group.model";
import {LaneGroupService} from "../services/lane-group.service";
import {Avenue} from "../../avenue/models/avenue.model";
import {Intersection} from "../../intersection/models/intersection.model";
import {AvenueService} from "../../avenue/services/avenue.service";
import {IntersectionService} from "../../intersection/services/intersection.service";

@Component({
  selector: 'app-lane-group',
  templateUrl: './lane-group.component.html',
  styleUrls: ['./lane-group.component.css']
})
export class LaneGroupComponent implements OnInit{

  idLaneGroupOuput: number = 0;

  errorMessage: string = '';



  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  laneGroupForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  laneGroup?: any;
  test: LaneGroup[] = [];
  laneGroupList!: Observable<LaneGroup[]>;
  total: Observable<number>;
  pipe: any;


  avenue?:any;
  selectAvenue=null;

  intersection?:any;
  selectIntersection=null;

  constructor(public service: LaneGroupService,
              private avenueService:AvenueService,
              private intersectionServices:IntersectionService,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder) {
    this.laneGroupList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Operaciobes' }, { label: 'Grupo carriles', active: true }];

    /**
     * Form Validation
     */
    this.laneGroupForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      intersection: ['', [Validators.required]],
      avenue: ['', [Validators.required]],
      direction: [''],
      capacity: [''],
      numLanes: [''],
      btnSave: []
    });

    this.laneGroupList.subscribe(x => {
      this.content = this.laneGroupForm;
      this.laneGroup = Object.assign([], x);
    });
    this.idLaneGroupOuput = 0;

    this.listAvenue();
    this.listIntersection();
    this.listLaneGroup();
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
          this.deleteLaneGroup(id);
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
    return this.laneGroupForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true
    if (this.laneGroupForm.valid) {
      this.pipe = new DatePipe('en-US');
      const avenueId =this.selectAvenue.id;
      const intersectionId = this.selectIntersection.id;
      const direction = this.laneGroupForm.get('direction')?.value;
      const capacity = this.laneGroupForm.get('capacity')?.value;
      const numLanes = this.laneGroupForm.get('numLanes')?.value;



      let laneGroup = new LaneGroup();
      let avenue=new Avenue();
      let intersection=new Intersection();
      avenue.id=avenueId;
      intersection.id=intersectionId;

      laneGroup.avenue = avenueId;
      laneGroup.intersection = intersectionId;

      laneGroup.direction = direction;
      laneGroup.capacity = capacity;
      laneGroup.numLanes = numLanes;

      console.log(laneGroup);
      const id = this.laneGroupForm.get('id')?.value;
      if (id == '0') {
        this.registerLaneGroup(laneGroup);
      } else {
        laneGroup.id = id;
        this.updateLaneGroup(laneGroup);
      }
      this.modalService.dismissAll();
      setTimeout(() => {
        this.laneGroupForm.reset();
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
    var listData = this.laneGroup.filter((data: { id: any; }) => data.id === id);

    this.laneGroupForm.controls['id'].setValue(listData[0].id);
    this.laneGroupForm.controls['direction'].setValue(listData[0].direction);
    this.laneGroupForm.controls['capacity'].setValue(listData[0].capacity);
    this.laneGroupForm.controls['numLanes'].setValue(listData[0].numLanes);

    this.selectAvenue=listData[0].avenue;
    this.selectIntersection=listData[0].intersection;


    console.log("intersection",this.selectIntersection);
    console.log("Avenue",this.selectAvenue);


    this.idLaneGroupOuput = id;
  }

  listLaneGroup() {
    this.service.listLaneGroup()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            this.laneGroup = response; // Asumiendo que tus datos están directamente en la respuesta
            this.service.paginationTable(this.laneGroup);
          } else {
            Swal.fire({
              icon: 'success',
              title: 'Lista',
              text: 'Se pudieron obtener los carriles.',
            });
          }
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron obtener los carriles.',
          });
        }
      );
  }
  registerLaneGroup(laneGroup) {
    this.service.registerLaneGroup(laneGroup)
      .pipe(first())
      .subscribe(response => {
        this.listLaneGroup();
        Swal.fire({
          icon: 'success',
          title: 'Registrado',
          text: 'Carriles registrado correctamente.',
        });
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo registrar el carriles.',
        });
      });
  }

  updateLaneGroup(laneGroup) {
    this.service.updateLaneGroup(laneGroup)
      .pipe(first())
      .subscribe(response => {
        this.listLaneGroup();
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'Carriles actualizado correctamente.',
        });
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el carriles.',
        });
      });
  }

  clear() {
    this.laneGroupForm.controls['id'].setValue("0");
    this.laneGroupForm.controls['intersection'].setValue(null);
    this.laneGroupForm.controls['avenue'].setValue(null);
    this.laneGroupForm.controls['direction'].setValue("");
    this.laneGroupForm.controls['capacity'].setValue("");
    this.laneGroupForm.controls['numLanes'].setValue("");
  }

  enableInputs() {
    this.laneGroupForm.controls['id'].enable();
    this.laneGroupForm.controls['intersection'].enable();
    this.laneGroupForm.controls['avenue'].enable();
    this.laneGroupForm.controls['direction'].enable();
    this.laneGroupForm.controls['capacity'].enable();
    this.laneGroupForm.controls['numLanes'].enable();
  }

  deleteLaneGroup(id) {
    this.service.deleteLaneGroup(id)
      .pipe(first())
      .subscribe(response => {
        this.listLaneGroup();
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'Semáforo eliminado correctamente.',
        });
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el carril.',
        });
      });
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
