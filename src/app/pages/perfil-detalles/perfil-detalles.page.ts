import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FireUsuarioService } from 'src/app/services/fireusuario.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-perfil-detalles',
  templateUrl: './perfil-detalles.page.html',
  styleUrls: ['./perfil-detalles.page.scss'],
})
export class PerfilDetallesPage implements OnInit {
  usuarioLogueado: any = {};  // Asegúrate de que esté inicializado
  correoInvalido: boolean = false;
  fechaInvalida: boolean = false;

  constructor(
    private fireUsuarioService: FireUsuarioService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    const rutLogueado = this.fireUsuarioService.getRUTLogueado();
    if (rutLogueado) {
      this.usuarioLogueado = await this.fireUsuarioService.getUsuarioPorRut(rutLogueado);
    }
  }
  async mostrarCargando() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'crescent',  // Puedes cambiar el tipo de spinner aquí
      duration: 10000,      // Duración opcional, si quieres que se cierre después de cierto tiempo
    });
    await loading.present();
    return loading;
  }
  volver() {
    this.router.navigate(['home/perfil']);
  }

  validarCorreo() {
    const correoRegex = /^[a-zA-Z0-9._%+-]+@duocuc\.cl$/;
    this.correoInvalido = !correoRegex.test(this.usuarioLogueado.correo);
  }

  validarFechaNacimiento() {
    const fechaNacimiento = new Date(this.usuarioLogueado.fecha_nacimiento);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();

    this.fechaInvalida = (edad < 18 || (edad === 18 && mes < 0));
  }

  async mostrarAlertaExito() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Los datos se han guardado correctamente.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async guardarCambios() {
    const loading = await this.mostrarCargando();
    if (!this.correoInvalido && !this.fechaInvalida) {
      // Guardar los cambios del usuario
      const exito = await this.fireUsuarioService.updateUsuario(this.usuarioLogueado);
      if (exito) {
        loading.dismiss();
        this.mostrarAlertaExito();
        this.volver();  // Volver al perfil
      }
    }
  }
  
}
