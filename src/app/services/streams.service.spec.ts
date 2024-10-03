import { TestBed } from '@angular/core/testing';

import { StreamsService } from './streams.service';

describe('StreamsService', () => {
  let service: StreamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StreamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
