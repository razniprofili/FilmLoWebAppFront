import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IdeaMovieDetailsComponent } from './idea-movie-details.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';


describe('IdeaMovieDetailsComponent', () => {
  let component: IdeaMovieDetailsComponent;
  let fixture: ComponentFixture<IdeaMovieDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdeaMovieDetailsComponent ],
      imports: [
          IonicModule.forRoot(),
          MatButtonModule,
          MatIconModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IdeaMovieDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
