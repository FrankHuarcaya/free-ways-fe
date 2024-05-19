import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { latLng, Map, marker, Marker, tileLayer,icon  } from 'leaflet';
@Component({
  selector: 'app-map-picker',
  templateUrl: './map-picker.component.html',
  styleUrls: ['./map-picker.component.scss']
})
export class MapPickerComponent implements OnChanges{
    @Input() latitude: number = -12.043333; // Valor predeterminado
    @Input() longitude: number = -77.028333; // Valor predeterminado
    @Output() locationSelected = new EventEmitter<{ latitude: number, longitude: number }>();

    options = {
        layers: [
            tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
        ],
        zoom: 12,
        center: latLng([this.latitude, this.longitude])
    };

    private map: Map;
    private mapMarker: Marker;

    onMapReady(map: Map) {
        this.map = map;
        this.updateMarker();
        this.map.on('click', (e: any) => {
            const { lat, lng } = e.latlng;
            if (this.mapMarker) {
                this.map.removeLayer(this.mapMarker);
            }
            this.mapMarker = marker([lat, lng], {
                icon: this.getCustomIcon()
            }).addTo(this.map);
            this.locationSelected.emit({ latitude: lat, longitude: lng });
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.latitude || changes.longitude) {
            this.updateMarker();
        }
    }

    private updateMarker() {
        if (this.map) {
            const lat = this.latitude || 46.879966;
            const lng = this.longitude || -121.726909;
            if (this.mapMarker) {
                this.map.removeLayer(this.mapMarker);
            }
            this.mapMarker = marker([lat, lng], {
                icon: this.getCustomIcon()
            }).addTo(this.map);
            this.map.setView([lat, lng], 12);
        }
    }

    private getCustomIcon() {
        return icon({
            iconUrl: 'assets/images/traffic-light.png',  // Ruta a tu icono de semáforo
            shadowUrl: 'assets/marker-shadow.png', // Ruta a la sombra del icono (opcional)
            iconSize: [25, 41], // tamaño del icono
            iconAnchor: [12, 41], // punto del icono que corresponde a la ubicación del marcador
            popupAnchor: [1, -34], // punto desde el que se abrirá el popup en relación al icono
            shadowSize: [41, 41] // tamaño de la sombra (opcional)
        });
    }
}
