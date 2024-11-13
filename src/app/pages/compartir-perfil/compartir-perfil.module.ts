import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompartirPerfilPageRoutingModule } from './compartir-perfil-routing.module';

import { CompartirPerfilPage } from './compartir-perfil.page';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompartirPerfilPageRoutingModule,
    QRCodeModule
  ],
  declarations: [CompartirPerfilPage]
})
export class CompartirPerfilPageModule {}
