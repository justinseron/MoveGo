import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FireUsuarioService {
  private usuariosSubject = new BehaviorSubject<any[]>([]);
  usuarios$ = this.usuariosSubject.asObservable();
  private rutConductorLogueado: string | null = null;

  constructor(private fireStore: AngularFirestore) {
    this.cargarUsuarios(); // Cargar los usuarios al iniciar el servicio
    this.crearAdminPorDefecto();
  }

  private async crearAdminPorDefecto() {
    const adminRut = '20792608-6'; // RUT del administrador por defecto

    const adminSnapshot = await this.fireStore.collection('usuarios').doc(adminRut).get().toPromise();
    if (!adminSnapshot?.exists) {
      const adminUsuario = {
        rut: adminRut,
        nombre: 'Administrador',
        correo: 'admin@duocuc.cl',
        "fecha_nacimiento": "2002-03-10",
        "password": "Admin123.",
        "confirm_password": "Admin123.",
        "genero": "otro",
        "tiene_auto": "no",
        "patente_auto": "",
        "marca_auto": "",
        "color_auto": "",
        "asientos_disponibles": "",
        "tipo_usuario": "Administrador"
      };
      await this.fireStore.collection('usuarios').doc(adminRut).set(adminUsuario);
      console.log('Administrador por defecto creado');
    } else {
      console.log('El administrador ya existe');
    }
  }

  public setRutConductor(rut: string) {
    this.rutConductorLogueado = rut;
  }

  private async cargarUsuarios() {
    this.fireStore.collection('usuarios').valueChanges().subscribe((usuarios: any[]) => {
      this.usuariosSubject.next(usuarios);
    });
  }

  public async crearUsuario(usuario: any): Promise<boolean> {
    const docRef = this.fireStore.collection('usuarios').doc(usuario.rut);
    const docActual = await docRef.get().toPromise();
    if (docActual?.exists) {
      return false; // Usuario ya existe
    }
    await docRef.set(usuario);
    return true;
  }

  public getUsuarios(): Observable<any[]> {
    return this.fireStore.collection('usuarios').valueChanges();
  }

  public getUsuario(rut: string): Observable<any | undefined> {
    return this.fireStore.collection('usuarios').doc(rut).valueChanges();
  }

  public async getUsuarioPorRut(rut: string) {
    const snapshot = await this.fireStore.collection('usuarios', ref => ref.where('rut', '==', rut)).get().toPromise();
    if (snapshot && !snapshot.empty) {
      return snapshot.docs[0].data();
    }
    return null; // Retorna `null` si no se encontró el usuario
  }

  public updateUsuario(usuario: any): Promise<boolean> {
    return this.fireStore.collection('usuarios').doc(usuario.rut).update(usuario).then(() => {
      if (usuario.rut === this.getRUTLogueado()) {
        localStorage.setItem('usuario', JSON.stringify(usuario));  // Actualiza los datos en el almacenamiento local
      }
      return true;
    }).catch(() => false);
  }
  

  public async deleteUsuario(rut: string): Promise<boolean> {
    console.log("Eliminando usuario con rut:", rut);  // Verifica que el rut sea correcto
    try {
      await this.fireStore.collection('usuarios').doc(rut).delete();
      console.log("Usuario eliminado con éxito");
      return true;
    } catch (error) {
      console.error("Error al eliminar usuario:", error);  // Verifica el error
      return false;
    }
  }

  public getUserRut(): string {
    return localStorage.getItem('userRut') || '';
  }

  public getRUTLogueado(): string {
    return localStorage.getItem('userRut') || '';
  }

  public recuperarUsuario(correo: string): Observable<any | undefined> {
    return this.fireStore.collection('usuarios', ref => ref.where('correo', '==', correo)).valueChanges().pipe(
      map(users => users.length > 0 ? users[0] : undefined)
    );
  }
  public async getNombrePorRut(rut: string): Promise<string | null> {
    const usuarioSnapshot = await this.fireStore.collection('usuarios').doc(rut).get().toPromise();
    return usuarioSnapshot?.exists ? (usuarioSnapshot.data() as { nombre?: string }).nombre || null : null;
  }

  public getUsuarioLogueado(): Observable<any | undefined> {
    const rutLogueado = this.getRUTLogueado();
    return this.getUsuario(rutLogueado);
  }

  public async getConductorPorNombre(nombre: string): Promise<any | null> {
    const snapshot = await this.fireStore.collection('usuarios', ref =>
      ref.where('tipo_usuario', '==', 'Conductor').where('nombre', '==', nombre)
    ).get().toPromise();
  
    if (snapshot && !snapshot.empty) {
      return snapshot.docs[0].data();
    } else {
      return null;
    }
  }

  public getConductorData(nombre: string): Observable<any | null> {
    return this.fireStore.collection('usuarios', ref =>
      ref.where('tipo_usuario', '==', 'Conductor').where('nombre', '==', nombre)
    ).snapshotChanges().pipe(
      map(actions => {
        if (actions.length > 0) {
          const conductor = actions[0].payload.doc.data();
          return conductor;
        } else {
          return null;
        }
      })
    );
  }

  public getRutConductor(nombre: string): Observable<string | null> {
    return this.fireStore.collection('usuarios', ref =>
      ref.where('tipo_usuario', '==', 'Conductor').where('nombre', '==', nombre)
    ).snapshotChanges().pipe(
      map(actions => {
        if (actions.length > 0) {
          const conductor = actions[0].payload.doc.data() as any;
          return conductor.rut || null;
        } else {
          return null;
        }
      })
    );
  }

  public async login(correo: string, contrasena: string): Promise<boolean> {
    const usuariosSnapshot = await this.fireStore.collection('usuarios', ref => ref.where('correo', '==', correo).where('password', '==', contrasena)).get().toPromise();
    if (usuariosSnapshot && !usuariosSnapshot.empty) {
      const usuario = usuariosSnapshot.docs[0].data() as any;
      localStorage.setItem('userRut', usuario.rut || '');
      localStorage.setItem('usuario', JSON.stringify(usuario));
      localStorage.setItem('nombreConductor', usuario.nombre || '');
      return true;
    }
    return false;
  }

  public async getConductores(): Promise<any[]> {
    const snapshot = await this.fireStore.collection('usuarios', ref => ref.where('tipo_usuario', '==', 'Conductor')).get().toPromise();
    if (snapshot) {
      return snapshot.docs.map(doc => doc.data());
    }
    return [];
  }

  public async getPasajeros(): Promise<any[]> {
    const snapshot = await this.fireStore.collection('usuarios', ref => ref.where('tipo_usuario', '==', 'Pasajero')).get().toPromise();
    if (snapshot) {
      return snapshot.docs.map(doc => doc.data());
    }
    return [];
  }
}
