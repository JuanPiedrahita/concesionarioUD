import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SepararAutoComponent } from './separar-auto.component';

describe('SepararAutoComponent', () => {
  let component: SepararAutoComponent;
  let fixture: ComponentFixture<SepararAutoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SepararAutoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SepararAutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
