import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbonarPagoComponent } from './abonar-pago.component';

describe('AbonarPagoComponent', () => {
  let component: AbonarPagoComponent;
  let fixture: ComponentFixture<AbonarPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbonarPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbonarPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
