import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayScreenComponent } from './display-screen.component';
import { DisplayScreenSocketService } from '../../services/display-screen-socket.service';
import { DisplayScreenSocketServiceMock } from '../../../testing/mock/display-screen-socket.service.mock';

describe('LlamadoActualComponent', () => {
  let component: DisplayScreenComponent;
  let fixture: ComponentFixture<DisplayScreenComponent>;
  let socketMock: DisplayScreenSocketServiceMock;

  beforeEach(async () => {
    socketMock = new DisplayScreenSocketServiceMock();

    await TestBed.configureTestingModule({
      declarations: [DisplayScreenComponent],
      providers: [
        { provide: DisplayScreenSocketService, useValue: socketMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe mostar por pantalla el llamable recibido por socket', () => {
    socketMock.actualizarPantalla({
        id: 0,
        persona: 'Roberto Carlos',
        timestamp: Date.now(),
        nombrePuesto: 'Puesto 1',
        fueLlamado: false
    });

    fixture.detectChanges();

    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('Roberto Carlos');
    expect(html.textContent).toContain('Puesto 1');
  });
});
