import { Component, AfterViewInit, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ViajesService } from 'src/app/services/viajes.service';
@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit, AfterViewInit {
  viajes: any[] = []; // Agregar esta línea para almacenar los viajes

  constructor(private router: Router, private viajeService: ViajesService) {
  }

  ngOnInit() {
    this.cargarViajes(); // Cargar los viajes en ngOnInit
  }

  // Método para cargar viajes
  async cargarViajes() {
    this.viajes = await this.viajeService.getViajes();
    console.log(this.viajes);
  }

  ver(viaje: any) {
    this.router.navigate(['/detalles-viaje'], {
      state: { viaje: viaje } // Pasar el viaje como estado
    });
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
