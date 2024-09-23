import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  constructor(private router: Router, private alertController: AlertController) { }

  ngOnInit() {
  }

  async confirmarCerrar(){
    const alert = await this.alertController.create({
      header: 'Confirmar Cierre de Sesión',
      message: '¿Está seguro de que desea cerrar la sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            //No hacer NADA si cancela
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.cerrarSesion(); //Llama a la función si se acepta
          }
        }
      ]
    });

    await alert.present(); //Mostramos la alerta
  }

  //Cerrar sesión provisorio
  cerrarSesion(){
    this.router.navigate(['/login']);
  }

}
