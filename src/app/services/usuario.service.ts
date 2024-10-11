import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  //Aquí podemos crear variables:
  usuarios: any[] = [
  ];

  constructor(private storage: Storage) {
    this.init();
   }

  async init(){
    await this.storage.create();
    let admin =   {
      "rut": "12121123-5",
      "nombre": "Administrador",
      "correo": "admin@duocuc.cl",
      "fecha_nacimiento": "2002-03-10",
      "password": "Admin123.",
      "confirm_password": "Admin123.",
      "genero": "otro",
      "tiene_auto": "si",
      "patente_auto": "KTHS12",
      "marca_auto": "Audi",
      "modelo_auto": "A3",
      "asientos_disponibles": "4",
      "tipo_usuario": "Administrador"
    };
    await this.createUsuario(admin);
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
