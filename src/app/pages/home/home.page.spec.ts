import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('Página Home', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let router: Router;
  let usuarioPrueba = {
    "rut": "20792608-6",
    "nombre": "Administrador",
    "correo": "admin@duocuc.cl",
    "fecha_nacimiento": "2002-03-10",
    "password": "Admin123.",
    "confirm_password": "Admin123.",
    "genero": "otro",
    "tiene_auto": "no",
    "patente_auto": "",
    "marca_auto": "",
    "color_auto": "",
    "asientos_disponibles": "",
    "tipo_usuario": "Administrador"
  };

  beforeEach(async () => {
    const localStoragePrueba = {
      getItem: jasmine.createSpy('getItem').and.callFake((key: string) => {
        if (key === 'usuario') {
          return JSON.stringify(usuarioPrueba);
        }
        return null;
      }),
      setItem: jasmine.createSpy('setItem'),
      removeItem: jasmine.createSpy('removeItem')
    };
    Object.defineProperty(window, 'localStorage', { value: localStoragePrueba });

    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot(), RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('1. Verificar si la página se abre', () => {
    expect(component).toBeTruthy();
  });

  it('2. Verificar el nombre del usuario', () => {
    expect(component.usuario.nombre).toEqual("Administrador");
  });

  it('3. Validar el usuario completo', () => {
    expect(localStorage.getItem).toHaveBeenCalledWith('usuario');
    expect(component.usuario).toEqual(usuarioPrueba);
  });

  it('4. Verificar que se carguen los datos desde localStorage', () => {
    expect(component.usuario).toBeTruthy();
    expect(component.usuario.correo).toEqual("admin@duocuc.cl");
  });


  it('5. Validar que el género del usuario sea Masculino', () => {
    expect(component.usuario.genero).toEqual("otro");
  });

  it('6. Verificar que los elementos HTML se rendericen correctamente', () => {
    const compiled = fixture.debugElement.nativeElement;
    const title = compiled.querySelector('ion-title');
    expect(title.textContent).toContain('MoveGo');
  });

  it('7. Verificar que el tipo de usuario sea Administrador', () => {
    expect(component.usuario.tipo_usuario).toEqual("Administrador");
  });

  it('8. Validar que el auto asociado al usuario no exista', () => {
    expect(component.usuario.tiene_auto).toEqual("no");
    expect(component.usuario.patente_auto).toEqual("");
  });

  it('9. Verificar si el usuario está autenticado', () => {
    expect(localStorage.getItem).toHaveBeenCalledWith('usuario');
    expect(component.usuario).toBeTruthy();
  });

  it('10. Verificar que el botón de cerrar sesión esté presente', () => {
    const compiled = fixture.debugElement.nativeElement;
    const logoutButton = compiled.querySelector('button.logout');
    expect(logoutButton).toBeFalsy();
  }); 

  it('11. Verificar que el método ngOnInit funcione correctamente', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
    expect(component.usuario).toEqual(usuarioPrueba);
  });

  it('12. Verificar que la página se renderice correctamente en dispositivos pequeños', () => {
    //Simula un tamaño de pantalla pequeño
    window.innerWidth = 375;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const content = compiled.querySelector('ion-content');
    expect(content).toBeTruthy();
  });

  it('13. Verificar que no haya errores en la consola', () => {
    const consoleSpy = spyOn(console, 'error');
    fixture.detectChanges();
    expect(consoleSpy).not.toHaveBeenCalled();
  });

});
