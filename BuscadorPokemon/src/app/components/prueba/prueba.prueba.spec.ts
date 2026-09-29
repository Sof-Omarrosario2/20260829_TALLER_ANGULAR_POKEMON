import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebaPrueba } from './prueba.prueba';

describe('PruebaPrueba', () => {
  let component: PruebaPrueba;
  let fixture: ComponentFixture<PruebaPrueba>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PruebaPrueba]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PruebaPrueba);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
