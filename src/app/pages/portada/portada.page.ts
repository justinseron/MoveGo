import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-portada',
  templateUrl: './portada.page.html',
  styleUrls: ['./portada.page.scss'],
})
export class PortadaPage {

  constructor(private navCtrl: NavController) { }

  start() {
    this.navCtrl.navigateForward('/login'); // Cambia '/login' a la ruta de tu página de login
  }
}
