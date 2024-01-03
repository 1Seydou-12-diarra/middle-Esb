import { TestBed } from '@angular/core/testing';

import { ProtectionDroits } from './protection-droits.guard';

describe('ProtectionDroits', () => {
  let guard: ProtectionDroits;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProtectionDroits);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
