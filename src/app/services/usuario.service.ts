import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  //Aquí podemos crear variables:
  usuarios: any[] = [
    {
      "rut": "12121123-5",
      "nombre": "pepita",
      "fecha_nacimiento": "2002/03/10",
      "genero": "Femenino",
      "tiene_auto": "",
      "patente_auto": "KTHS12",
      //"tipo_usuario": "administrador"
    }
  ];

  constructor() { }

  //aquí vamos a crear toda nuestra lógica de programación
  //DAO:
  public createUsuario(usuario:any):boolean{
    if(this.getUsuario(usuario.rut)==undefined){
      this.usuarios.push(usuario);
      return true;
    }
    return false;
  }

  public getUsuario(rut:string){
    return this.usuarios.find(elemento => elemento.rut == rut);
  }

  public getUsuarios():any[]{
    return this.usuarios;
  }

  public updateUsuario(rut:string, nuevoUsuario:any){
    const indice = this.usuarios.findIndex(elemento => elemento.rut===rut);
    if(indice==-1){
      return false;
    }
    this.usuarios[indice]=nuevoUsuario;
    return true;
  }

  public deleteUsuario(rut:string):boolean{
    const indice = this.usuarios.findIndex(elemento => elemento.rut===rut);
    if(indice==-1){
      return false;
    }
    this.usuarios.splice(indice,1);
    return true;
  }
}
