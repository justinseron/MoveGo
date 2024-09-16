import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-detalles-viaje',
  templateUrl: './detalles-viaje.page.html',
  styleUrls: ['./detalles-viaje.page.scss'],
})
export class DetallesViajePage implements OnInit {

  destino: string | null = null;
  tipoViaje: string | null = null;

  constructor(private router: Router, private alertController: AlertController) { }

  ngOnInit() {
    // Usar location.state para acceder al estado de navegación
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      const { destino, tipoViaje } = navigation.extras.state as { destino: string, tipoViaje: string };
      this.destino = destino;
      this.tipoViaje = tipoViaje;
    }
  }

  async confirmarAlerta(){
    const alert = await this.alertController.create({
      header: '¿Confirmar el viaje?',
      message: 'Se le asignará un conductor en breve...',
      buttons: [
        {
          text: 'Volver',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Confirmar Viaje',
          handler: () => {
            this.router.navigate(['/home']);
          }
        }
      ]
    });
      await alert.present();
  }

  async cancelarAlerta(){
    const alert = await this.alertController.create({
      header: '¿Desea cancelar su viaje?',
      message: 'Se le redireccionará a la página principal',
      buttons: [
        {
          text: 'Volver',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Confirmar Cancelación',
          handler: () => {
            this.router.navigate(['/home']);
          }
        }
      ],
      cssClass: 'my-custom-alert' //Clase para modificar las alertas en el sCSS
    });
      await alert.present();
  }

}
