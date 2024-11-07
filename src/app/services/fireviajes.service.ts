import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore'

@Injectable({
  providedIn: 'root'
})
export class FireviajesService {

  constructor(private fireStore: AngularFirestore) { }

  async crearViaje(viaje: any){
    const docRef = this.fireStore.collection('viajes').doc(viaje.id);
    const docActual = await docRef.get().toPromise();
    if(docActual?.exists){
      return false;
    }
    await docRef.set(viaje);
    return true;
    //return this.fireStore.collection('usuarios').doc(usuario.rut).set(usuario);
  }
  getViajes(){
    return this.fireStore.collection('viajes').valueChanges();
  }
  getViaje(id: string){
    return this.fireStore.collection('viajes').doc(id).valueChanges();
  }
  updateViaje(viaje: any){
    return this.fireStore.collection('viajes').doc(viaje.id).update(viaje);
  }
  deleteViaje(id: string){
    return this.fireStore.collection('viajes').doc(id).delete();
  }
}
