import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { PerfilPage } from './perfil.page';
import { of } from 'rxjs';

describe('Página Perfil', () => {
  let component: PerfilPage;
  let fixture: ComponentFixture<PerfilPage>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockNavController: jasmine.SpyObj<NavController>;
  let mockAlertController: jasmine.SpyObj<AlertController>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockNavController = jasmine.createSpyObj('NavController', ['navigateRoot']);
    mockAlertController = jasmine.createSpyObj('AlertController', ['create']);

    TestBed.configureTestingModule({
      declarations: [PerfilPage],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: NavController, useValue: mockNavController },
        { provide: AlertController, useValue: mockAlertController },
      ]
    });

    fixture = TestBed.createComponent(PerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('25. Verificar si la página se carga', () => {
    expect(component).toBeTruthy();
  });

  it('26. Verificar si navega a "home/perfil-viajes" cuando se llama a irAViajesTerminados', () => {
    component.irAViajesTerminados();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['home/perfil-viajes']);
  });

  it('27. Verificar si navega a "home/perfil-detalles" cuando se llama a irAPerfil', () => {
    component.irAPerfil();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['home/perfil-detalles']);
  });

  it('28. Verificar si se navega a "home/dias" cuando se llama a goToDias', () => {
    component.goToDias();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['home/dias']);
  });

  it('29. Verificar si se navega a "home/compartir-perfil" cuando se llama a compartirPerfil', () => {
    component.compartirPerfil();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['home/compartir-perfil']);
  });

  it('30. Verificar si se muestra alerta de confirmación cuando se llama a confirmarCerrar', async () => {
    const mockAlert = { present: jasmine.createSpy('present') };
    mockAlertController.create.and.returnValue(Promise.resolve(mockAlert as any));

    await component.confirmarCerrar();
    expect(mockAlertController.create).toHaveBeenCalled();
    expect(mockAlert.present).toHaveBeenCalled();
  });

});
