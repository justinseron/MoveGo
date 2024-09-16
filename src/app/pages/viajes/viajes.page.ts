import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {

  constructor(private router: Router) { }

  map: L.Map | undefined; //la variable 'map' queda indefinida hasta que se le asigne un valor

  isBasicoSelected: boolean = true; //Estado inicial seleccionado (VIAJE BÁSICO)

  destinos: string[] = ['Duoc UC, Sede Puente Alto', 'Casa #123', 'Casa amigo #321', 'Destino X #111']; //Lista de destinos
  filteredDestinos: string[] = []; //Destinos filtrados
  selectedDestino: string | null = null; //Destino seleccionado

  ngOnInit() {
    this.initializeMap();
    this.filteredDestinos = this.destinos; //Inicialmente muestra todos los destinos
  }

  selectBasico(){
    this.isBasicoSelected = true;
  }

  selectPrioritario(){
    this.isBasicoSelected = false;
  }

  initializeMap(){
    this.map = L.map('map').setView([-33.59840697254339, -70.5790016514548], 15); //Coordenadas iniciales y zoom del mapa

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  //TODO LO ANTERIOR ES PARA USAR LEAFLET, QUE ES UN MÉTODO GRATUITO PARA APLICAR UN MAPA. DECIDÍ (JUSTIN) USAR POR AHORA UN iframe YA QUE LEAFLET TARDABA
  //MUCHO EN CARGAR Y NO NECESITAMOS TANTA FUNCIONALIDAD XD, PERO EN CASO DE CUALQUIER COSA SE PUEDE IMPLEMENTAR CON EL SIGUIENTE DIV EN EL HTML REEMPLAZANDO EL iframe:
  //<div id="map" style="height: 100%;"></div> (dentro del ion-content)

  onSegmentChange(event: any){
    const selectedValue = event.detail.value;
    this.isBasicoSelected = (selectedValue === 'basico');
  }

  onSearch(event: any){
    const searchTerm = event.target.value.toLowerCase(); //Se obtiene el término de busqueda
    this.filteredDestinos = this.destinos.filter(destino =>
      destino.toLowerCase().includes(searchTerm) //Filtra los destinos
    );
  }
  
  onDestinoSelect(destino: string){
    const tipoViaje = this.isBasicoSelected ? 'BÁSICO' : 'PRIORITY';
    this.router.navigate(['/detalles-viaje'], {
      state: {
        destino: destino,
        tipoViaje: tipoViaje
      }
    });
  }

}
