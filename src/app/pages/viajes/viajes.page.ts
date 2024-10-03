import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements AfterViewInit {

  constructor(private router: Router) { }

  map: L.Map | undefined;

  isBasicoSelected: boolean = true;

  destinos: string[] = ['Duoc UC, Sede Puente Alto', 'Casa #123', 'Casa amigo #321', 'Destino X #111'];
  filteredDestinos: string[] = [];
  selectedDestino: string | null = null;

  ngAfterViewInit() {
    this.filteredDestinos = this.destinos;
  }



  onSegmentChange(event: any) {
    const selectedValue = event.detail.value;
    this.isBasicoSelected = (selectedValue === 'basico');
  }

  onSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredDestinos = this.destinos.filter(destino =>
      destino.toLowerCase().includes(searchTerm)
    );
  }
  
  onDestinoSelect(destino: string) {
    const tipoViaje = this.isBasicoSelected ? 'BÁSICO' : 'PRIORITY';
    this.router.navigate(['/detalles-viaje'], {
      state: {
        destino: destino,
        tipoViaje: tipoViaje
      }
    });
  }
}
