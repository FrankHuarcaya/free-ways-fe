import { Component, EventEmitter, Output } from '@angular/core';
import { latLng, Map, marker, Marker, tileLayer } from 'leaflet';
@Component({
  selector: 'app-map-picker',
  templateUrl: './map-picker.component.html',
  styleUrls: ['./map-picker.component.css']
})
export class MapPickerComponent {

  @Output() locationSelected = new EventEmitter<{ latitude: number, longitude: number }>();

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 12,
    center: latLng([ 46.879966, -121.726909 ])
  };

  private map: Map;
  private mapMarker: Marker;

  onMapReady(map: Map) {
    this.map = map;
    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      if (this.mapMarker) {
        this.map.removeLayer(this.mapMarker);
      }
      this.mapMarker = marker([lat, lng]).addTo(this.map);
      this.locationSelected.emit({ latitude: lat, longitude: lng });
    });
  }

}
