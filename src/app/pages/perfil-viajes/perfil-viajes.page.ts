import { Component, OnInit } from '@angular/core';
import { FireviajesService } from 'src/app/services/fireviajes.service';
// Asegúrate de importar el servicio de usuario
import { from } from 'rxjs';
import { FireUsuarioService } from 'src/app/services/fireusuario.service';

@Component({
  selector: 'app-perfil-viajes',
  templateUrl: './perfil-viajes.page.html',
  styleUrls: ['./perfil-viajes.page.scss'],
})
export class PerfilViajesPage implements OnInit {
  viajesTerminados: any[] = [];
  viajesDelConductor: any[] = [];
  conductorLogueadoRut: string = '';

  constructor(
    private fireViajeService: FireviajesService,
    private usuarioService: FireUsuarioService // Servicio para obtener el conductor logueado
  ) { }

  ngOnInit() {
    this.obtenerConductorLogueado();
  }

  // Obtener el conductor logueado
  obtenerConductorLogueado() {
    // Convertir Promise a Observable usando from()
    from(this.usuarioService.getUsuarioLogueado()).subscribe((usuarioLogueado) => {
      if (usuarioLogueado) {
        this.conductorLogueadoRut = usuarioLogueado.rut;
        this.cargarViajesTerminados();
      }
    });
  }

  // Cargar viajes terminados del conductor logueado
  async cargarViajesTerminados() {
    const todosLosViajes = await this.fireViajeService.getViajes(); // Obtener todos los viajes

    // Filtrar los viajes terminados y que sean del conductor logueado
    this.viajesTerminados = todosLosViajes.filter((viaje: any) => 
      viaje.estado_viaje === 'terminado' && viaje.rut === this.conductorLogueadoRut
    );
  }
}
