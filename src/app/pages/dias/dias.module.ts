import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiasPageRoutingModule } from './dias-routing.module';

import { DiasPage } from './dias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiasPageRoutingModule
  ],
  declarations: [DiasPage]
})
export class DiasPageModule {}
