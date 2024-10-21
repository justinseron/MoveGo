import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ViajesService } from 'src/app/services/viajes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalles-viaje',
  templateUrl: './detalles-viaje.page.html',
  styleUrls: ['./detalles-viaje.page.scss'],
})
export class DetallesViajePage implements OnInit {
  id: number = 0;
  usuarioRut: string = "";
  viaje: any;
  viajeTomado: boolean = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private viajesService: ViajesService,
    private usuarioService: UsuarioService
  ) {}

  async ngOnInit() {
    this.usuarioRut = localStorage.getItem("userRut") || '';

    this.activatedRoute.paramMap.subscribe(async (params) => {
      this.id = Number(params.get('id'));
      console.log("ID de viaje:", this.id);

      if (this.id) {
        await this.loadViaje(this.id);
        console.log("Detalles del viaje:", this.viaje);
        
        // Verificar si el usuario ha tomado el viaje
        this.viajeTomado = this.viaje.pasajeros.includes(this.usuarioRut);
      } else {
        console.error("ID de viaje no proporcionado.");
      }
    });
  }

  async loadViaje(id: number) {
    this.viaje = await this.viajesService.getViaje(id);
    console.log("Viaje cargado:", this.viaje);
  
    if (!this.viaje) {
      console.error("No se pudo cargar el viaje.");
    } else {
      console.log("Pasajeros del viaje:", this.viaje.pasajeros);
    }
  }

  volver() {
    this.router.navigate(['/home/viajes']);
  }

  async confirmarTomaViaje() {
    if (this.viaje) {
      // Verifica si el usuario ya tiene un viaje tomado
      if (this.viajeTomado) {
        const alert = await this.alertController.create({
          header: 'Viaje en Curso',
          message: `Ya tienes un viaje en curso. ¿Quieres cancelarlo para tomar el nuevo viaje a ${this.viaje.nombre_destino}?`,
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'Sí',
              handler: async () => {
                // Cancelar el viaje anterior
                const exitoCancelacion = await this.viajesService.cancelarViaje(this.viaje.id__viaje, this.usuarioRut);
                if (exitoCancelacion) {
                  await this.tomarNuevoViaje(); // Permitir al usuario tomar el nuevo viaje
                } else {
                  this.mostrarAlerta('Error', 'No se pudo cancelar el viaje anterior.');
                }
              }
            }
          ]
        });

        await alert.present();
      } else {
        // Si no tiene un viaje anterior, solo procede a tomar el nuevo viaje
        await this.tomarNuevoViaje();
      }
    }
  }

  async tomarNuevoViaje() {
    const alert = await this.alertController.create({
      header: 'Confirmar Toma de Viaje',
      message: `¿Estás seguro de que quieres tomar el viaje a ${this.viaje.nombre_destino}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Confirmar',
          handler: async () => {
            const exito = await this.viajesService.tomarViaje(this.viaje.id__viaje, this.usuarioRut);
            if (exito) {
              console.log('Viaje tomado exitosamente');
              this.router.navigate(['/home/viajes']); // Redirigir a "Mis viajes"
            } else {
              this.mostrarAlerta('Error', 'No se puede tomar el viaje. Puede que ya lo haya tomado o no hay asientos disponibles.');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async cancelarViaje() {
    if (this.viajeTomado) {
      const { value: confirm } = await Swal.fire({
        title: 'Confirmar Cancelación',
        text: `¿Estás seguro de que quieres cancelar el viaje a ${this.viaje.nombre_destino}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No, regresar',
      });
  
      if (confirm) {
        const exito = await this.viajesService.cancelarViaje(this.viaje.id__viaje, this.usuarioRut);
        if (exito) {
          console.log('Viaje cancelado exitosamente');
          this.router.navigate(['/home/viajes']); // Redirigir a "Mis viajes"
        } else {
          this.mostrarAlerta('Error', 'No se puede cancelar el viaje. Puede que no lo haya tomado.');
        }
      }
    } else {
      this.mostrarAlerta('Sin Viaje en Curso', 'No tienes un viaje en curso que cancelar.');
    }
  }
  
  
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
        header,
        message,
        buttons: ['Aceptar']
    });
    await alert.present(); // Presentar la alerta de error
}


  isButtonDisabled(): boolean {
    if (!this.viaje) return true; // Si no hay viaje, deshabilitar
    
    const pasajeros = this.viaje.pasajeros || []; // Asegúrate de que pasajeros sea un arreglo
    const isTaken = pasajeros.includes(this.usuarioRut); // Verifica si el usuario ya ha tomado el viaje
    const isPending = this.viaje.estado_viaje === 'pendiente'; // Verifica si el estado es pendiente
  
    console.log("Usuario ya tomado:", isTaken); // Para depuración
    console.log("Estado del viaje:", this.viaje.estado_viaje); // Para depuración
  
    // Deshabilitar el botón si el usuario ya tomó el viaje o si el estado no es 'pendiente'
    return isTaken || !isPending; // Cambia la lógica para permitir tomar el viaje aunque no haya asientos
  }
}
