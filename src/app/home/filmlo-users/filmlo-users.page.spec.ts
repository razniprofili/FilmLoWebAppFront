import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FilmloUsersPage } from './filmlo-users.page';

describe('FilmloUsersPage', () => {
  let component: FilmloUsersPage;
  let fixture: ComponentFixture<FilmloUsersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilmloUsersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FilmloUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
