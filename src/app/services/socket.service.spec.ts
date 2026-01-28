import { TestBed } from '@angular/core/testing';
import { Socket } from 'ngx-socket-io';
import { SocketService } from './socket.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs'; // Necesario para simular eventos

describe('SocketService', () => {
  let service: SocketService;

  // Creamos un mock manual con funciones de Vitest (vi.fn)
  const socketMock = {
    fromEvent: vi.fn().mockReturnValue(of({})),
    emit: vi.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SocketService,
        // mock en lugar del Socket real
        { provide: Socket, useValue: socketMock }
      ]
    });

    service = TestBed.inject(SocketService);
  });

  it('debería crearse de forma correcta', () => {
    expect(service).toBeTruthy();
  });

  it('debería llamar a emit con los parámetros correctos en addPuesto', () => {
    service.addPuesto();
    // Verificamos que el mock fue llamado correctamente
    expect(socketMock.emit).toHaveBeenCalledWith('puesto:add');
  });

  it('debería emitir "puesto:delete" con el ID correcto', () => {
    const testId = 5;
    service.deletePuesto(testId);
    
    expect(socketMock.emit).toHaveBeenCalledWith('puesto:delete', { id: testId });
  });

  it('debería escuchar el evento "person:called"', () => {
    service.onPersonCalled();
    expect(socketMock.fromEvent).toHaveBeenCalledWith('person:called');
  });  
  
});
