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
    this.viaje = new FormGroup({
      id__viaje: new FormControl({value: '', disabled: true}),// Campo solo lectura
      conductor: new FormControl('', [Validators.required]),
      patente: new FormControl('', [Validators.required]),
      color_auto: new FormControl('', [Validators.required]),
      asientos_disponibles: new FormControl('', [Validators.required]),
      nombre_destino: new FormControl('', [Validators.required]),
      latitud: new FormControl('', [Validators.required]),
      longitud: new FormControl('', [Validators.required, Validators.min(1)]),
      distancia_metros: new FormControl('', [Validators.required, Validators.min(0)]),
      costo_viaje: new FormControl('', [Validators.required]),
      metodo_pago: new FormControl('efectivo',[Validators.required]),
      numero_tarjeta:new FormControl('',[]),
      duracion_viaje: new FormControl('', [Validators.required]),
      hora_salida: new FormControl('', [Validators.required]),
      pasajeros: new FormControl('', [Validators.required]),
      estado_viaje: new FormControl('pendiente', []),
    });
    this.loadViajes();
    this.cargarConductores();
  }
  async ngOnInit() {
    
    this.usuarioService.usuarios$.subscribe(usuarios => {
      this.conductores = usuarios.filter(usuario => usuario.tipo_usuario === 'Conductor');
    });
    this.viajes = await this.viajeService.getViajes();
    this.usuarios = await this.usuarioService.getUsuarios();

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
    this.viaje.get('id__viaje')?.disable(); // Deshabilita el campo de ID
  }

  async onSubmit() {
    const nuevoViaje = { ...this.viaje.value };
    delete nuevoViaje.id__viaje;
    if( await this.viajeService.createViaje(nuevoViaje) ){
      this.viajes = await this.viajeService.getViajes();
      alert("Viaje creado con éxito!");
      this.viaje.reset();
    }else{
      alert("ERROR! Viaje no creado")
  }}

  async buscar(id__viaje: number) {
    const viajeData = await this.viajeService.getViaje(id__viaje);
    if (viajeData) {
      this.viaje.patchValue(viajeData);
      this.botonModificar = false; // Cambia a 'false' para indicar que estamos en modo de edición
    } else {
      await this.mostrarAlerta("Error", "Viaje no encontrado.");
    }
  }


  async modificar() {
    const buscar_viaje: number = this.viaje.get('id__viaje')?.value; // Obtiene el ID
  
    if (buscar_viaje) { // Asegúrate de que el ID no esté vacío
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
