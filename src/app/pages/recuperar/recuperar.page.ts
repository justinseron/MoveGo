// recuperar.page.ts
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage {
  email: string = '';
  isLoading: boolean = false;
  isValidEmail: boolean = true;

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private toastController: ToastController
  ) {}

// recuperar.page.ts
async onRecuperarContrasena() {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!this.email || !emailPattern.test(this.email)) {
    this.isValidEmail = false;
    await this.presentToast('Por favor, ingrese un correo electrónico válido');
    return;
  }
  this.isValidEmail = true;

  try {
    this.isLoading = true;
    // Configurar la URL de redirección al restablecer la contraseña
    const actionCodeSettings = {
      url: `https://movego-209af.web.app/restablecer-contrasena`, // Asegúrate de que esta URL sea la correcta
      handleCodeInApp: true // Esto hace que el código de acción sea manejado por tu aplicación
    };

    // Enviar el correo de restablecimiento de contraseña
    await this.auth.sendPasswordResetEmail(this.email, actionCodeSettings);
    await this.presentToast('Correo de recuperación enviado. Revisa tu bandeja de entrada.');
    this.router.navigate(['/login']);
  } catch (error: any) {
    let errorMessage = 'Error al enviar el correo de recuperación.';
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No se encontró una cuenta asociada a este correo.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'El correo ingresado no es válido.';
    }
    await this.presentToast(errorMessage);
  } finally {
    this.isLoading = false;
  }
}


  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
}
