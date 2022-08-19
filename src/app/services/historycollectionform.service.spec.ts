import { TestBed } from '@angular/core/testing';

import { HistorycollectionformService } from './historycollectionform.service';

describe('HistorycollectionformService', () => {
  let service: HistorycollectionformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistorycollectionformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
