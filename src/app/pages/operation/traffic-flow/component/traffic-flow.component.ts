import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {LaneGroup} from "../../lane-group/models/lane-group.model";
import {Observable} from "rxjs";
import {LaneGroupService} from "../../lane-group/services/lane-group.service";
import {AvenueService} from "../../avenue/services/avenue.service";
import {IntersectionService} from "../../intersection/services/intersection.service";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {Avenue} from "../../avenue/models/avenue.model";
import {Intersection} from "../../intersection/models/intersection.model";
import {first} from "rxjs/operators";
import {TrafficFlow} from "../models/traffic-flow.model";
import {TrafficFlowService} from "../services/traffic-flow.service";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-traffic-flow',
  templateUrl: './traffic-flow.component.html',
  styleUrls: ['./traffic-flow.component.css']
})
export class TrafficFlowComponent implements OnInit{


  idTrafficFlowOuput: number = 0;

  errorMessage: string = '';



  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  trafficFlowForm!: UntypedFormGroup;
  submitted = false;
  register = true;

  transactions;

  // Table data
  content?: any;
  trafficFlow?: any;
  test: TrafficFlow[] = [];
  trafficFlowList!: Observable<TrafficFlow[]>;
  total: Observable<number>;
  pipe: any;


  avenue?:any;
  selectAvenue=null;

  intersection?:any;
  selectIntersection=null;

  trafficFlowExcel: TrafficFlow[] = [];
  fileName = 'trafficFlow.xlsx';


  constructor(public service: TrafficFlowService,
              private laneGroupService:LaneGroupService,
              private intersectionServices:IntersectionService,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder) {
    this.trafficFlowList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Operaciobes' }, { label: 'Flujo trafico', active: true }];

    /**
     * Form Validation
     */
    this.trafficFlowForm = this.formBuilder.group({
      id: ['0', [Validators.required]],
      timestamp: [''],
      vehicleCount: [''],
      intersection: [''],
      laneGroup: [''],
      btnSave: []
    });

    this.trafficFlowList.subscribe(x => {
      this.content = this.trafficFlowForm;
      this.trafficFlow = Object.assign([], x);
    });
    this.idTrafficFlowOuput = 0;

    this.listTrafficFlow();

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
    return this.trafficFlowForm.controls;
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

  listTrafficFlow() {
    this.service.listTrafficFlow()
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            this.trafficFlow = response; // Asumiendo que tus datos están directamente en la respuesta
            this.trafficFlowExcel=this.trafficFlow;
            console.log("dataExcel",this.trafficFlowExcel);
            this.service.paginationTable(this.trafficFlow);
          } else {
            Swal.fire({
              icon: 'success',
              title: 'Lista',
              text: 'Se pudieron obtener el flujo de trafico.',
            });
          }
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron obtener el flujo de trafico.',
          });
        }
      );
  }

  exportExcel(): void {
    const serviceIncidentExcelData = this.trafficFlowExcel.map((trafficFlow: TrafficFlow) => {
      return {
        id: trafficFlow.id,
        timestamp: trafficFlow.timestamp,
        vehicleCount: trafficFlow.vehicleCount,
        laneGroup: trafficFlow.laneGroup.intersection.name,
      };
    });
    /* pass here the table id */
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(serviceIncidentExcelData);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  registerLaneGroup(laneGroup) {

  }

  updateLaneGroup(laneGroup) {

  }

  clear() {

  }

  enableInputs() {

  }

  deleteLaneGroup(id) {
  }






}
