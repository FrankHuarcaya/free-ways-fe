import { Component, OnInit, Input, Inject, PLATFORM_ID, AfterViewInit, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import {TrafficLightService} from "../../../operation/traffic-light/services/traffic-light.service";
import { FlujoFuturoService } from '../services/flujo-futuro.service';
import { Options } from '@angular-slider/ngx-slider';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-flujo_futuro',
  templateUrl: './flujo_futuro.component.html',
  styleUrls: ['./flujo_futuro.component.scss']
})

/**
 * Google component
 */
export class FlujoFuturoComponent implements OnInit,AfterViewInit  {
  @ViewChild(GoogleMap) mapComponent: GoogleMap;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  @Input() pitch: number = 10;
  @Input() scrollwheel: boolean = false; 

  //Informacion del Mapa
  mapOptions: google.maps.MapOptions = {
    mapId: "f2e2bcb142ab033c",
    center: { lat: -12.04318, lng: -77.02824 },
    zoom: 12,
    minZoom: 12,
    maxZoom: 20,
  };

  //Slider Options
  options: Options = {
    showTicks: true,
    showTicksValues: true,
    stepsArray: [
      { value: 15, legend: "Corto Plazo" },
      { value: 30, legend: "Medio Plazo" },
      { value: 45, legend: "Largo Plazo" },
    ]
  };
  
  //coordenadas de Lima
  longitude = -77.028333;
  latitude = -12.043333;

  value: number = 0;
  prediction: any;

  
  infoWindowContent: string;
  currentZoom: number;

  infoWindows: google.maps.InfoWindow[] = [];
  circles: google.maps.Circle[] = [];
  circleCenter: google.maps.LatLngLiteral = { lat: -12.083565982450274, lng: -77.03459987347823 };
  // bread crumb items
  breadCrumbItems: Array<{}>;
  infoContent = ``;
  
  constructor(@Inject(PLATFORM_ID) private platformId: any,
    private service:FlujoFuturoService,
    // private mapsAPILoader: MapsAPILoader
  ) { }


  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Maps' }, { label: 'Flujo Futuro', active: true }];
    const payload = {
      data: [
        [0, 10, 45],
        [0, 11, 0],
        [0, 11, 15],
        [0, 11, 30],
        [0, 11, 45]
      ]
    };
    this.getPredicton(payload);
  }

  ngAfterViewInit() {
    // Listener para el evento de cambio de zoom
    this.mapComponent.googleMap.addListener('zoom_changed', () => {
      this.currentZoom = this.mapComponent.googleMap.getZoom();
      console.log('Nivel de zoom actual:', this.currentZoom);
      });
  }
  getPredicton(payload: any) {
    this.service.twoLanetrafficPrediction(payload).subscribe(
      response => {this.prediction = response;});   
  }  

  formatRequest(addMinutes: number): number[]{
    const now = new Date();
    now.setMinutes(now.getMinutes() + addMinutes);

    let dayOfWeek = now.getDay(); 
    const hours = now.getHours();
    const minutes = now.getMinutes();
    // Adjust dayOfWeek to make Monday 0 and Sunday 6
    dayOfWeek = (dayOfWeek + 6) % 7;
    return [dayOfWeek,hours,minutes]
  }

   onSliderChange(event: any): void {
    this.clearCircles();
    const payload = {
      data: [this.formatRequest(event.value),
        this.formatRequest(event.value),
        this.formatRequest(event.value),
        this.formatRequest(event.value),
        this.formatRequest(event.value)
      ]
    };
    console.log('Slider value changed:', event.value);
    this.getPredicton(payload);
    this.addCircle(event.value);
  }

  addCircle(lapse: number,): void {
    const circle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: this.mapComponent.googleMap,
      center: this.circleCenter,
      radius: 100
    });
    this.circles.push(circle);
    this.predictionToText(this.prediction.predicted_traffic_counts[0], lapse)
    
    circle.addListener('click', () => {
      this.closeAllInfoWindows();
      infoWindow.setPosition(circle.getCenter());
      infoWindow.open(this.mapComponent.googleMap);
    });

    const infoWindow = new google.maps.InfoWindow({
      content: this.infoWindowContent
    });

    this.infoWindows.push(infoWindow);
    
  }
  predictionToText(prediction: number[], lapse: number){ 
    let auxPrediction: number[] = [];
    const now = new Date();
    now.setMinutes(now.getMinutes() + lapse);
    const hours = now.getHours();
    const minutes = now.getMinutes();
    auxPrediction = this.sumAdjacentPairs(prediction)
    console.log(prediction)
    console.log(this.sumAdjacentPairs(prediction))
    this.infoWindowContent = 
    `<h1>Flujo de vehiculos en la inteseccion</h1> <h2>A las ${hours}:${minutes} se espera el siguiente flujo</h2>
    <ul>
    <li>Flujo de Norte a Sur ${auxPrediction[0]}</li>
    <li>Flujo de Sur a Norte ${auxPrediction[1]}</li>
    <li>Flujo de Este a Oeste ${auxPrediction[2]}</li>
    <li>Flujo de Oeste a Este  ${auxPrediction[3]}</li>
    </ul>`
  }

   sumAdjacentPairs(prediction: number[]): number[] {
    let summedArray: number[] = [];
    for (let i = 0; i < prediction.length; i += 2) {
        if (i + 1 < prediction.length) {
            let sum = prediction[i] + prediction[i + 1];
            summedArray.push(Math.round(sum));}
    }
    return summedArray;
}

  closeAllInfoWindows(): void {
    for (const infoWindow of this.infoWindows) {
      infoWindow.close();
    }
  }
  clearCircles(): void {
    for (const circle of this.circles) {
      circle.setMap(null);}
    this.circles = []; 
    this.closeAllInfoWindows();
    this.infoWindows = [];
  }
}
