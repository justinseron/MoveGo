import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { LoginPage } from './login.page';
import { FireUsuarioService } from 'src/app/services/fireusuario.service';

describe('Página Login', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let router: Router;
  let alertController: jasmine.SpyObj<AlertController>;
  let fireUsuarioService: jasmine.SpyObj<FireUsuarioService>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const alertSpy = jasmine.createSpyObj('AlertController', ['create']);
    const fireUsuarioServiceSpy = jasmine.createSpyObj('FireUsuarioService', ['login']);

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AlertController, useValue: alertSpy },
        { provide: FireUsuarioService, useValue: fireUsuarioServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    alertController = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;
    fireUsuarioService = TestBed.inject(FireUsuarioService) as jasmine.SpyObj<FireUsuarioService>;
    fixture.detectChanges();
  });

  it('14. Verificar si la página se abre', () => {
    expect(component).toBeTruthy();
  });

  it('15. Verificar email y contraseña vacios', () => {
    expect(component.email).toEqual('');
    expect(component.password).toEqual('');
  });

  it('16. Limpiar email y contraseña', () => {
    component.email = 'test@duocuc.cl';
    component.password = 'contraseña123';
    component.ionViewWillEnter();
    expect(component.email).toEqual('');
    expect(component.password).toEqual('');
  });

  it('17. Verificar si redirecciona a Home después de Login', async () => {
    fireUsuarioService.login.and.returnValue(Promise.resolve(true));
    component.email = 'test@duocuc.cl';
    component.password = 'Admin123.';

    await component.login();

    expect(fireUsuarioService.login).toHaveBeenCalledWith('test@duocuc.cl', 'Admin123.');
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('18. Verificar si se muestra un error al fallar en el Login', async () => {
    fireUsuarioService.login.and.returnValue(Promise.resolve(false));
    const alertSpy = jasmine.createSpyObj('HTMLIonAlertElement', ['present']);
    alertController.create.and.returnValue(Promise.resolve(alertSpy));

    component.email = 'invalido@gmail.cl';
    component.password = 'passFalla';

    await component.login();

    expect(fireUsuarioService.login).toHaveBeenCalledWith('invalido@gmail.cl', 'passFalla');
    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'CORREO O CONTRASEÑA INCORRECTOS!',
      buttons: ['Aceptar'],
    });
    expect(alertSpy.present).toHaveBeenCalled();
  });
});
