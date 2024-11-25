import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { AdministradorPage } from './administrador.page';
import { FireUsuarioService } from 'src/app/services/fireusuario.service';

describe('Página Administrador', () => {
  let component: AdministradorPage;
  let fixture: ComponentFixture<AdministradorPage>;
  let router: Router;
  let alertController: jasmine.SpyObj<AlertController>;
  let fireUsuarioService: jasmine.SpyObj<FireUsuarioService>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const alertSpy = jasmine.createSpyObj('AlertController', ['create']);
    const fireUsuarioServiceSpy = jasmine.createSpyObj('FireUsuarioService', ['login']);

    await TestBed.configureTestingModule({
      declarations: [AdministradorPage],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AlertController, useValue: alertSpy },
        { provide: FireUsuarioService, useValue: fireUsuarioServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdministradorPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    alertController = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;
    fireUsuarioService = TestBed.inject(FireUsuarioService) as jasmine.SpyObj<FireUsuarioService>;
    fixture.detectChanges();
  });

  it('22. Verificar si la página se abre', () => {
    expect(component).toBeTruthy();
  });

  it('23. Devolver true si la edad es mayor o igual a 18', () => {
    const fechaNacimiento = '2000-01-01';
    const result = component.validarEdad18(fechaNacimiento);
    expect(result).toBeTrue();
  });

  it('24. Devolver falso si la edad es menor a 18', () => {
    const fechaNacimiento = '2010-01-01';
    const result = component.validarEdad18(fechaNacimiento);
    expect(result).toBeFalse();
  });
  
  

});