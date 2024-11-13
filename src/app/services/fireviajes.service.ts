import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentSnapshot } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FireUsuarioService } from './fireusuario.service';

@Injectable({
  providedIn: 'root'
})
export class FireviajesService {
  private viajesDisponibles: any[] = []; // Array de viajes disponibles
  private misViajes: any[] = []; // Array de "Mis viajes"

  constructor(private fireStore: AngularFirestore, private fireUsuarioService : FireUsuarioService) {
    this.init();
  }

  async init() {
    try {
      // Verifica si ya existen viajes en Firestore
      const viajesSnapshot = await this.fireStore.collection('viajes').get().toPromise();
      
      // Asegura que viajesSnapshot y docs existan
      if (!viajesSnapshot || !viajesSnapshot.docs) {
        console.error("No se pudo obtener la información de los viajes desde Firestore.");
        return;
      }
  
      // Obtiene los viajes y los filtra
      const viajes = viajesSnapshot.docs.map(doc => doc.data());
  
      // Solo crea viajes nuevos si no hay ninguno en Firestore
      if (viajes.length === 0) {
        let nuevosViajes = [
          {

            "conductor": "Juan Pérez",
            "rut": "11219292-1",
            "patente": "AABB32",
            "color_auto": "Rojo",
            "asientos_disponibles": 2,
            "nombre_destino": "Municipalidad de Puente Alto, 1820, Avenida Concha y Toro",
            "latitud": -33.59438502707742,
            "longitud": -70.57948452698899,   
            "distancia_metros": 1939.2,
            "costo_viaje": 2000,
            "metodo_pago": "efectivo",
            "numero_tarjeta": "",
            "duracion_viaje": 150,
            "hora_salida": "13:00",
            "pasajeros": [],
            "estado_viaje": "pendiente",
          },
          // ...otros viajes
        ];
  
        // Guarda los nuevos viajes en Firestore
        for (let viaje of nuevosViajes) {
          try {
            await this.createViaje(viaje);
          } catch (error) {
            console.error("Error al crear viaje:", error);
          }
        }
      }
  
      // Filtra los viajes disponibles (solo los pendientes)
      this.viajesDisponibles = viajes.filter(viaje => (viaje as any).estado_viaje === 'pendiente');
  
    } catch (error) {
      console.error("Error al obtener los viajes de Firestore:", error);
    }
  }


  async tieneViajeVinculado(rutPasajero: string): Promise<boolean> {
    const viajes = await this.getViajes();  // Obtener todos los viajes
    return viajes.some(viaje => viaje.pasajeros.includes(rutPasajero));
  }
  

  public async getViajesPorConductor(rutConductor: string): Promise<any[]> {
    const viajesSnapshot = await this.fireStore.collection('viajes', ref => ref.where('rut', '==', rutConductor)).get().toPromise();
    
    // Verificamos si viajesSnapshot y docs están definidos antes de acceder
    if (viajesSnapshot && viajesSnapshot.docs) {
      return viajesSnapshot.docs.map(doc => doc.data());
    } else {
      // Si no hay resultados, retornamos un arreglo vacío
      return [];
    }
  }
  async createViaje(viaje: any): Promise<boolean> {
    try {
      const viajeRef = this.fireStore.collection('viajes').doc(); // Esto genera un ID automático
      const viajeConId = { ...viaje, id__viaje: viajeRef.ref.id };  // Usa el ID generado por Firestore
      
      await viajeRef.set(viajeConId);  // Guarda el viaje con el ID generado
      return true;
    } catch (error) {
      console.error('Error al crear el viaje:', error);
      return false;
    }
  }
  
  
  async getViaje(id: string): Promise<any> {
    try {
      // Accedemos al documento del viaje en Firestore
      const docSnapshot = await this.fireStore.collection('viajes').doc(id).get().toPromise();
  
      // Verificamos si el documento es válido (existe) y retornamos los datos
      if (docSnapshot && docSnapshot.exists) {
        return docSnapshot.data();  // Retorna los datos del documento si existe
      } else {
        return null;  // Retorna null si no se encuentra el documento
      }
    } catch (error) {
      console.error('Error al obtener el viaje:', error);
      return null;  // En caso de error, se maneja y retorna null
    }
  }
  
