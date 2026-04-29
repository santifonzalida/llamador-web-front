import { TestBed } from '@angular/core/testing';
import { Socket } from 'ngx-socket-io';
import { SocketService } from './socket.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs'; // Necesario para simular eventos
import { Llamable } from '../models/llamable.model';

describe('SocketService', () => {
  let service: SocketService;

  const socketMock = {
    fromEvent: vi.fn((event: string) => {
      switch (event) {
        case 'connect':
          return of({});
        default:
          return of();
      }
    }),
    emit: vi.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SocketService,
        { provide: Socket, useValue: socketMock }
      ]
    });

    service = TestBed.inject(SocketService);
  });

  it('debería crearse de forma correcta', () => {
    expect(service).toBeTruthy();
  });

  it('debería exponer el estado de conexión y los eventos de error', () => {
    service.onConnect();
    service.onDisconnect();
    service.onConnectError();
    service.onConnectTimeout();
    service.onReconnectAttempt();
    service.onReconnectFailed();

    expect(socketMock.fromEvent).toHaveBeenCalledWith('connect');
    expect(socketMock.fromEvent).toHaveBeenCalledWith('disconnect');
    expect(socketMock.fromEvent).toHaveBeenCalledWith('connect_error');
    expect(socketMock.fromEvent).toHaveBeenCalledWith('connect_timeout');
    expect(socketMock.fromEvent).toHaveBeenCalledWith('reconnect_attempt');
    expect(socketMock.fromEvent).toHaveBeenCalledWith('reconnect_failed');
  });

  it('debería llamar a emit con los parámetros correctos en addPuesto', () => {
    service.addPuesto();
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

  it('deberia generar el evento "llamar persona"', () => {
    const payload: Llamable = {
      id: 1,
      fueLlamado: false,
      nombrePuesto: 'Caja 1',
      persona: 'Roberto Carlos',
      timestamp: Date.now()
    }
    service.llamarPersona(payload);

    expect(socketMock.emit).toHaveBeenCalledWith('llamable:call', payload);
  });
});
