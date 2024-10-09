import { Component, AfterViewInit, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import * as L from 'leaflet';
import * as G from 'leaflet-control-geocoder';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit, AfterViewInit {
  private map: L.Map | undefined;
  private geocoder: G.Geocoder | undefined;
  private routingControl: L.Routing.Control | undefined;  // Referencia del control de rutas
  private currentMarker: L.Marker | undefined;
  latitud: number = 0;
  longitud: number = 0;
  direccion: string = '';
  distancia_metros: number = 0;
  tiempo_segundos: number = 0;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Resetea el mapa al cambiar de ruta
        this.resetMap();
      }
    });
  }

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    // Inicializar el mapa
    this.map = L.map('map_html').locate({ setView: true, maxZoom: 16 });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    // Agregar buscador de direcciones
    this.geocoder = G.geocoder({
      placeholder: 'Ingrese dirección a buscar',
      errorMessage: 'Dirección no encontrada',
    }).addTo(this.map);

    // Manejo de la ubicación encontrada
    this.map.on('locationfound', (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      this.latitud = lat;
      this.longitud = lng;

      if (this.map) {
        //Eliminar el marcador anterior si existe
        if(this.currentMarker){
          this.map.removeLayer(this.currentMarker);
        }
        this.currentMarker = L.marker([lat, lng]).addTo(this.map).bindPopup('¡Estás aquí!').openPopup();
      }
    });

    // Manejo de errores en la ubicación
    this.map?.on('locationerror', () => {
      alert('No se pudo obtener la ubicación.');
    });

    // Acciones con el buscador
    this.geocoder.on('markgeocode', (e) => {
      const destinoLat = e.geocode.center.lat;
      const destinoLng = e.geocode.center.lng;
      this.direccion = e.geocode.properties['display_name'];

      if (this.map) {
        const ubicacionActualLat = this.latitud;
        const ubicacionActualLng = this.longitud;

        // Si ya hay una ruta existente, eliminarla
        if (this.routingControl) {
          this.map.removeControl(this.routingControl);
        }

        // Crear nueva ruta y guardar la referencia en routingControl
        this.routingControl = L.Routing.control({
          waypoints: [
            L.latLng(ubicacionActualLat, ubicacionActualLng), // Origen
            L.latLng(destinoLat, destinoLng),                  // Destino
          ],
          routeWhileDragging: true,
          fitSelectedRoutes: true,
        })
          .on('routesfound', (e) => {
            this.distancia_metros = e.routes[0].summary.totalDistance;
            this.tiempo_segundos = e.routes[0].summary.totalTime;
          })
          .addTo(this.map);
      }
    });
  }

  // Método para resetear el mapa
  resetMap() {
    if (this.map) {
      // Eliminar todos los marcadores
      this.map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          this.map?.removeLayer(layer);
        }
      });

      // Eliminar la ruta si existe
      if (this.routingControl) {
        this.map.removeControl(this.routingControl);
        this.routingControl = undefined;  // Resetear la referencia
      }
    }
  }

  isBasicoSelected: boolean = true;
  destinos: string[] = ['Duoc UC, Sede Puente Alto', 'Casa #123', 'Casa amigo #321', 'Destino X #111'];
  filteredDestinos: string[] = [];
  selectedDestino: string | null = null;

  ngAfterViewInit() {
    this.filteredDestinos = this.destinos;
  }

  onSegmentChange(event: any) {
    const selectedValue = event.detail.value;
    this.isBasicoSelected = selectedValue === 'basico';
  }

  onSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredDestinos = this.destinos.filter((destino) =>
      destino.toLowerCase().includes(searchTerm)
    );
  }

  onDestinoSelect(destino: string) {
    const tipoViaje = this.isBasicoSelected ? 'BÁSICO' : 'PRIORITY';
    this.router.navigate(['/detalles-viaje'], {
      state: {
        destino: destino,
        tipoViaje: tipoViaje,
      },
    });
  }
}
