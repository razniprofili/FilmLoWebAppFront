import { TestBed } from '@angular/core/testing';

import { SavedMoviesService } from './saved-movies.service';

describe('SavedMoviesService', () => {
  let service: SavedMoviesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavedMoviesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
