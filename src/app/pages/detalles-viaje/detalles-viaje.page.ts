import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import * as L from 'leaflet';
import { FireUsuarioService } from 'src/app/services/fireusuario.service';
import { FireviajesService } from 'src/app/services/fireviajes.service';
import { CurrencyService } from 'src/app/services/currency.service'; // Asegúrate de que esté importado

@Component({
  selector: 'app-detalles-viaje',
  templateUrl: './detalles-viaje.page.html',
  styleUrls: ['./detalles-viaje.page.scss'],
})
export class DetallesViajePage implements OnInit {
  id: string | null = null;
  usuarioRut: string = '';
  viaje: any;
  latitud: number = 0;
  longitud: number = 0;
  map: any;
  viajeTomado: boolean = false;
  duracionViajeMinutos: number = 0;
  costoDolares: number = 0; // Para almacenar el costo en dólares

  // Coordenadas del origen: Duoc UC Puente Alto
  origenLat: number = -33.618005;
  origenLng: number = -70.590955;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private fireViajeService: FireviajesService,
    private fireUsuarioService: FireUsuarioService,
    private currencyService: CurrencyService // Inyectamos el servicio de conversión de divisas
  ) {}

  async ngOnInit() {
    this.usuarioRut = localStorage.getItem('userRut') || '';
    this.activatedRoute.paramMap.subscribe(async (params) => {
      this.id = params.get('id'); // Este es un string (ID del viaje)
    
      if (this.id) {
        // Usamos el ID como string directamente, sin convertirlo a número
        await this.loadViaje(this.id);  // 'this.id' es un string, no es necesario convertirlo
        setTimeout(() => {
          this.initializeMap();
        }, 100);

        interface DolarResponse {
          serie: {
            valor: number; // El valor del dólar
          }[];
        }
        
        // Llamar a la API para obtener el valor del dólar
        this.currencyService.getDolarRate().subscribe(
          (data: DolarResponse) => {
            const dolarValue = data.serie[0].valor; // La tasa de cambio
            if (this.viaje && this.viaje.costo_viaje) {
              this.costoDolares = this.viaje.costo_viaje / dolarValue; // Convertir el costo
            }
          },
          (error: any) => {
            console.error('Error al obtener la tasa de cambio', error);
          }
        );
        
      } else {
        console.error("ID de viaje no proporcionado.");
      }
    });
  }

  // Método para cargar los detalles del viaje
  async loadViaje(id: string) {
    this.viaje = await this.fireViajeService.getViaje(id.toString()); // Convertir id a string
    if (this.viaje) {
      this.latitud = this.viaje.latitud;  // Obtener latitud del viaje
      this.longitud = this.viaje.longitud;  // Obtener longitud del viaje
      this.viajeTomado = this.viaje.pasajeros?.includes(this.usuarioRut) || false;
      this.duracionViajeMinutos = Math.floor(this.viaje.duracion_viaje / 60); // Asumiendo que está en segundos
    } else {
      console.error("No se pudo cargar el viaje.");
    }
  }

  initializeMap() {
    const initialLat = -33.598246116458384; // Coordenadas iniciales
    const initialLng = -70.5788192627744;

    if (this.map) {
        this.map.remove(); // Remover el mapa si ya existe
    }

    this.map = L.map('map').setView([initialLat, initialLng], 13);  // Vista inicial en las coordenadas específicas

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © OpenStreetMap contributors'
    }).addTo(this.map);

    // Crear íconos de marcadores
    const startIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });

    const endIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: '',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });
    
    // Marcador de inicio en las coordenadas iniciales
    L.marker([initialLat, initialLng], { icon: startIcon })
        .addTo(this.map)
        .bindPopup('Inicio de ruta')
        .openPopup();

    // Marcador de destino
    if (this.latitud && this.longitud) {
        L.marker([this.latitud, this.longitud], { icon: endIcon })
            .addTo(this.map)
            .bindPopup(`Destino: ${this.viaje.nombre_destino}`)
            .openPopup();
        
        // Dibujar la ruta desde las coordenadas iniciales al destino
        L.Routing.control({
            waypoints: [
                L.latLng(initialLat, initialLng),  // Coordenadas iniciales
                L.latLng(this.latitud, this.longitud)  // Coordenadas de destino
            ],
            routeWhileDragging: false,
            lineOptions: {
                styles: [{ color: 'blue', weight: 4 }],
                extendToWaypoints: true,
                missingRouteTolerance: 10
            },
        }).addTo(this.map);
        
        // Círculo en el destino
        L.circle([this.latitud, this.longitud], {
            color: 'green',
            fillColor: '#00FF00',
            fillOpacity: 0.5,
            radius: 250
        }).addTo(this.map);
    } else {
        console.error("Coordenadas de destino no válidas.");
    }

    setTimeout(() => {
        this.map.invalidateSize();  // Ajusta el tamaño del mapa correctamente
    }, 0);
}

  volver() {
    this.router.navigate(['/home/viajes']);
  }

  async confirmarTomaViaje() {
    if (this.viaje) {
      if (this.viajeTomado) {
        const alert = await this.alertController.create({
          header: 'Viaje en Curso',
          message: `Ya tienes un viaje en curso. ¿Quieres cancelarlo para tomar el nuevo viaje a ${this.viaje.nombre_destino}?`,
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'Sí',
              handler: async () => {
                // Cancelar el viaje anterior
                const exitoCancelacion = await this.fireViajeService.cancelarViaje(this.viaje.id__viaje, this.usuarioRut);
                if (exitoCancelacion) {
                  // Permitir al usuario tomar el nuevo viaje
                  await this.tomarNuevoViaje(); 
                } else {
                  this.mostrarAlerta('Error', 'No se pudo cancelar el viaje anterior.');
                }
              }
            }
          ]
        });

        await alert.present();
      } else {
        await this.tomarNuevoViaje();  // Si no tiene un viaje anterior, solo procede a tomar el nuevo viaje
      }
    }
}

