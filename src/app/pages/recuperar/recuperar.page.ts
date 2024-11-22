import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ModalController } from '@ionic/angular';
import { VerificarCodigoPage } from '../verificar-codigo/verificar-codigo.page';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FireUsuarioService } from 'src/app/services/fireusuario.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {

  //ngModel
  email: string = "";

  constructor(private auth: AngularFireAuth ,private modalController: ModalController, private router: Router,
              private fireUsuarioService: FireUsuarioService, private fireAuth: AngularFireAuth) { }

  ngOnInit() {
  }

  async mostrarModalVerificacion(){
    const modal = await this.modalController.create({
      component: VerificarCodigoPage
    });
    return await modal.present();
  }

  
  //esto se hace en el service, con un métod que se llame recuperar clave que reciba el correo:
  //this.auth.sendPasswordResetEmail(this.email);
  async onRecuperarContrasena() {
    if (this.email.trim() === '') {
      alert('Por favor, ingrese un correo válido');
      return;
    }

    try {
      await this.fireUsuarioService.enviarCorreoRecuperacion(this.email);
      alert('Correo de recuperación enviado con éxito. Por favor, siga los pasos especificados');
      this.router.navigate(['/login']);
    } catch (error) {
      alert('Error al enviar el correo. Inténtelo de nuevo.');
    }
  }
  
  async recuperarContrasena(){
    if(await this.fireUsuarioService.recuperarUsuario(this.email)){
      this.mostrarModalVerificacion()
      this.router.navigate(['/login']);
    }else{
      alert("El Usuario No Existe")
    }
  
  }

}
