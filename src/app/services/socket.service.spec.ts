import { TestBed } from '@angular/core/testing';
import { Socket } from 'ngx-socket-io';
import { SocketService } from './socket.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';
import { Llamable } from '../models/llamable.model';

describe('SocketService', () => {
  let service: SocketService;

  const socketMock = {
    fromEvent: vi.fn((event: string) => {
      if (event === 'connect') return of({});
      return of();
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

  it('debería escuchar el evento "puesto:update"', () => {
    service.onPuestosUpdate();
    expect(socketMock.fromEvent).toHaveBeenCalledWith('puesto:update');
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

  it('debería emitir "llamable:call" con el payload correcto', () => {
    const payload: Llamable = {
      id: 1,
      fueLlamado: false,
      nombrePuesto: 'Caja 1',
      persona: 'Roberto Carlos',
      timestamp: Date.now()
    };
    service.llamarPersona(payload);
    expect(socketMock.emit).toHaveBeenCalledWith('llamable:call', payload);
  });

  it('debería exponer connectionState$ iniciando en "connected" al recibir connect', () => {
    let state: string | undefined;
    service.connectionState$.subscribe(s => state = s);
    expect(state).toBe('connected');
  });
});
