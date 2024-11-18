import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiasPage } from './dias.page';

describe('DiasPage', () => {
  let component: DiasPage;
  let fixture: ComponentFixture<DiasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DiasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
