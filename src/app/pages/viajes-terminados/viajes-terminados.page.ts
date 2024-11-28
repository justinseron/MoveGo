import { Component, OnInit } from '@angular/core';
import { FireUsuarioService } from 'src/app/services/fireusuario.service';
import { FireviajesService } from 'src/app/services/fireviajes.service';

@Component({
  selector: 'app-viajes-terminados',
  templateUrl: './viajes-terminados.page.html',
  styleUrls: ['./viajes-terminados.page.scss'],
})
export class ViajesTerminadosPage implements OnInit {
  misViajes: any[] = [];

  constructor(
    private fireviajesService: FireviajesService,
    private fireusuarioService: FireUsuarioService
  ) {}

  ngOnInit() {
    this.cargarMisViajes(); 
  }

  async cargarMisViajes() {
    const usuarioRut = this.fireusuarioService.getRUTLogueado();  // Obtén el RUT del usuario logueado
    console.log("RUT del usuario en cargarMisViajes:", usuarioRut);  // Verifica el RUT
    
    // Obtén los viajes en los que el usuario es pasajero
    const viajesPasajero = await this.fireviajesService.getViajesPorPasajero(usuarioRut);

    // Filtra los viajes para aquellos que están terminados y contienen al usuario como pasajero
    this.misViajes = viajesPasajero.filter(viaje => {
      console.log("Pasajeros del viaje:", viaje.pasajeros);  // Verifica los pasajeros
      return viaje.estado_viaje === 'terminado' && viaje.pasajeros.includes(usuarioRut);
    });

    console.log("Mis viajes terminados:", this.misViajes);  // Verifica los viajes filtrados
  }
}
