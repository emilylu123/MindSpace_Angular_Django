import { TestBed } from '@angular/core/testing';

import { EmotionListService } from './emotion-list.service';

describe('EmotionListService', () => {
  let service: EmotionListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmotionListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
