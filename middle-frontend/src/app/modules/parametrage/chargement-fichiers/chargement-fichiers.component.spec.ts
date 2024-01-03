import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargementFichiersComponent } from './chargement-fichiers.component';

describe('ChargementFichiersComponent', () => {
  let component: ChargementFichiersComponent;
  let fixture: ComponentFixture<ChargementFichiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargementFichiersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargementFichiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
