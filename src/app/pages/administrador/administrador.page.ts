import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
})
export class AdministradorPage implements OnInit {

  persona = new FormGroup({
    rut: new FormControl('',[Validators.minLength(9),Validators.maxLength(10),Validators.required,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    nombre: new FormControl('',[Validators.required,Validators.maxLength(20),Validators.pattern("^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\\s]+$") ]),
    correo: new FormControl('',[Validators.required, Validators.pattern("[a-zA-Z0-9.]+(@duocuc.cl)")]),
    fecha_nacimiento: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required, Validators.pattern("^(?=.*[-!#$%&/()?¡_.])(?=.*[A-Za-z])(?=.*[a-z]).{8,}$")]),
    confirm_password: new FormControl('',[Validators.required, Validators.pattern("^(?=.*[-!#$%&/()?¡_.])(?=.*[A-Za-z])(?=.*[a-z]).{8,}$")]),
    genero: new FormControl('',[Validators.required]),
    tiene_auto : new FormControl('no',[]),
    patente_auto : new FormControl('',[ Validators.pattern("^[A-Z0-9.-]*$"),Validators.maxLength(8)]),
    marca_auto: new FormControl('',[]),
    color_auto: new FormControl('',[]), //*
    asientos_disponibles: new FormControl('', [
      Validators.min(2),  // Mayor a 1
      Validators.max(6),  // Menor a 7
      Validators.required  // Campo requerido si el usuario tiene auto
    ]),
    tipo_usuario: new FormControl('', [Validators.required]),
  });

  usuarios: any[] = [];
  botonModificar: boolean = true;
  

  constructor(@Inject(UsuarioService)private usuarioService: UsuarioService, private alertController: AlertController,private router: Router,private cdr: ChangeDetectorRef ) { }

  async ngOnInit() {
    await this.cargarUsuarios();
    this.usuarioService.usuarios$.subscribe(usuarios => {
      this.usuarios = usuarios;
    });
  }

  async cargarUsuarios() {
    this.usuarios = await this.usuarioService.getUsuarios();
    this.cdr.detectChanges();  // Forzar la detección de cambios
  }
  private async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['Aceptar'],
    });
  
    await alert.present();
  }
  

  validarEdad18(fecha_nacimiento: string){
    var edad = 0;
    if(fecha_nacimiento){
      const fecha_date = new Date(fecha_nacimiento);
      const timeDiff = Math.abs(Date.now() - fecha_date.getTime());
      edad = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
    }
    if(edad>=18){
      return true;
    }else{
      return false;
    }
  }
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

  public async registrar() {
    if (!this.validarEdad18(this.persona.controls.fecha_nacimiento.value || "")) {
      await this.mostrarAlerta("Error", "¡Debe tener al menos 18 años para registrarse!");
      return;
    }
  
    if (this.persona.controls.password.value !== this.persona.controls.confirm_password.value) {
      await this.mostrarAlerta("Error", "¡Las contraseñas no coinciden!");
      return;
    }
  
    if (await this.usuarioService.createUsuario(this.persona.value)) {
      this.usuarios = await this.usuarioService.getUsuarios();
      await this.cargarUsuarios();
      this.persona.reset();
      await this.mostrarAlerta("Éxito", "¡Usuario creado con éxito!");
    }
  }
  
  async buscar(rut_buscar: string) {
    this.persona.setValue(await this.usuarioService.getUsuario(rut_buscar));
    this.botonModificar = false;
  }

  async modificar() {
    var rut_buscar: string = this.persona.controls.rut.value || "";
    if (await this.usuarioService.updateUsuario(rut_buscar, this.persona.value)) {
      this.usuarios = await this.usuarioService.getUsuarios();
      await this.mostrarAlerta("Éxito", "¡Usuario modificado con éxito!");
      this.botonModificar = true;
      await this.cargarUsuarios();
      this.persona.reset();
    } else {
      await this.mostrarAlerta("Error", "¡Error! Usuario no modificado.");
    }
  }
  

  async eliminar(rut_eliminar: string) {
    const confirmacion = await this.presentConfirmAlert("Confirmar Eliminación", "¿Estás seguro de que deseas eliminar este usuario?", async () => {
      if (await this.usuarioService.deleteUsuario(rut_eliminar)) {
        this.usuarios = await this.usuarioService.getUsuarios();
        await this.cargarUsuarios();
        await this.mostrarAlerta("Éxito", "¡Usuario eliminado con éxito!");
      } else {
        await this.mostrarAlerta("Error", "¡Error! Usuario no eliminado.");
      }
    });
  }
  
  

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentConfirmAlert(header: string, message: string, onConfirm: () => void) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Eliminar',
          handler: onConfirm // Se ejecuta si el usuario confirma la eliminación
        }
      ]
    });
  
    await alert.present();
  }
  
}
