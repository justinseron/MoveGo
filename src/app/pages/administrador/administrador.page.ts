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
  botonModificar: boolean = true;

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

  buscar(rut_buscar:string){
    this.persona.setValue(this.usuarioService.getUsuario(rut_buscar));
    this.botonModificar = false;
  }

  modificar(){
    var rut_buscar : string = this.persona.controls.rut.value || "";
    if(this.usuarioService.updateUsuario(rut_buscar , this.persona.value)){
      alert("USUARIO MODIFICADO CON ÉXITO!")
      this.botonModificar = true;
      this.persona.reset();
    }else{
      alert("ERROR! USUARIO NO MODIFICADO")
    }
  }

  eliminar(rut_eliminar:string){
    //console.log(rut_eliminar)
    if(this.usuarioService.deleteUsuario(rut_eliminar)){
      alert("USUARIO ELIMINADO CON ÉXITO!")
    }else{
      alert("ERROR! USUARIO NO ENCONTRADO")
    }
  }

}
