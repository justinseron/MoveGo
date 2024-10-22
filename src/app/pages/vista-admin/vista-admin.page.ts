import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ViajesService } from 'src/app/services/viajes.service';


@Component({
  selector: 'app-vista-admin',
  templateUrl: './vista-admin.page.html',
  styleUrls: ['./vista-admin.page.scss'],
})
export class VistaAdminPage {
  viajesDelConductor: any[] = []; // Inicializa como un array vacío
  viajes: any[] = []; 
  nombresPasajeros: { [key: string]: string[] } = {};

  constructor(private viajeService: ViajesService,private usuarioService: UsuarioService) {}

  async ngOnInit() {
      this.viajesDelConductor = await this.viajeService.obtenerViajesPorConductor();
  }
  async cargarNombresPasajeros() {
    for (const viaje of this.viajesDelConductor) {
      const nombres = await Promise.all(viaje.pasajeros.map((rut: string) => this.usuarioService.getNombreByRut(rut)));
      this.nombresPasajeros[viaje.id__viaje] = nombres; // Almacenar los nombres por ID de viaje
    }
  }
}

