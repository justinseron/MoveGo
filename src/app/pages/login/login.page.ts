import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  //NgModel
  email: string = "";
  password: string = "";

  constructor(private router: Router,private alertController: AlertController) { }

  ngOnInit() {
  }

  async login() {
    // Redirige al usuario a la página de inicio
    this.router.navigate(['/home']);

    // Crea una alerta con AlertController
    const alert = await this.alertController.create({
      header: 'Has ingresado con:',
      message: 'Cuenta Administrador',
      buttons: ['OK']
    });

    // Muestra la alerta
    await alert.present();
  }

}
