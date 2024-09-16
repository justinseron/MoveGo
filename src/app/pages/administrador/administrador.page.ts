import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
})
export class AdministradorPage implements OnInit {

  persona = new FormGroup({
    rut : new FormControl('',[Validators.minLength(9),Validators.maxLength(10),Validators.required,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    nombre : new FormControl('',[Validators.required,Validators.maxLength(20),Validators.pattern("^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\\s]+$") ]),
    fecha_nacimiento : new FormControl('',[Validators.required,this.validadorDeEdad]),
    genero : new FormControl('',[Validators.required]),
    tiene_auto : new FormControl('no',[Validators.required]),
    patente_auto : new FormControl('',[ Validators.pattern("^[A-Z0-9.-]*$"),Validators.maxLength(8)]),
  });

  usuarios:any[] = [];
  botonModificar: boolean = true;

   //El servicio nos permite trabajar la información:
   constructor(private usuarioService: UsuarioService ) { }

  ngOnInit() {
    this.usuarios = this.usuarioService.getUsuarios();
  }
  //Validador con variables necesarias. validadorDeEdad control por defecto de Angular contra errores, para validaciones se usa AbstractControl
  //el key string boolean null es para los mensajes de alerta mas que nada, el key string es para identificar cada error por la alerta por ej :dateTooOld o AgeTooYoung etc
  validadorDeEdad(control: AbstractControl): {[key: string]: boolean} | null{
    const fechaNacimiento = new Date(control.value);
    const today = new Date(); //fecha de hoy
    const edadMinima = 18; //edad minima
    const minYear = 1920; //edad máxima (104 años, teniendo en cuenta que es 2024)

    //se verifica que la fecha no sea númerica, devuelve nulo o error. isNaN (isNotaNumber) válida que no sea número
    if (isNaN(fechaNacimiento.getTime())){
      return {'invalidDate': true};
    }

    //aqui utilizo la variable creada minyear que es el año minimo y validamos que la fecha del formulario que selecciona el usuario, le extraemos el año y luego comparamos con la variable minyear (el año minimo)
    //si el año de cumpleaños del usuario es menor a minyear(1970) la aplicacion devolvera un datetooOld que significa que el año es muy antiguo por lo tanto no deja rellenar el campo fecha de nacimiento
    if(fechaNacimiento.getFullYear() < minYear){
      return {'dateTooOld': true};
    }

    // esto es el calculo basico de la edad el cual es obtener todos los años desde el dia de ejecucion y restarle los años de la fecha del usuario
    //en la variable M hacemos lo mismo pero para los meses
    const edad = today.getFullYear() - fechaNacimiento.getFullYear();
    const meses = today.getMonth() - fechaNacimiento.getMonth();

    //aqui se valida que los meses no sean menor al mes en el cual estamos porque eso significaria que la persona todavia no cumple la edad respectiva de este año
    if(meses < 0 || (meses === 0 && today.getDate() < fechaNacimiento.getDate())){
      edad - 1;
    }

    //con el nombre de las variables te das cuenta que esto es literal si la edad es menor que la minima entonces retorna un muy joven
    if(edad < edadMinima){
      return {'ageTooYoung': true};
    }

    return null;
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