  async getViajes(): Promise<any[]> {
    const viajesSnapshot = await this.fireStore.collection('viajes').get().toPromise();
  
    // Verificamos si viajesSnapshot y docs están definidos antes de acceder
    if (viajesSnapshot && viajesSnapshot.docs) {
      // Si existen, mapeamos los documentos
      return viajesSnapshot.docs.map(doc => doc.data());
    } else {
      // Si no existen, retornamos un arreglo vacío
      return [];
    }
  }
  async obtenerIdGenerado(viajeRef: AngularFirestoreDocument<any>): Promise<string> {
    const viajeSnapshot = await viajeRef.get().toPromise();
  
    if (viajeSnapshot && viajeSnapshot.exists) {  // Verificamos que viajeSnapshot no sea undefined
      return viajeSnapshot.id; // Retorna el ID si existe
    } else {
      throw new Error('Documento no encontrado');
    }
  }
  async tomarViaje(idViaje: number, usuarioRut: string): Promise<boolean> {
    const viajes: any[] = await this.getViajes();  // Obtener la lista de viajes
    const viajeIndex = viajes.findIndex(viaje => viaje.id__viaje === idViaje.toString());
  
    if (viajeIndex !== -1) {
      const viajeTomado = viajes[viajeIndex];
  
      // Verifica que la propiedad pasajeros sea un array antes de hacer push
      if (!Array.isArray(viajeTomado.pasajeros)) {
        viajeTomado.pasajeros = []; // Inicializa la propiedad como un array vacío si no lo es
      }
  
      if (viajeTomado.pasajeros.includes(usuarioRut)) {
        return false;  // El usuario ya tomó este viaje
      }
  
      if (viajeTomado.asientos_disponibles > 0) {
        viajeTomado.pasajeros.push(usuarioRut);  // Añadir al pasajero
        viajeTomado.asientos_disponibles -= 1;
  
        // Lógica adicional para verificar si el pasajero tiene otro viaje en curso
        const tieneViaje = await this.tieneViajeVinculado(usuarioRut);
        if (tieneViaje) {
          // Preguntar si el usuario desea cancelar el viaje anterior (lógica de la alerta de confirmación)
        }
  
        // Si ya no hay asientos disponibles, cambiar el estado del viaje
        if (viajeTomado.asientos_disponibles === 0) {
          viajeTomado.estado_viaje = "en_curso";
        }
  
        await this.fireStore.collection('viajes').doc(viajeTomado.id__viaje).update(viajeTomado);
        return true;
      }
    }
    return false;  // Si no se pudo tomar el viaje, retorna false
  }
  
  

  async cancelarViaje(idViaje: number, usuarioRut: string): Promise<boolean> {
    const viajes = await this.getViajes();
    const viajeIndex = viajes.findIndex(viaje => viaje.id__viaje === idViaje.toString());

    if (viajeIndex !== -1) {
      const viaje = viajes[viajeIndex];
      const pasajerosIndex = viaje.pasajeros.indexOf(usuarioRut);

      if (pasajerosIndex !== -1) {
        viaje.pasajeros.splice(pasajerosIndex, 1); // Elimina el RUT del pasajero
        viaje.asientos_disponibles += 1; // Aumenta los asientos disponibles

        // Actualiza el viaje en Firestore
        await this.fireStore.collection('viajes').doc(viaje.id__viaje).update(viaje);
        return true;
      }
    }
    return false; // No se pudo cancelar el viaje
  }
  public async updateViaje(id__viaje: string, nuevoViaje: any): Promise<boolean> {
    try {
      // Filtrar propiedades con valores válidos manualmente
      const viajeActualizado: any = {};
      for (const [key, value] of Object.entries(nuevoViaje)) {
        if (value !== undefined) {
          viajeActualizado[key] = value;
        }
      }
  
      console.log("Datos del viaje a actualizar:", viajeActualizado);
  
      await this.fireStore.collection('viajes').doc(id__viaje).update(viajeActualizado);
      console.log("Viaje actualizado con éxito!");
      return true;
    } catch (error) {
      console.error('Error al actualizar el viaje:', error);
      return false;
    }
  }
  
  
  

  public async deleteViaje(id__viaje: string): Promise<boolean> {
    try {
      await this.fireStore.collection('viajes').doc(id__viaje).delete();
      return true;
    } catch (error) {
      console.error('Error al eliminar el viaje:', error);
      return false;
    }
  }

  getMisViajes(usuarioRut: string) {
    return this.misViajes.filter(viaje => viaje.pasajeros.includes(usuarioRut));
  }

  getViajesDisponibles() {
    return this.viajesDisponibles;
  }

  async obtenerViajesPorConductor(): Promise<any> {
    const viajes: any[] = await this.getViajes(); // Use toPromise to get the actual data
    const rutConductor = this.fireUsuarioService.getRUTLogueado();
    return viajes.filter((viaje: any) => viaje.rut === rutConductor);
  }


}
