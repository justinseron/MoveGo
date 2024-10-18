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

  async confirmarTomaViaje() {
    const alert = await this.alertController.create({
      header: 'Confirmar Toma de Viaje',
      message: '¿Está seguro de que desea tomar este viaje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Aceptar',
          handler: async () => {
            if (this.viaje.asientos_disponibles > 0) {
              // Disminuir los asientos disponibles
              this.viaje.asientos_disponibles = (parseInt(this.viaje.asientos_disponibles) - 1).toString();

              // Actualizar el viaje en el servicio
              await this.viajesService.updateViaje(this.viaje.id__viaje, this.viaje);

              // Actualizar la variable 'viaje' para reflejar el cambio
              this.viaje = { ...this.viaje }; // Para forzar la actualización del binding
            } else {
              // Aquí puedes manejar la situación de que no haya asientos disponibles
              const noSeatsAlert = await this.alertController.create({
                header: 'Sin Asientos',
                message: 'No hay asientos disponibles para este viaje.',
                buttons: ['Aceptar']
              });
              await noSeatsAlert.present();
            }
          }
        }
      ]
    });

    await alert.present();
  }
}