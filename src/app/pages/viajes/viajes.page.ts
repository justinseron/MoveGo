import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {

  constructor() { }

  map: L.Map | undefined; //la variable 'map' queda indefinida hasta que se le asigne un valor

  isBasicoSelected: boolean = true; //Estado inicial seleccionado (VIAJE BÁSICO)

  ngOnInit() {
    this.initializeMap();
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
  

}
