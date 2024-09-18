import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { VerificarCodigoPage } from '../verificar-codigo/verificar-codigo.page';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {

  //ngModel
  email: string = "";

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  async mostrarModalVerificacion(){
    const modal = await this.modalController.create({
      component: VerificarCodigoPage
    });
    return await modal.present();
  }

  recuperarContrasena(){
    this.mostrarModalVerificacion();
  }

}
