import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compartir-perfil',
  templateUrl: './compartir-perfil.page.html',
  styleUrls: ['./compartir-perfil.page.scss'],
})
export class CompartirPerfilPage implements OnInit {

  usuario: any = {};

  constructor(private router: Router) { }

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem('usuario') || '');
  }

  volver() {
    this.router.navigate(['home/perfil']);
  }

}
