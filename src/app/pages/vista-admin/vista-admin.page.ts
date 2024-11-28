import { Component, OnInit } from '@angular/core';
import { FireUsuarioService } from 'src/app/services/fireusuario.service';
import { FireviajesService } from 'src/app/services/fireviajes.service';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-vista-admin',
  templateUrl: './vista-admin.page.html',
  styleUrls: ['./vista-admin.page.scss'],
})
export class VistaAdminPage implements OnInit {
  viajesDelConductor: any[] = [];  // Inicialización segura
 // Inicializa como un array vacío
  nombresPasajeros: { [rut: string]: string | null } = {}; 

  constructor(private fireViajeService : FireviajesService, private fireUsuarioService : FireUsuarioService) {
  }

  async ngOnInit() {
    this.viajesDelConductor = await this.fireViajeService.obtenerViajesPorConductor();
    await this.cargarNombresPasajeros();
  }
  private async cargarNombresPasajeros() {
    for (const viaje of this.viajesDelConductor) {
      // Asegura que 'pasajeros' sea un array, en caso de que sea null o undefined
      const pasajeros = Array.isArray(viaje.pasajeros) ? viaje.pasajeros : [];
      
      for (const rut of pasajeros) {
        if (!this.nombresPasajeros[rut]) { // Evita duplicados
          this.nombresPasajeros[rut] = await this.fireUsuarioService.getNombrePorRut(rut);
        }
      }
    }
  }
  
}




