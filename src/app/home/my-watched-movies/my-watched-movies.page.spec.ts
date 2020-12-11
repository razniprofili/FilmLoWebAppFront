import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyWatchedMoviesPage } from './my-watched-movies.page';

describe('MyWatchedMoviesPage', () => {
  let component: MyWatchedMoviesPage;
  let fixture: ComponentFixture<MyWatchedMoviesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyWatchedMoviesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyWatchedMoviesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
