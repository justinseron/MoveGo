import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FireviajesService } from 'src/app/services/fireviajes.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit, AfterViewInit {
  viajes: any[] = []; // Lista completa de viajes
  destinosFiltrados: any[] = []; // Viajes filtrados
  misViajes: any[] = []; // Viajes en curso
  viajesDisponibles: any[] = []; // Viajes pendientes

  isBasicoSelected: boolean = true; // Control del segmento de selección
  usuarioRut: string = ''; // Almacenar el RUT del usuario

  constructor(private router: Router, private fireViajeService : FireviajesService,private loadingController: LoadingController) {}

  async ngOnInit() {
    this.usuarioRut = localStorage.getItem("userRut") || ''; // Obtiene el RUT del usuario
    await this.cargarViajes();
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
  
  async cargarViajes() {
    const todosLosViajes = await this.fireViajeService.getViajes(); // Obtener todos los viajes
    console.log("Todos los viajes desde el almacenamiento:", todosLosViajes); // Log para verificar

    // Filtrar los viajes disponibles
    this.viajesDisponibles = todosLosViajes.filter(viaje => 
      viaje.asientos_disponibles > 0 && // Solo viajes con asientos disponibles
      (!viaje.pasajeros || !Array.isArray(viaje.pasajeros) || !viaje.pasajeros.includes(this.usuarioRut)) // Excluir viajes que ya tomó el usuario
    );
  
    // Filtrar "Mis Viajes" solo aquellos con estado "pendiente" o "en curso"
    this.misViajes = todosLosViajes.filter(viaje => 
      Array.isArray(viaje.pasajeros) && 
      viaje.pasajeros.includes(this.usuarioRut) && // El usuario es pasajero
      (viaje.estado_viaje === 'pendiente' || viaje.estado_viaje === 'en curso') // Solo estado pendiente o en curso
    );

    console.log("Viajes Disponibles:", this.viajesDisponibles); // Log para verificar
    console.log("Mis Viajes:", this.misViajes); // Log para verificar
}


  filtrarViajes() {
    if (this.isBasicoSelected) {
      // Mostrar solo los viajes en curso
      this.destinosFiltrados = this.misViajes.filter(viaje => viaje.estado_viaje === 'en_curso');
    } else {
      // Mostrar solo los viajes pendientes
      this.destinosFiltrados = this.viajesDisponibles;
    }
    console.log("Destinos filtrados:", this.destinosFiltrados); // Verifica los destinos filtrados
  }

  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.destinosFiltrados = this.viajes.filter(viaje => 
      viaje.nombre_destino.toLowerCase().includes(query) &&
      viaje.estado_viaje !== 'en_curso' // Excluir viajes en curso
    );
  }

  async tomarViaje(viaje: any) {
    const exito = await this.fireViajeService.tomarViaje(viaje.id__viaje, this.usuarioRut);
    if (exito) {
      await this.cargarViajes(); // Recargar los viajes después de tomar uno
      console.log("Viaje tomado con éxito");
    } else {
      console.log("No se puede tomar el viaje.");
      alert("No se puede tomar el viaje. Puede que ya lo haya tomado o no hay asientos disponibles.");
    }
  }
  

  ver(viaje: any) {
    console.log('Viaje:', viaje); // Agrega este log para verificar el objeto completo
    const viajeId = viaje.id || viaje.id__viaje; // Verifica si tiene el ID
    if (!viajeId) {
      console.error('El ID del viaje no está definido:', viaje);
      return; // Salir si el ID no está definido
    }
  
    console.log('ID del viaje:', viajeId); // Verifica el ID del viaje
    this.router.navigate(['/home/viajes/detalles-viaje', viajeId]);
  }
  

  ngAfterViewInit() {
    // Puedes agregar más lógica si es necesario
  }

  async onSegmentChange(event: any) {
    const loading = await this.mostrarCargando();
    this.isBasicoSelected = event.detail.value === 'basico';
    this.filtrarViajes();
    this.cargarViajes();
    loading.dismiss();
  }

  onDestinoSelect(destino: string) {
    const tipoViaje = this.isBasicoSelected ? 'BÁSICO' : 'PRIORITY';
    this.router.navigate(['/detalles-viaje'], {
      state: {
        destino: destino,
        tipoViaje: tipoViaje,
      },
    });
  }
}
