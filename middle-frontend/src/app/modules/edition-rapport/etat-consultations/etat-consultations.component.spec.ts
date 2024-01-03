import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatConsultationsComponent } from './etat-consultations.component';

describe('EtatConsultationsComponent', () => {
  let component: EtatConsultationsComponent;
  let fixture: ComponentFixture<EtatConsultationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtatConsultationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtatConsultationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
