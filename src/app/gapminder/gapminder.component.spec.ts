import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GapminderComponent } from './gapminder.component';

describe('GapminderComponent', () => {
  let component: GapminderComponent;
  let fixture: ComponentFixture<GapminderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GapminderComponent]
    });
    fixture = TestBed.createComponent(GapminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
