import { TestBed } from '@angular/core/testing';

import { UserPermService } from './user-perm.service';

describe('UserPermService', () => {
  let service: UserPermService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserPermService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
