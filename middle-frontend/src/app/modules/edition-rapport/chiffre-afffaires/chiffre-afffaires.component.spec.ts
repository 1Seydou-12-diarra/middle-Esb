import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiffreAfffairesComponent } from './chiffre-afffaires.component';

describe('ChiffreAfffairesComponent', () => {
  let component: ChiffreAfffairesComponent;
  let fixture: ComponentFixture<ChiffreAfffairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiffreAfffairesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChiffreAfffairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
