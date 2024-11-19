import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private url = 'https://mindicador.cl/api/dolar';  // URL de la API de Mindicador

  constructor(private http: HttpClient) {}

  getDolarRate(): Observable<any> {
    return this.http.get(this.url); // Obtiene el valor del dólar
  }
}