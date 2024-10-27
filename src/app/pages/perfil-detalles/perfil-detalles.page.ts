import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil-detalles',
  templateUrl: './perfil-detalles.page.html',
  styleUrls: ['./perfil-detalles.page.scss'],
})
export class PerfilDetallesPage implements OnInit {
  usuarioLogueado: any; //Aqui se almacena el usuario logueado

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  async ngOnInit() {
    //Cargar los datos del usuario logueado
    this.usuarioLogueado = await this.usuarioService.getUsuarioLogueado(); // Suponiendo que tienes un método para obtener el usuario logueado
  }

  volver(){
    this.router.navigate(['home/perfil']);
  }

}
