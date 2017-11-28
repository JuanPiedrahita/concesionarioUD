import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcordarPagoComponent } from './acordar-pago.component';

describe('AcordarPagoComponent', () => {
  let component: AcordarPagoComponent;
  let fixture: ComponentFixture<AcordarPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcordarPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcordarPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
