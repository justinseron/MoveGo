import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  //Aquí podemos crear variables:
  usuarios: any[] = [
    {
      "rut": "12121123-5",
      "nombre": "pepita",
      "correo": "pepita@duocuc.cl",
      "fecha_nacimiento": "2002-03-10",
      "password": "Pepita123.",
      "confirm_password": "Pepita123.",
      "genero": "femenino",
      "tiene_auto": "si",
      "patente_auto": "KTHS12",
      "marca_auto": "Audi",
      "modelo_auto": "A3",
      "asientos_disponibles": "4",
      //"tipo_usuario": "administrador"
    }
  ];

  constructor(private storage: Storage) {
    this.init();
   }
   async init(){
    await this.storage.create();
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
    return true;
  }

  public async login(correo: string, contrasena: string): Promise<any>{
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    return usuarios.find(elemento=> elemento.correo==correo && elemento.contrasena==contrasena);
  }

  public async recuperarUsuario(correo:string): Promise<any>{
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    return usuarios.find(elemento=> elemento.correo == correo);
  }
}
