import { TestBed } from '@angular/core/testing';

import { FireViajesService } from './fire-viajes.service';

describe('FireViajesService', () => {
  let service: FireViajesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireViajesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
