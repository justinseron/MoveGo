import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ViajesService {
  constructor(private storage: Storage) { 
    this.init();
  }

  async init() {
    await this.storage.create();
    let viajes: any[] = await this.storage.get("viajes") || [];

    // Solo crea un viaje nuevo si no hay ninguno en el almacenamiento
    if (viajes.length === 0) {
      let viaje = {
        "id__viaje": "1", // Asignar ID inicial como string
        "conductor": "Juan Pérez",
        "patente": "AABB32",
        "color_auto": "Rojo",
        "asientos_disponibles": "0",
        "nombre_destino": "Municipalidad de Puente Alto, 1820, Avenida Concha y Toro",
        "latitud": -33.59523505,
        "longitud": -70.57963843136085,
        "distancia_metros": 1939.2,
        "costo_viaje": 2000,
        "metodo_pago": "efectivo",
        "numero_tarjeta": "",
        "duracion_viaje": "Minutos", // Cambiado a "Minutos" directamente
        "hora_salida": "13:00",
        "pasajeros": "4",
        "estado_viaje": "pendiente",
      };
      await this.createViaje(viaje);
    }
  }

  public async createViaje(viaje: any): Promise<boolean> {
    try {
      let viajes: any[] = await this.storage.get("viajes") || [];
      
      // Asigna el ID automático solo si no se ha definido
      if (!viaje.id__viaje) {
        viaje.id__viaje = (viajes.length > 0 ? (parseInt(viajes[viajes.length - 1].id__viaje) + 1).toString() : "1");
      }

      // Verifica si el viaje ya existe por ID
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

  public async getViaje(id__viaje: number): Promise<any> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    return viajes.find(viaje => viaje.id__viaje === id__viaje.toString());
  }

  public async getViajes(): Promise<any[]> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    return viajes;
  }

  public async updateViaje(id__viaje: number, nuevoViaje: any): Promise<boolean> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    let indice: number = viajes.findIndex(viaje => viaje.id__viaje === id__viaje.toString());
    
    if (indice === -1) {
      return false; // Viaje no encontrado
    }

    nuevoViaje.id__viaje = id__viaje.toString(); // Asegúrate de que el ID se mantenga como string
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
}
