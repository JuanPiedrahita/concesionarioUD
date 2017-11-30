import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudioCreditoComponent } from './estudio-credito.component';

describe('EstudioCreditoComponent', () => {
  let component: EstudioCreditoComponent;
  let fixture: ComponentFixture<EstudioCreditoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstudioCreditoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstudioCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
