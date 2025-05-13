import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasVistaComponent } from './notas-vista.component';

describe('NotasVistaComponent', () => {
  let component: NotasVistaComponent;
  let fixture: ComponentFixture<NotasVistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotasVistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotasVistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
