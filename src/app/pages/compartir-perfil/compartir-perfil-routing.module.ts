import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompartirPerfilPage } from './compartir-perfil.page';

const routes: Routes = [
  {
    path: '',
    component: CompartirPerfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompartirPerfilPageRoutingModule {}
