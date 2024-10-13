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
    let viaje =   {
      "id__viaje":"1",
      "ubicacion_destino":"El quillay 1157",  
      "coordenadas_destino":"-33.58657458374411, -70.64117873393926",
      "ubicacion_inicio":"DuocUc Puente Alto",  
      "coordenadas_inicio":"-33.598415908974424, -70.5788192627744",
      "hora_salida":"17:00",
      "hora_regreso":"19:00",
      "numero_pasajeros":"4",
      "costo_estimado":"4000",
      "metodo_pago":"efectivo",
      "patente_auto":"AA123",
      "marca_vehiculo":"Nissan",
      "color_vehiculo":"Rojo",
      "numero_tarjeta":"123456",

    };
    await this.createViaje(viaje);
  }


  public async createViaje(viaje:any): Promise<boolean>{
    let viajes: any[] = await this.storage.get("viajes") || [];
    if(viajes.find(viaje=>viaje.id__viaje==viaje.id__viaje)!=undefined){
      return false;
    }
    viajes.push(viaje);
    await this.storage.set("viajes",viajes);
    return true;
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
