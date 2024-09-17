import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ViajesPage } from './pages/viajes/viajes.page';
import { DetallesViajePage } from './pages/detalles-viaje/detalles-viaje.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'portada',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'portada',
    loadChildren: () => import('./pages/portada/portada.module').then( m => m.PortadaPageModule)
  },
  {
    path: 'recuperar',
    loadChildren: () => import('./pages/recuperar/recuperar.module').then( m => m.RecuperarPageModule)
  },
  {
    path: 'verificar-codigo',
    loadChildren: () => import('./pages/verificar-codigo/verificar-codigo.module').then( m => m.VerificarCodigoPageModule)
  },
  {
    path: 'detalles-viaje',
    loadChildren: () => import('./pages/detalles-viaje/detalles-viaje.module').then( m => m.DetallesViajePageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/error404/error404.module').then( m => m.Error404PageModule)
  },

  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
