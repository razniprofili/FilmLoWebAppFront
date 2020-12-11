import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyFriendsPage } from './my-friends.page';

describe('MyFriendsPage', () => {
  let component: MyFriendsPage;
  let fixture: ComponentFixture<MyFriendsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyFriendsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyFriendsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
