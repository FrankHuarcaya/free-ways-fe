import { Component, OnInit, Input, Inject, PLATFORM_ID, AfterViewInit, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { TrafficLightService } from '../../operation/traffic-light/services/traffic-light.service';
import { TrafficLight } from '../../operation/traffic-light/models/traffic-light.model';
import { Observable } from 'rxjs';
import Swal from "sweetalert2";
import {first} from "rxjs/operators";



interface MarkerProperties {
  position: {
    lat: number;
    lng: number;
  }
  title?: string;
  icon?: google.maps.Icon;
};
@Component({
  selector: 'app-google',
  templateUrl: './google.component.html',
  styleUrls: ['./google.component.scss']
})

/**
 * Google component
 */
export class GoogleComponent implements OnInit,AfterViewInit  {
  @ViewChild(GoogleMap) mapComponent: GoogleMap;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  @Input() pitch: number = 10;
  @Input() scrollwheel: boolean = false; //coordenadas de Lima
  longitude = -77.028333;
  latitude = -12.043333;
  tlIcon: string = 'assets/images/traffic-light.png';
  redCycle: number = 262;   // Tiempo del ciclo rojo en segundos
  greenCycle: number = 195

  trafficLightList!: Observable<TrafficLight[]>
  trafficLight: any;
  content?: any;

  currentZoom: number;
  minZoomVisible: number = 18;
  markersVisible: boolean = false;
  circleCenter: google.maps.LatLngLiteral = { lat: -12.091756905999354, lng: -76.95300742653058 };

  // bread crumb items
  breadCrumbItems: Array<{}>;
  infoContent = `<h1>Tiempo Semafórico Actual</h1><h2>🔴 Ciclo Rojo: ${this.redCycle}s</h2><h2>🟢 Ciclo Verde: ${this.greenCycle}s</h2>`;
  constructor(@Inject(PLATFORM_ID) 
    private platformId: any,
    public tlService: TrafficLightService,
    // private mapsAPILoader: MapsAPILoader
  ) { }


  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Maps' }, { label: 'Google Maps', active: true }];
    this.trafficLightList = this.tlService.countries$

    this.trafficLightList.subscribe(x => {
      this.content = this.trafficLight;
      this.trafficLight = Object.assign([], x);
    });

 
    this.listTrafficLight();

  }

  ngAfterViewInit() {
    this.addTrafficLayer();
    // Listener para el evento de cambio de zoom
    this.mapComponent.googleMap.addListener('zoom_changed', () => {
      this.currentZoom = this.mapComponent.googleMap.getZoom();
      console.log('Nivel de zoom actual:', this.currentZoom);
      });
    }


  mapOptions: google.maps.MapOptions = {
    mapId: "34e63ce8f10982d",
    center: { lat: -12.04318, lng: -77.02824 },
    zoom: 12,
    zoomControl: false,
    mapTypeControl: true,
    minZoom: 12,
    //maxZoom: 20,
  };

  openInfo(marker: MapMarker) { 
    
    if(this.infoWindow != undefined)
      this.infoWindow.open(marker);
  }
  

  
  markers: google.maps.MarkerOptions[] = [
    /*{ position: { lat: -12.091756905999354, lng: -76.95300742653058 },
      title:'title', 
      icon:{url:this.tlIcon, scaledSize: new google.maps.Size(50, 50)},
    }, // Eiffel Tower
    {
      position: { lat: -12.091789680114049, lng: -76.95317313713889},
      title: 'title',
      icon: { url: this.tlIcon, scaledSize: new google.maps.Size(50, 50)},
      visible: false
    }, // Louvre Museum*/
    ];
    
    createTrafficLightMarkers(tlList: any) {
      tlList.forEach((tl: any) => {
        console.log(tl)
        this.markers.push({position: { lat: Number(tl.latitude), lng: Number(tl.longitude)}, icon: { url: this.tlIcon, scaledSize: new google.maps.Size(50, 50)}});
      });
      console.log("createTrafficLightMarkers",this.markers);
    }
    listTrafficLight() {
      this.tlService.listTrafficLights()
          .pipe(first())
          .subscribe(
              response => {
                console.log("Response:", response);
                if (response) {
                  this.trafficLight = response; // Asumiendo que tus datos están directamente en la respuesta
                  this.createTrafficLightMarkers(response);
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
    private addTrafficLayer(): void {
      const trafficLayer = new google.maps.TrafficLayer();
      trafficLayer.setMap(this.mapComponent.googleMap);
    }
}
