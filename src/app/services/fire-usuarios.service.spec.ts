import { TestBed } from '@angular/core/testing';

import { FireUsuariosService } from './fire-usuarios.service';

describe('FireUsuariosService', () => {
  let service: FireUsuariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireUsuariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
