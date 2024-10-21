import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ViajesService {
  private misViajesKey = "mis_viajes";
  private viajesDisponibles: any[] = []; // Array de viajes disponibles
  private misViajes: any[] = []; // Array de "Mis viajes"

  constructor(private storage: Storage) { 
    this.init();
  }

  async init() {
    await this.storage.create();
    let viajes: any[] = await this.storage.get("viajes") || [];

    // Solo crea un viaje nuevo si no hay ninguno en el almacenamiento
    if (viajes.length === 0) {
      let viaje = {
        "id__viaje": "1", 
        "conductor": "Juan Pérez",
        "patente": "AABB32",
        "color_auto": "Rojo",
        "asientos_disponibles": 2,
        "nombre_destino": "Municipalidad de Puente Alto, 1820, Avenida Concha y Toro",
        "latitud": -33.59523505,
        "longitud": -70.57963843136085,
        "distancia_metros": 1939.2,
        "costo_viaje": 2000,
        "metodo_pago": "efectivo",
        "numero_tarjeta": "",
        "duracion_viaje": "Minutos",
        "hora_salida": "13:00",
        "pasajeros": [],
        "estado_viaje": "pendiente",
      };
      await this.createViaje(viaje);
    }
  }

  public async createViaje(viaje: any): Promise<boolean> {
    try {
      let viajes: any[] = await this.storage.get("viajes") || [];
      
      if (!viaje.id__viaje) {
        viaje.id__viaje = (viajes.length > 0 ? (parseInt(viajes[viajes.length - 1].id__viaje) + 1).toString() : "1");
      }

      viaje.pasajeros = viaje.pasajeros || []; // Asegúrate de inicializar pasajeros

      if (viajes.find(v => v.id__viaje === viaje.id__viaje) !== undefined) {
        return false; // Viaje ya existe
      }

      viajes.push(viaje);
      await this.storage.set("viajes", viajes);
      return true;
    } catch (error) {
      console.error('Error al crear el viaje:', error);
      return false;
    }
  }

  public async getViaje(id: number): Promise<any> {
    const viajes = await this.getViajes(); // Obtener todos los viajes
    return viajes.find(viaje => viaje.id__viaje === id.toString()); // Comparar como string
  }

  public async getViajes(): Promise<any[]> {
    const viajes = await this.storage.get('viajes'); // Obtener viajes desde el almacenamiento
    console.log("Todos los viajes desde el servicio:", viajes); // Log para depuración
    return viajes || [];
  }

  async tomarViaje(idViaje: number, usuarioRut: string): Promise<boolean> {
    const viajes = await this.getViajes(); // Obtener todos los viajes disponibles
    const viajeIndex = viajes.findIndex(viaje => viaje.id__viaje === idViaje.toString());

    if (viajeIndex !== -1) {
      const viajeTomado = viajes[viajeIndex];
      viajeTomado.pasajeros = viajeTomado.pasajeros || [];
      
      // Comprobar si el usuario ya ha tomado el viaje
      if (viajeTomado.pasajeros.includes(usuarioRut)) {
        return false; // El usuario ya tomó este viaje
      }

      viajeTomado.pasajeros.push(usuarioRut); // Agregar el usuario a la lista de pasajeros
      viajeTomado.asientos_disponibles -= 1; // Decrementar el número de asientos disponibles
      
      // Comprobar si no hay asientos disponibles y cambiar el estado
      if (viajeTomado.asientos_disponibles === 0) {
        viajeTomado.estado_viaje = "en_curso"; // Cambiar estado si no hay asientos disponibles
      }

      // Actualizar la lista de viajes en el almacenamiento
      await this.updateViaje(viajeTomado.id__viaje, viajeTomado); // Actualizar viaje
      
      // Mover el viaje a "Mis viajes"
      this.misViajes.push(viajeTomado);
      this.viajesDisponibles = this.viajesDisponibles.filter(v => v.id__viaje !== viajeTomado.id__viaje); // Eliminar de "Viajes disponibles"
      
      return true; // Retornar éxito
    }
    return false; // No se pudo tomar el viaje
  }

  public async updateViaje(id__viaje: number, nuevoViaje: any): Promise<boolean> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    let indice: number = viajes.findIndex(viaje => viaje.id__viaje === id__viaje.toString());
    
    if (indice === -1) {
      return false; // Viaje no encontrado
    }

    // No modificar el id__viaje, solo actualizar el resto de las propiedades
    nuevoViaje.id__viaje = viajes[indice].id__viaje; // Mantener el ID original
    viajes[indice] = nuevoViaje;
    await this.storage.set("viajes", viajes);
    return true;
  }

  public async deleteViaje(id__viaje: number): Promise<boolean> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    let indice: number = viajes.findIndex(viaje => viaje.id__viaje === id__viaje.toString());

    if (indice === -1) {
      return false; // Viaje no encontrado
    }

    viajes.splice(indice, 1);
    await this.storage.set("viajes", viajes);
    return true;
  }

  // Método para obtener "Mis viajes"
  getMisViajes(usuarioRut: string) {
    return this.misViajes.filter(viaje => viaje.pasajeros.includes(usuarioRut));
  }

  getViajesDisponibles() {
    return this.viajesDisponibles; // Devolver viajes disponibles
  }
}
