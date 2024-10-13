import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ViajesService } from 'src/app/services/viajes.service';

@Component({
  selector: 'app-administrar-viajes',
  templateUrl: './administrar-viajes.page.html',
  styleUrls: ['./administrar-viajes.page.scss'],
})
export class AdministrarViajesPage implements OnInit {
  viaje: FormGroup;
  viajes: any[] = [];
  botonModificar: boolean = true; // Cambiado a número para el ID del viaje

  constructor(
    private viajeService: ViajesService,
    private alertController: AlertController,
    private router: Router
  ) {
    // Inicializa el formulario aquí para una mejor legibilidad
    this.viaje = new FormGroup({
      id__viaje: new FormControl('', [Validators.required]), // Campo solo lectura
      ubicacion_destino: new FormControl('', [Validators.required]),
      coordenadas_destino: new FormControl('', [Validators.required]),
      ubicacion_inicio: new FormControl('', [Validators.required]),
      coordenadas_inicio: new FormControl('', [Validators.required]),
      hora_salida: new FormControl('', [Validators.required]),
      hora_regreso: new FormControl('', [Validators.required]),
      numero_pasajeros: new FormControl(1, [Validators.required, Validators.min(1)]),
      costo_estimado: new FormControl(0, [Validators.required, Validators.min(0)]),
      metodo_pago: new FormControl('', [Validators.required]),
      patente_auto: new FormControl('', [Validators.required]),
      marca_vehiculo: new FormControl('', [Validators.required]),
      color_vehiculo: new FormControl('', [Validators.required]),
      numero_tarjeta: new FormControl('', []),
    });
  }

  async ngOnInit() {
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

  async onSubmit() {
    if (this.viaje.valid) {
      console.log("Formulario enviado:", this.viaje.value);

      try {
        await this.viajeService.createViaje(this.viaje.value);
        await this.mostrarAlerta("Éxito", "El viaje se ha guardado correctamente.");
        this.router.navigate(['../administrar-viajes']);
        this.limpiar(); // Limpiar formulario después de guardar
      } catch (error) {
        console.error("Error al guardar el viaje:", error);
        await this.mostrarAlerta("Error", "Hubo un problema al guardar el viaje.");
      }
    } else {
      await this.mostrarAlerta("Formulario inválido", "Por favor, completa todos los campos requeridos.");
    }
  }

  async buscar(id__viaje: number) {
    const viajeData = await this.viajeService.getViaje(id__viaje);
    this.viaje.setValue(viajeData);
    this.botonModificar = false;
  }

  limpiar() {
    this.viaje.reset(); // Resetea todos los controles del formulario
    this.botonModificar = true; // Restablece el botón de modificar
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
