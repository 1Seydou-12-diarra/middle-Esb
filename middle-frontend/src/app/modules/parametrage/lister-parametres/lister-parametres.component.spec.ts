import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListerParametresComponent } from './lister-parametres.component';

describe('ListerParametresComponent', () => {
  let component: ListerParametresComponent;
  let fixture: ComponentFixture<ListerParametresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListerParametresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListerParametresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
