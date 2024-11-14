import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ModalController } from '@ionic/angular';
import { VerificarCodigoPage } from '../verificar-codigo/verificar-codigo.page';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {

  //ngModel
  email: string = "";

  constructor(private auth: AngularFireAuth ,private modalController: ModalController,private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit() {
  }

  async mostrarModalVerificacion(){
    const modal = await this.modalController.create({
      component: VerificarCodigoPage
    });
    return await modal.present();
  }

  async recuperarContrasena(){
    
    //esto se hace en el service, con un métod que se llame recuperar clave que reciba el correo:
    //this.auth.sendPasswordResetEmail(this.email);
    
    if(await this.usuarioService.recuperarUsuario(this.email)){
      this.mostrarModalVerificacion()
      this.router.navigate(['/login']);
    }else{
      alert("El Usuario No Existe")
    }
  
  }

}
