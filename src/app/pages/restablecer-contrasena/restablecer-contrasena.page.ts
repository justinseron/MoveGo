import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-restablecer-contrasena',
  templateUrl: './restablecer-contrasena.page.html',
  styleUrls: ['./restablecer-contrasena.page.scss'],
})
export class RestablecerContrasenaPage implements OnInit {
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';
  oobCode: string = ''; // Aquí almacenamos el código recibido en la URL
  isLoading: boolean = false;
  mostrarNuevaContrasena: boolean = false;
  mostrarConfirmarContrasena: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private auth: AngularFireAuth,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    // Obtenemos el `oobCode` de la URL
    this.route.queryParams.subscribe((params) => {
      this.oobCode = params['oobCode'];
      if (!this.oobCode) {
        this.presentToast('Código de restablecimiento no válido.');
        this.router.navigate(['/']);
      }
    });
  }
  toggleNuevaContrasena() {
    this.mostrarNuevaContrasena = !this.mostrarNuevaContrasena;
  }

  // Alterna la visibilidad de la confirmación de contraseña
  toggleConfirmarContrasena() {
    this.mostrarConfirmarContrasena = !this.mostrarConfirmarContrasena;
  }

  async onSubmit() {
    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.presentToast('Las contraseñas no coinciden.');
      return;
    }

    if (!this.nuevaContrasena || this.nuevaContrasena.length < 6) {
      this.presentToast('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      this.isLoading = true;
      // Usamos el `oobCode` para actualizar la contraseña
      await this.auth.confirmPasswordReset(this.oobCode, this.nuevaContrasena);
      this.presentToast('Contraseña restablecida con éxito. Inicie sesión.');
      this.router.navigate(['/login']);
    } catch (error: any) {
      let errorMessage = 'Error al restablecer la contraseña.';
      if (error.code === 'auth/expired-action-code') {
        errorMessage = 'El enlace ha expirado. Solicite otro correo.';
      } else if (error.code === 'auth/invalid-action-code') {
        errorMessage = 'El enlace no es válido. Intente de nuevo.';
      }
      this.presentToast(errorMessage);
    } finally {
      this.isLoading = false;
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }
}
