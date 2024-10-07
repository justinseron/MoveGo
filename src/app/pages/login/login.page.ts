import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
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

  constructor(private router: Router,private alertController: AlertController, private usuarioService: UsuarioService) { }

  ngOnInit() {
  }

  async login() {
    if (await this.usuarioService.login(this.email,this.password)) {
      // Redirige al usuario a la página de inicio
      
      this.router.navigate(['/home']);
    } else {
      // Crea y muestra una alerta en caso de error
      const alert = await this.alertController.create({
        header: 'Error',
        message: '¡Correo o Contraseña incorrectos!',
        buttons: ['OK']
      });

      await alert.present();
    }
  }
}