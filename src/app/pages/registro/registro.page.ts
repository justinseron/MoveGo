import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  //VARIABLES:
  persona = new FormGroup({
    rut: new FormControl('',[Validators.minLength(9),Validators.maxLength(10),Validators.required,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    nombre: new FormControl('',[Validators.required,Validators.maxLength(20),Validators.pattern("^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\\s]+$") ]),
    correo: new FormControl('',[Validators.required, Validators.pattern("[a-zA-Z0-9.]+(@duocuc.cl)")]),
    fecha_nacimiento: new FormControl('',[Validators.required, this.validadorDeEdad]),
    password: new FormControl('',[Validators.required, Validators.pattern("^(?=.*[-!#$%&/()?¡_.])(?=.*[A-Za-z])(?=.*[a-z]).{8,}$")]),
    confirm_password: new FormControl('',[Validators.required, Validators.pattern("^(?=.*[-!#$%&/()?¡_.])(?=.*[A-Za-z])(?=.*[a-z]).{8,}$")]),
    genero: new FormControl('',[Validators.required]),
    tiene_auto : new FormControl('no',[]),
    patente_auto : new FormControl('',[ Validators.pattern("^[A-Z0-9.-]*$"),Validators.maxLength(8)]),
    marca_auto: new FormControl('',[]),
    modelo_auto: new FormControl('',[]),
    asientos_disponibles: new FormControl('',[]), //9 asientos, ya que la licencia Clase B permite hasta una capacidad de 9 asientos en vehículos particulares
  });

  async mostrarAlerta() {
    const alert = await this.alertController.create({
      header: 'Registro exitoso',
      message: 'Te has registrado exitosamente.',
      buttons: ['OK']
    });
  
    await alert.present();
  }

  constructor(private router: Router, private alertController: AlertController) { 
    this.persona.get("rut")?.setValidators([Validators.required,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}"),this.validarRut()]);
  }

  ngOnInit() {
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

  /*  BENDITO SEA   ^
                    |    */              

  //MÉTODOS:
  validarRut():ValidatorFn{
    return () => {
      const rut = this.persona.controls.rut.value;
      const dv_validar = rut?.replace("-","").split("").splice(-1).reverse()[0];
      let rut_limpio = [];
      if(rut?.length==10){
        rut_limpio = rut?.replace("-","").split("").splice(0,8).reverse();
      }else{
        rut_limpio = rut?.replace("-","").split("").splice(0,7).reverse() || [];
      }
      let factor = 2;
      let total = 0;
      for(let num of rut_limpio){
        total = total + ((+num)*factor);
        factor = factor + 1;
        if(factor==8){
          factor = 2;
        }
      }
      var dv = (11-(total%11)).toString();
      if(+dv>=10){
        dv = "k";
      }
      if(dv_validar!=dv.toString()) return {isValid: false};
      return null;
    };
  }

  registrar():void{
    console.log(this.persona.value);
    this.router.navigate(['/login']);
    this.mostrarAlerta();
  }

  setResult(ev:any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }

}
