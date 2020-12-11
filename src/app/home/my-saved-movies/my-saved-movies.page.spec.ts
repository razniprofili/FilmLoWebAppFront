import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MySavedMoviesPage } from './my-saved-movies.page';

describe('MySavedMoviesPage', () => {
  let component: MySavedMoviesPage;
  let fixture: ComponentFixture<MySavedMoviesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MySavedMoviesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MySavedMoviesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
