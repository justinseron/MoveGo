import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuariosSubject = new BehaviorSubject<any[]>([]);
  usuarios$ = this.usuariosSubject.asObservable();

  //Aquí podemos crear variables:
  usuarios: any[] = [
  ];

  constructor(private storage: Storage) {
    this.init();
   }

  async init(){
    await this.storage.create();
    let admin =   {
      "rut": "20792608-6",
      "nombre": "Administrador",
      "correo": "admin@duocuc.cl",
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
    await this.createUsuario(admin);
    let conductor1 = {
      "rut": "8208490-8",
      "nombre": "Juan Pérez",
      "correo": "juan@duocuc.cl",
      "fecha_nacimiento": "1980-01-01",
      "password": "Conductor123.",
      "confirm_password": "Conductor123.",
      "genero": "masculino",
      "tiene_auto": "si",
      "patente_auto": "XYZ123",
      "marca_auto": "Ford",
      "color_auto": "Azul",
      "asientos_disponibles": "4",
      "tipo_usuario": "Conductor"
    };
  
    let conductor2 = {
      "rut": "20792607-8",
      "nombre": "María López",
      "correo": "maria@duocuc.cl",
      "fecha_nacimiento": "1990-02-02",
      "password": "Conductor123.",
      "confirm_password": "Conductor123.",
      "genero": "femenino",
      "tiene_auto": "si",
      "patente_auto": "ABC456",
      "marca_auto": "Chevrolet",
      "color_auto": "Rojo",
      "asientos_disponibles": "4",
      "tipo_usuario": "Conductor"
    };
  
    await this.createUsuario(conductor1);
    await this.createUsuario(conductor2);
    let usuarios = await this.getUsuarios();
    this.usuariosSubject.next(usuarios);  // Emitir usuarios al iniciar
  }
  public async getConductores(): Promise<any[]> {
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    return usuarios.filter(usuario => usuario.tipo_usuario=== 'Conductor');
  }

  //aquí vamos a crear toda nuestra lógica de programación
  //DAO:
  public async createUsuario(usuario:any): Promise<boolean>{
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    if(usuarios.find(usu=>usu.rut==usuario.rut)!=undefined){
      return false;
    }
    usuarios.push(usuario);
    await this.storage.set("usuarios",usuarios);
    this.usuariosSubject.next(usuarios);
    return true;
  }

  public async getUsuario(rut:string): Promise<any>{
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    return usuarios.find(usu=>usu.rut==rut);
  }

  public async getUsuarios(): Promise<any[]>{
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    return usuarios;
  }

  public async updateUsuario(rut:string, nuevoUsuario:any): Promise<boolean>{
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    let indice: number = usuarios.findIndex(usu=>usu.rut==rut);
    if(indice==-1){
      return false;
    }
    usuarios[indice] = nuevoUsuario;
    await this.storage.set("usuarios",usuarios);
    this.usuariosSubject.next(usuarios);
    return true;
  }

  public async deleteUsuario(rut:string): Promise<boolean>{
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    let indice: number = usuarios.findIndex(usu=>usu.rut==rut);
    if(indice==-1){
      return false;
    }
    usuarios.splice(indice,1);
    await this.storage.set("usuarios",usuarios);
    this.usuariosSubject.next(usuarios);
    return true;
  }

  public async login(correo: string, contrasena: string): Promise<any>{
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    const usu = usuarios.find(elemento=> elemento.correo==correo && elemento.password==contrasena);
    if(usu){
      localStorage.setItem("usuario",JSON.stringify(usu));
      return true;
    }
    return false;
  }

  public async recuperarUsuario(correo:string): Promise<any>{
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    return usuarios.find(elemento=> elemento.correo == correo);
  }
}
