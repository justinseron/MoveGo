import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  //VARIABLES:
  persona = new FormGroup({
    rut: new FormControl('',[Validators.minLength(9),Validators.maxLength(10),Validators.required,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    nombre: new FormControl('',[Validators.required,Validators.pattern("[a-z]{3,15}")]),
    fecha_nacimiento: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required]),
    genero: new FormControl('',[Validators.required]),
    tiene_auto : new FormControl('no',[Validators.required]),
    patente_auto : new FormControl('',[])
  });

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
      },
    },
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  //MÉTODOS:
  registrar():void{
    console.log(this.persona.value);
    this.router.navigate(['/home']);
  }

  setResult(ev:any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }

}
