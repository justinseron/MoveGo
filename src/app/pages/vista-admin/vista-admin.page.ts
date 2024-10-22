import { Component, OnInit } from '@angular/core';
import { ViajesService } from 'src/app/services/viajes.service';


@Component({
  selector: 'app-vista-admin',
  templateUrl: './vista-admin.page.html',
  styleUrls: ['./vista-admin.page.scss'],
})
export class VistaAdminPage {
  viajesDelConductor: any[] = []; // Inicializa como un array vacío
  viajes: any[] = []; 

  constructor(private viajeService: ViajesService) {}

  async ngOnInit() {
      this.viajesDelConductor = await this.viajeService.obtenerViajesPorConductor();
  }
}