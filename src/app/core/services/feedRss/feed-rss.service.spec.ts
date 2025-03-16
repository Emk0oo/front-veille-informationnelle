import { TestBed } from '@angular/core/testing';

import { FeedRssService } from './feed-rss.service';

describe('FeedRssService', () => {
  let service: FeedRssService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedRssService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
