import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { Llamable } from '../models/llamable.model';
import { Puesto } from '../models/puesto.model';

export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';

@Injectable({ providedIn: 'root' })
export class SocketService {
    private connectionStateSubject = new BehaviorSubject<ConnectionState>('connecting');
    connectionState$ = this.connectionStateSubject.asObservable();

    constructor(private socket: Socket) {
        this.socket.fromEvent('connect').subscribe(() => this.connectionStateSubject.next('connected'));
        this.socket.fromEvent('disconnect').subscribe(() => this.connectionStateSubject.next('disconnected'));
        this.socket.fromEvent('connect_error').subscribe(() => this.connectionStateSubject.next('error'));
        this.socket.fromEvent('reconnect_attempt').subscribe(() => this.connectionStateSubject.next('connecting'));
    }

    // puesto events
    onPuestosUpdate(): Observable<Puesto[]> { return this.socket.fromEvent<Puesto[]>('puesto:update'); }

    // llamable events
    onLlamablesUpdate(): Observable<Llamable[]> { return this.socket.fromEvent<Llamable[]>('llamable:update'); }
    onLlamarPersona(): Observable<Llamable[]> { return this.socket.fromEvent<Llamable[]>('llamable:called'); }

    // emitters puesto
    addPuesto(): void { this.socket.emit('puesto:add'); }
    deletePuesto(id: number): void { this.socket.emit('puesto:delete', { id }); }
    takePuesto(id: number): void { this.socket.emit('puesto:take', { id }); }
    liberatePuesto(id: number): void { this.socket.emit('puesto:liberate', { id }); }

    // emitters llamable
    llamarPersona(payload: Llamable): void { this.socket.emit('llamable:call', payload); }
}
