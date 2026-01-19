import { TestBed } from '@angular/core/testing';
import { PuestoSocketService } from './puestos-socket.service';

describe('SocketService', () => {
  let service: PuestoSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PuestoSocketService);
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });
});
 