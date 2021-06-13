import { TestBed } from '@angular/core/testing';

import { EmotionsService } from './emotions.service';

describe('EmotionsService', () => {
  let service: EmotionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmotionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
