import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url_dias_festivos: string = "https://api.boostr.cl/holidays.json";


  constructor(private http: HttpClient) { }

  //métodos
  getDatos(){
    return this.http.get(this.url_dias_festivos);
  }
}
