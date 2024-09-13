import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-verificar-codigo',
  templateUrl: './verificar-codigo.page.html',
  styleUrls: ['./verificar-codigo.page.scss'],
})
export class VerificarCodigoPage implements OnInit {

  codigo: string = "";

  constructor(private modalController: ModalController, private router: Router) { }

  ngOnInit() {
  }

  cerrarModal(){
    this.modalController.dismiss().then(() => {
      this.router.navigate(['/login']);
    });
  }

  verificarCodigo(){
    console.log('Código ingresado: ', this.codigo);
    this.cerrarModal();
  }
}
