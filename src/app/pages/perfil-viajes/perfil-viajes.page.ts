import { Component, OnInit } from '@angular/core';
import { FireviajesService } from 'src/app/services/fireviajes.service';

@Component({
  selector: 'app-perfil-viajes',
  templateUrl: './perfil-viajes.page.html',
  styleUrls: ['./perfil-viajes.page.scss'],
})
export class PerfilViajesPage implements OnInit {
  viajesTerminados: any[] = [];
  viajesDelConductor: any[] = []; 

  constructor(private fireViajeService : FireviajesService) { }

  async ngOnInit() {
    this.viajesDelConductor = await this.fireViajeService.obtenerViajesPorConductor();
    this.cargarViajesTerminados();  
  }

  async cargarViajesTerminados() {
    const todosLosViajes = await this.fireViajeService.getViajes(); // Obtener todos los viajes
    this.viajesTerminados = todosLosViajes.filter((viaje: any) => viaje.estado_viaje === 'terminado'); // Filtrar los viajes terminados
  }

}
