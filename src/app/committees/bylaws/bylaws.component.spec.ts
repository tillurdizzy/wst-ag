import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BylawsComponent } from './bylaws.component';

describe('BylawsComponent', () => {
  let component: BylawsComponent;
  let fixture: ComponentFixture<BylawsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BylawsComponent]
    });
    fixture = TestBed.createComponent(BylawsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
