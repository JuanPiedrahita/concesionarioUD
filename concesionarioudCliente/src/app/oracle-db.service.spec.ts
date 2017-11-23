import { TestBed, inject } from '@angular/core/testing';

import { OracleDbService } from './oracle-db.service';

describe('OracleDbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OracleDbService]
    });
  });

  it('should be created', inject([OracleDbService], (service: OracleDbService) => {
    expect(service).toBeTruthy();
  }));
});
