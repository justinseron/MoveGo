import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
})
export class AdministradorPage implements OnInit {

  persona = new FormGroup({
    rut : new FormControl('',[Validators.minLength(9),Validators.maxLength(10),Validators.required,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    nombre : new FormControl('',[Validators.required, Validators.pattern("[a-z]{3,5}")]),
    fecha_nacimiento : new FormControl('',[Validators.required]),
    genero : new FormControl('',[Validators.required]),
    tiene_auto : new FormControl('no',[Validators.required]),
    patente_auto : new FormControl('',[])
  });

  usuarios:any[] = [];

   //El servicio nos permite trabajar la información:
   constructor(private usuarioService:UsuarioService ) { }

  ngOnInit() {
    this.usuarios = this.usuarioService.getUsuarios();
  }

  registrar(){
    if(this.usuarioService.createUsuario(this.persona.value)){
      alert("USUARIO CREADO CON ÉXITO!!");
      this.persona.reset();
    }else{
      alert("ERROR! NO SE PUDO CREAR EL USUARIO");
    }
  }

}
