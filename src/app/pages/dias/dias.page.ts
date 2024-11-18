import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import {DatePipe} from '@angular/common'

interface Feriado {
  date: string;
  title: string;
  type: string;
  inalienable: boolean;
  extra: string;
  formattedDate: string | null;  // Permite null además de string
}


@Component({
  selector: 'app-dias',
  templateUrl: './dias.page.html',
  styleUrls: ['./dias.page.scss'],
  providers: [DatePipe]
})
export class DiasPage implements OnInit {

  datos: any = [];
  loading: boolean = true;  // Indicador de carga

  constructor(private api: ApiService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.consumirApiDias();
  }

  consumirApiDias() {
    this.api.getDatos().subscribe(
      (response: any) => {
        console.log(response);
        if (response.status === 'success') {
          // Ordenar los feriados por fecha
          this.datos = response.data
            .map((dia: Feriado) => {
              // Formatear la fecha
              dia.formattedDate = this.datePipe.transform(dia.date, 'dd MMM yyyy');
              return dia;
            })
            .sort((a: Feriado, b: Feriado) => {
              // Convertir las fechas a objetos Date para compararlas
              return new Date(a.date).getTime() - new Date(b.date).getTime();
            });
        } else {
          console.error('Error en la respuesta de la API');
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error al consumir la API', error);
        this.loading = false;
      }
    );
  }
}



