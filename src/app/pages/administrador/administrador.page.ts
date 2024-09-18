import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';

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

  usuarios: any[] = [];
  botonModificar: boolean = true;

  constructor(@Inject(UsuarioService)private usuarioService: UsuarioService, private alertController: AlertController) { }

  ngOnInit() {
    this.usuarios = this.usuarioService.getUsuarios();
  }

  validadorDeEdad(control: AbstractControl): {[key: string]: boolean} | null {
    const fechaNacimiento = new Date(control.value);
    const today = new Date(); //fecha de hoy
    const edadMinima = 18; //edad mínima
    const minYear = 1920; //edad máxima (104 años, teniendo en cuenta que es 2024)

    if (isNaN(fechaNacimiento.getTime())) {
      return {'invalidDate': true};
    }

    if (fechaNacimiento.getFullYear() < minYear) {
      return {'dateTooOld': true};
    }

    const edad = today.getFullYear() - fechaNacimiento.getFullYear();
    const meses = today.getMonth() - fechaNacimiento.getMonth();

    if (meses < 0 || (meses === 0 && today.getDate() < fechaNacimiento.getDate())) {
      edad - 1;
    }

    if (edad < edadMinima) {
      return {'ageTooYoung': true};
    }

    return null;
  }

  async registrar() {
    if (this.usuarioService.createUsuario(this.persona.value)) {
      await this.presentAlert("Éxito", "USUARIO CREADO CON ÉXITO!!");
      this.persona.reset();
    } else {
      await this.presentAlert("Error", "ERROR! NO SE PUDO CREAR EL USUARIO");
    }
  }

  async buscar(rut_buscar: string) {
    this.persona.setValue(this.usuarioService.getUsuario(rut_buscar));
    this.botonModificar = false;
  }

  async modificar() {
    const rut_buscar: string = this.persona.controls.rut.value || "";
    if (this.usuarioService.updateUsuario(rut_buscar, this.persona.value)) {
      await this.presentAlert("Éxito", "USUARIO MODIFICADO CON ÉXITO!");
      this.botonModificar = true;
      this.persona.reset();
    } else {
      await this.presentAlert("Error", "ERROR! USUARIO NO MODIFICADO");
    }
  }

  async eliminar(rut_eliminar: string) {
    await this.presentConfirmAlert(
      'Confirmar Eliminación',
      '¿Estás seguro de que quieres eliminar este usuario?',
      () => {
        if (this.usuarioService.deleteUsuario(rut_eliminar)) {
          this.presentAlert("Éxito", "USUARIO ELIMINADO CON ÉXITO!");
          this.persona.reset();
        } else {
          this.presentAlert("Error", "ERROR! USUARIO NO ENCONTRADO");
        }
      }
    );
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
          handler: onConfirm
        }
      ]
    });

    await alert.present();
  }
}
