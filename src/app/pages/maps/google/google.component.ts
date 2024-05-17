import { Component, OnInit, Input, Inject, PLATFORM_ID, AfterViewInit, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';



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
  trafficMap : any;
  currentZoom: number;
  minZoomVisible: number = 18;
  markersVisible: boolean = false;
  circleCenter: google.maps.LatLngLiteral = { lat: -12.091756905999354, lng: -76.95300742653058 };
  // bread crumb items
  breadCrumbItems: Array<{}>;
  infoContent = `<h1>Tiempo Semafórico Actual</h1><h2>🔴 Ciclo Rojo: ${this.redCycle}s</h2><h2>🟢 Ciclo Verde: ${this.greenCycle}s</h2>`;
  constructor(@Inject(PLATFORM_ID) private platformId: any,
    // private mapsAPILoader: MapsAPILoader
  ) { }


  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Maps' }, { label: 'Google Maps', active: true }];

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
    { position: { lat: -12.091756905999354, lng: -76.95300742653058 },
      title:'title', 
      icon:{url:this.tlIcon, scaledSize: new google.maps.Size(50, 50)},
    }, // Eiffel Tower
    {
      position: { lat: -12.091789680114049, lng: -76.95317313713889},
      title: 'title',
      icon: { url: this.tlIcon, scaledSize: new google.maps.Size(50, 50)},
      visible: false
    }, // Louvre Museum
    ];
    private addTrafficLayer(): void {
      const trafficLayer = new google.maps.TrafficLayer();
      trafficLayer.setMap(this.mapComponent.googleMap);
    }
}