async tomarNuevoViaje() {
  const alert = await this.alertController.create({
    header: 'Confirmar Toma de Viaje',
    message: `¿Estás seguro de que quieres tomar el viaje a ${this.viaje.nombre_destino}?`,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
      },
      {
        text: 'Confirmar',
        handler: async () => {
          // Tomar el nuevo viaje
          const exito = await this.fireViajeService.tomarViaje(this.viaje.id__viaje, this.usuarioRut);
          if (exito) {
            this.viajeTomado = true;
            this.router.navigate(['/home/viajes']); // Redirigir a "Mis viajes"
          } else {
            this.mostrarAlerta('Error', 'No se puede tomar el viaje. Puede que ya lo haya tomado o no hay asientos disponibles.');
          }
        }
      }
    ]
  });

  await alert.present();
}

async cancelarViaje() {
  if (this.viajeTomado) {
    const alert = await this.alertController.create({
      header: 'Confirmar Cancelación',
      message: `¿Estás seguro de que quieres cancelar el viaje a ${this.viaje.nombre_destino}?`,
      buttons: [
        {
          text: 'No, regresar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Sí, cancelar',
          handler: async () => {
            const exito = await this.fireViajeService.cancelarViaje(this.viaje.id__viaje, this.usuarioRut);
            if (exito) {
              this.viajeTomado = false;
              this.router.navigate(['/home/viajes']); // Redirigir a "Mis viajes"
            } else {
              this.mostrarAlerta('Error', 'No se puede cancelar el viaje. Puede que no lo haya tomado.');
            }
          }
        }
      ]
    });

    await alert.present();
  } else {
    this.mostrarAlerta('Sin Viaje en Curso', 'No tienes un viaje en curso que cancelar.');
  }
}

async mostrarAlerta(header: string, message: string) {
  const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Aceptar']
  });
  await alert.present();
}

isButtonDisabled(): boolean {
  if (!this.viaje) return true; // Si no hay viaje, deshabilitar
  
  const pasajeros = this.viaje.pasajeros || []; // Asegúrate de que pasajeros sea un arreglo
  const isTaken = pasajeros.includes(this.usuarioRut); // Verifica si el usuario ya ha tomado el viaje
  const isPending = this.viaje.estado_viaje === 'pendiente'; // Verifica si el estado es pendiente

  return isTaken || !isPending;  // Deshabilitar si ya tiene el viaje o el estado no es pendiente
}
}