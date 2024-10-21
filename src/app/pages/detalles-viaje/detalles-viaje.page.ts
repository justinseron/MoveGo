import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ViajesService } from 'src/app/services/viajes.service';

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
      console.log("ID de viaje:", this.id); // Para depuración
  
      if (this.id) {
        await this.loadViaje(this.id);
        console.log("Detalles del viaje:", this.viaje); // Para verificar los detalles del viaje
        
        // Verificar si el usuario ha tomado el viaje
        this.viajeTomado = this.viaje.pasajeros.includes(this.usuarioRut);
      } else {
        console.error("ID de viaje no proporcionado.");
      }
    });
  }

  async loadViaje(id: number) {
    this.viaje = await this.viajesService.getViaje(id);
    console.log("Viaje cargado:", this.viaje); // Verifica si se carga correctamente
  
    if (!this.viaje) {
      console.error("No se pudo cargar el viaje.");
    } else {
      console.log("Pasajeros del viaje:", this.viaje.pasajeros); // Verifica la lista de pasajeros
    }
  }
  
  volver() {
    this.router.navigate(['/home/viajes']);
  }

  async confirmarTomaViaje() {
    if (this.viaje) {
      const alert = await this.alertController.create({
        header: 'Confirmar Toma de Viaje',
        message: `¿Estás seguro de que quieres tomar el viaje a ${this.viaje.nombre_destino}?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('El usuario canceló la toma del viaje.');
            }
          },
          {
            text: 'Confirmar',
            handler: async () => {
              const exito = await this.viajesService.tomarViaje(this.viaje.id__viaje, this.usuarioRut);
              if (exito) {
                console.log('Viaje tomado exitosamente');
                this.router.navigate(['/home/viajes']); // Redirigir a "Mis viajes"
              } else {
                console.error('No se pudo tomar el viaje. Puede que no haya asientos disponibles.');
  
                // Crear alerta para mostrar error
                const errorAlert = await this.alertController.create({
                  header: 'Error',
                  message: 'No se puede tomar el viaje. Puede que ya lo haya tomado o no hay asientos disponibles.',
                  buttons: ['Aceptar']
                });
  
                await errorAlert.present(); // Presentar la alerta de error
              }
            }
          }
        ]
      });
  
      await alert.present(); // Presenta la alerta de confirmación
    }
  }
  async cancelarViaje() {
    const alert = await this.alertController.create({
      header: 'Confirmar Cancelación',
      message: `¿Estás seguro de que quieres cancelar el viaje a ${this.viaje.nombre_destino}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('El usuario canceló la solicitud de cancelación del viaje.');
          }
        },
        {
          text: 'Confirmar',
          handler: async () => {
            const exito = await this.viajesService.cancelarViaje(this.viaje.id__viaje, this.usuarioRut);
            if (exito) {
              console.log('Viaje cancelado exitosamente');
              this.router.navigate(['/home/viajes']); // Redirigir a "Mis viajes"
            } else {
              console.error('No se pudo cancelar el viaje. Puede que no lo haya tomado.');
  
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'No se puede cancelar el viaje. Puede que no lo haya tomado.',
                buttons: ['Aceptar']
              });
  
              await errorAlert.present();
            }
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  
  // Método para cancelar el viaje

  isButtonDisabled(): boolean {
    if (!this.viaje) return true; // Si no hay viaje, deshabilitar
    
    const pasajeros = this.viaje.pasajeros || []; // Asegúrate de que pasajeros sea un arreglo
    const isTaken = pasajeros.includes(this.usuarioRut); // Verifica si el usuario ya ha tomado el viaje
    const isPending = this.viaje.estado_viaje === 'pendiente'; // Verifica si el estado es pendiente
  
    console.log("Usuario ya tomado:", isTaken); // Para depuración
    console.log("Estado del viaje:", this.viaje.estado_viaje); // Para depuración
  
    // Habilitar el botón si el usuario no ha tomado el viaje o si está pendiente
    return isTaken || !isPending; // Cambia la lógica para permitir tomar el viaje aunque no haya asientos
  }
}
