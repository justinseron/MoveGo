import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesPage } from './pages.page';

const routes: Routes = [
  {
    path: '',
    component: PagesPage
  },
  {
    path: 'perfil-viajes',
    loadChildren: () => import('./perfil-viajes/perfil-viajes.module').then( m => m.PerfilViajesPageModule)
  },
  {
    path: 'viajes-terminados',
    loadChildren: () => import('./viajes-terminados/viajes-terminados.module').then( m => m.ViajesTerminadosPageModule)
  },
  {
    path: 'perfil-detalles',
    loadChildren: () => import('./perfil-detalles/perfil-detalles.module').then( m => m.PerfilDetallesPageModule)
  },
  {
    path: 'compartir-perfil',
    loadChildren: () => import('./compartir-perfil/compartir-perfil.module').then( m => m.CompartirPerfilPageModule)
  },
  {
    path: 'dias',
    loadChildren: () => import('./dias/dias.module').then( m => m.DiasPageModule)
  },
  {
    path: 'restablecer-contrasena',
    loadChildren: () => import('./restablecer-contrasena/restablecer-contrasena.module').then( m => m.RestablecerContrasenaPageModule)
  },
  {
    path: 'viajes-conductor',
    loadChildren: () => import('./viajes-conductor/viajes-conductor.module').then( m => m.ViajesConductorPageModule)
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesPageRoutingModule {}
