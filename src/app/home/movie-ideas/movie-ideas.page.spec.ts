import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MovieIdeasPage } from './movie-ideas.page';

describe('MovieIdeasPage', () => {
  let component: MovieIdeasPage;
  let fixture: ComponentFixture<MovieIdeasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovieIdeasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieIdeasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
