import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionUssdComponent } from './session-ussd.component';

describe('SessionUssdComponent', () => {
  let component: SessionUssdComponent;
  let fixture: ComponentFixture<SessionUssdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionUssdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionUssdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
