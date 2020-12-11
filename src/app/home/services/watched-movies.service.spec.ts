import { TestBed } from '@angular/core/testing';

import { WatchedMoviesService } from './watched-movies.service';

describe('WatchedMoviesService', () => {
  let service: WatchedMoviesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WatchedMoviesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
