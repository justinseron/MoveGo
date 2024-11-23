import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';  // Importamos para usar un toast de notificación

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {

  email: string = "";
  isLoading: boolean = false;  // Para manejar el estado de carga del botón
  isValidEmail: boolean = true;  // Para manejar la validación del correo

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private toastController: ToastController  // Inyectamos el ToastController
  ) {}

  ngOnInit() {}

  async onRecuperarContrasena() {
    // Validar que el correo tenga el formato correcto antes de proceder
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!this.email || !emailPattern.test(this.email)) {
      this.isValidEmail = false;
      await this.presentToast('Por favor, ingrese un correo electrónico válido');
      return;
    }
    this.isValidEmail = true;  // Si el correo es válido

    try {
      this.isLoading = true;  // Mostrar el indicador de carga
      await this.auth.sendPasswordResetEmail(this.email);  // Enviar correo de recuperación
      await this.presentToast('Correo de recuperación enviado con éxito. Por favor, revise su bandeja de entrada.');
      this.router.navigate(['/login']);
    } catch (error: any) {
      let errorMessage = 'Error al enviar el correo. Inténtelo de nuevo.';
      // Manejo de errores más específico
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No se encontró una cuenta asociada a este correo.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El correo ingresado no es válido.';
      }
      await this.presentToast(errorMessage);
    } finally {
      this.isLoading = false;  // Ocultar el indicador de carga
    }
  }

  // Método para mostrar un mensaje de Toast
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,  // Duración del mensaje
      position: 'top'  // Ubicación del toast
    });
    toast.present();
  }
}
