import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ViajesService } from 'src/app/services/viajes.service'; // Importar el servicio

@Component({
  selector: 'app-detalles-viaje',
  templateUrl: './detalles-viaje.page.html',
  styleUrls: ['./detalles-viaje.page.scss'],
})
export class DetallesViajePage implements OnInit {

  viaje: any = null; // Objeto para almacenar los detalles del viaje
  id: number = 0;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private viajesService: ViajesService // Inyectar el servicio
  ) { }

  async ngOnInit() {
    // Obtener el ID del viaje desde la URL
    this.id = +(this.activatedRoute.snapshot.paramMap.get("id__viaje") || "");

    if (this.id) {
      // Obtener los detalles del viaje usando el servicio
      this.viaje = await this.viajesService.getViaje(this.id);
    }
  }
}
