import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
@Injectable({
  providedIn: 'root'
})
export class ViajesService {
  viajes: any[] = [
  ];
  constructor(private storage: Storage) { 
    this.init();
  }
  async init(){
    await this.storage.create();
    let viajes: any[] = await this.storage.get("viajes") || [];
    const nuevoID = viajes.length > 0 ? Math.max(...viajes.map(v => parseInt(v.id__viaje))) + 1 : 1; // Obtener el siguiente ID
    let viaje =   {
      "id__viaje": "1", //dejarlo de manera automatica
      "conductor": "Patricio Mora",
      "patente": "AABB32",
      "color_auto": "Rojo",
      "asientos_disponibles": "0",
      "nombre_destino": "Municipalidad de Puente Alto, 1820, Avenida Concha y Toro",
      "latitud":-33.59523505,
      "longitud": -70.57963843136085,
      "distancia_metros":1939.2,
      "costo_viaje":2000,
      "duracion_viaje":202.2/60|| "Minutos",
      "hora_salida": "13:00",
      "pasajeros": "4",
      "estado_viaje": "pendiente",

    };
    await this.createViaje(viaje);
  }


  public async createViaje(viaje:any): Promise<boolean>{
    try {
      let viajes: any[] = await this.storage.get("viajes") || [];
      if (viajes.find(v => v.id__viaje === viaje.id__viaje) !== undefined) {
        console.error('El viaje ya existe:', viaje.id__viaje);
        return false;
      }
      viajes.push(viaje);
      await this.storage.set("viajes", viajes);
      return true;
    } catch (error) {
      console.error('Error al crear el viaje:', error);
      return false;
    }
  }

  public async getViaje(id__viaje:number): Promise<any>{
    let viajes: any[] = await this.storage.get("viajes") || [];
    return viajes.find(viaje=>viaje.id__viaje==id__viaje);
  }

  public async getViajes(): Promise<any[]>{
    let viajes: any[] = await this.storage.get("viajes") || [];
    return viajes;
  }

  public async updateViaje(id__viaje:number, nuevoViaje:any): Promise<boolean>{
    let viajes: any[] = await this.storage.get("viajes") || [];
    let indice: number = viajes.findIndex(viaje=>viaje.id__viaje==id__viaje);
    if(indice==-1){
      return false;
    }
    viajes[indice] = nuevoViaje;
    await this.storage.set("viajes",viajes);
    return true;
  }

  public async deleteViaje(id__viaje:number): Promise<boolean>{
    let viajes: any[] = await this.storage.get("viajes") || [];
    let indice: number = viajes.findIndex(viaje=>viaje.id__viaje==id__viaje);
    if(indice==-1){
      return false;
    }
    viajes.splice(indice,1);
    await this.storage.set("viajes",viajes);
    return true;
  }
}
