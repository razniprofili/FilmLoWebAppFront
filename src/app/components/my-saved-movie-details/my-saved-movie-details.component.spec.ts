import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
// import {MatIconModule} from '@angular/material/icon';
import { MySavedMovieDetailsComponent } from './my-saved-movie-details.component';

describe('MySavedMovieDetailsComponent', () => {
  let component: MySavedMovieDetailsComponent;
  let fixture: ComponentFixture<MySavedMovieDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MySavedMovieDetailsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MySavedMovieDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
