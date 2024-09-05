import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  //Aquí podemos crear variables:
  usuarios: any[] = [];

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
  for(let usu of this.usuarios){
    if(usu.rut==rut){
      usu=nuevoUsuario;
      return true;
    }
  }
  return false
}

public deleteUsuario(rut:string):boolean{
  const indice = this.usuarios.findIndex(elemento => elemento.rut===rut);
  if(indice==1){
    return false;
  }
  this.usuarios.splice(indice,1);
  return true;
}
}
