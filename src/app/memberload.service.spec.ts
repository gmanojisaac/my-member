import { TestBed } from '@angular/core/testing';

import { MemberloadService } from './memberload.service';

describe('MemberloadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MemberloadService = TestBed.get(MemberloadService);
    expect(service).toBeTruthy();
  });
});
