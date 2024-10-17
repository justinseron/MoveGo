import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ViajesService } from 'src/app/services/viajes.service';
import { UsuarioService } from 'src/app/services/usuario.service';
@Component({
  selector: 'app-administrar-viajes',
  templateUrl: './administrar-viajes.page.html',
  styleUrls: ['./administrar-viajes.page.scss'],
})
export class AdministrarViajesPage implements OnInit {
  viaje: FormGroup;
  viajes: any[] = [];
  usuarios:any[] = [];
  conductores: any[] = [];
  botonModificar: boolean = true; // Cambiado a número para el ID del viaje

  constructor(
    private viajeService: ViajesService,
    private usuarioService: UsuarioService,
    private alertController: AlertController,
    private router: Router
  ) {
    // Inicializa el formulario aquí para una mejor legibilidad
    this.viaje = new FormGroup({// Campo solo lectura
      conductor: new FormControl('', [Validators.required]),
      patente: new FormControl('', [Validators.required]),
      color_auto: new FormControl('', [Validators.required]),
      asientos_disponibles: new FormControl('', [Validators.required]),
      nombre_destino: new FormControl('', [Validators.required]),
      latitud: new FormControl('', [Validators.required]),
      longitud: new FormControl('', [Validators.required, Validators.min(1)]),
      distancia_metros: new FormControl('', [Validators.required, Validators.min(0)]),
      costo_viaje: new FormControl('', [Validators.required]),
      duracion_viaje: new FormControl('', [Validators.required]),
      hora_salida: new FormControl('', [Validators.required]),
      pasajeros: new FormControl('', [Validators.required]),
      estado_viaje: new FormControl('pendiente', []),
    });
    this.loadViajes();
    this.cargarConductores();
  }
  async ngOnInit() {
    this.viajes = await this.viajeService.getViajes();
    this.usuarios = await this.usuarioService.getUsuarios();
    this.usuarioService.usuarios$.subscribe(usuarios => {
      this.conductores = usuarios.filter(usuario => usuario.tipo_usuario === 'Conductor');
    });

  }
  
  async cargarConductores() {
    this.conductores = await this.usuarioService.getConductores();
  }
  async loadViajes() {
    this.viajes = await this.viajeService.getViajes();
  }
  private async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  onPaymentMethodChange(event: any) {
    // Puedes agregar más lógica aquí si es necesario
  }

  // Método para verificar si se seleccionó "Tarjeta" como método de pago
  isCardPayment(): boolean {
    return this.viaje.get('metodo_pago')?.value === 'tarjeta';
  }
  limpiar() {
    this.viaje.reset(); // Resetea todos los controles del formulario
    this.botonModificar = true; // Restablece el botón de modificar
  }

  async onSubmit() {
  if( await this.viajeService.createViaje(this.viaje.value) ){
    this.viajes = await this.viajeService.getViajes();
    alert("Viaje creado con éxito!");
    this.viaje.reset();
  }else{
    alert("ERROR! Viaje no creado")
  }}

  async buscar(id__viaje: number) {
    const viajeData = await this.viajeService.getViaje(id__viaje);
    this.viaje.setValue(viajeData);
    this.botonModificar = false;
  }



  async modificar() {
    const idViajeControl = this.viaje.get('id__viaje'); // Obtén el control directamente
    const buscar_viaje: number = idViajeControl && idViajeControl.value ? +idViajeControl.value : 0; // Asegúrate de que sea un número

    if (buscar_viaje > 0) { // Asegúrate de que el ID sea positivo antes de proceder
      try {
        const result = await this.viajeService.updateViaje(buscar_viaje, this.viaje.value);
        if (result) {
          this.viajes = await this.viajeService.getViajes();
          await this.mostrarAlerta("Éxito", "¡Viaje modificado con éxito!");
          this.botonModificar = true;
          this.limpiar();
        } else {
          throw new Error("Error en la modificación del viaje");
        }
      } catch (error) {
        await this.mostrarAlerta("Error", "¡Error! Viaje no modificado.");
      }
    } else {
      await this.mostrarAlerta("Error", "Por favor, proporciona un ID de viaje válido.");
    }
  }

  async eliminar(viaje_eliminar: number) {
    const confirmacion = await this.presentConfirmAlert(
      "Confirmar Eliminación",
      "¿Estás seguro de que deseas eliminar este Viaje?",
      async () => {
        try {
          const result = await this.viajeService.deleteViaje(viaje_eliminar);
          if (result) {
            this.viajes = await this.viajeService.getViajes();
            this.limpiar();
            await this.mostrarAlerta("Éxito", "¡Viaje eliminado con éxito!");
          } else {
            throw new Error("Error en la eliminación del viaje");
          }
        } catch (error) {
          await this.mostrarAlerta("Error", "¡Error! Viaje no eliminado.");
        }
      }
    );
  }

  private async presentConfirmAlert(titulo: string, mensaje: string, callback: () => Promise<void>) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: callback,
        },
      ],
    });

    await alert.present();
  }
}
