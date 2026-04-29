import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { Llamable } from '../models/llamable.model';

export type SocketConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';

@Injectable({ providedIn: 'root' })
export class SocketService {
    private connectionStatusSubject = new BehaviorSubject<SocketConnectionState>('connecting');
    connectionStatus$ = this.connectionStatusSubject.asObservable();
    private connectionErrorSubject = new BehaviorSubject<string | null>(null);
    connectionError$ = this.connectionErrorSubject.asObservable();

    constructor(private socket: Socket) {
        this.socket.fromEvent('connect').subscribe(() => {
            this.connectionStatusSubject.next('connected');
            this.connectionErrorSubject.next(null);
        });

        this.socket.fromEvent('disconnect').subscribe((reason: string) => {
            this.connectionStatusSubject.next('disconnected');
            this.connectionErrorSubject.next(`Desconectado: ${reason || 'sin razón especificada'}`);
        });

        this.socket.fromEvent('connect_error').subscribe((error: unknown) => {
            this.connectionStatusSubject.next('error');
            this.connectionErrorSubject.next(this.formatError(error, 'Error de conexión'));
        });

        this.socket.fromEvent('connect_timeout').subscribe(() => {
            this.connectionStatusSubject.next('error');
            this.connectionErrorSubject.next('Tiempo de conexión agotado');
        });

        this.socket.fromEvent('reconnect_attempt').subscribe((attempt: number) => {
            this.connectionStatusSubject.next('connecting');
            this.connectionErrorSubject.next(`Intento de reconexión #${attempt}`);
        });

        this.socket.fromEvent('reconnect_failed').subscribe(() => {
            this.connectionStatusSubject.next('error');
            this.connectionErrorSubject.next('Reintento de reconexión fallido');
        });
    }

    private formatError(error: unknown, fallback: string): string {
        if (!error) {
            return fallback;
        }

        if (typeof error === 'string') {
            return error;
        }

        if (error instanceof Error) {
            return error.message || fallback;
        }

        try {
            return JSON.stringify(error);
        } catch {
            return fallback;
        }
    }

    // eventos puesto
    onPuestosUpdate(): Observable<any> { return this.socket.fromEvent('puesto:update'); }
    onPuestoAdded(): Observable<any> { return this.socket.fromEvent('puesto:added'); }
    onPuestoTaked(): Observable<any> { return this.socket.fromEvent('puesto:taked'); }
    onPuestoDeleted(): Observable<any> { return this.socket.fromEvent('puesto:deleted'); }
    onPuestoLiberated(): Observable<any> { return this.socket.fromEvent('puesto: liberated'); }
    onPersonCalled(): Observable<any> { return this.socket.fromEvent('person:called'); }

    // events llamable
    onLlamablesUpdate(): Observable<any> { return this.socket.fromEvent('llamable:update'); }
    onLlamarPersona(): Observable<any> { return this.socket.fromEvent('llamable:called'); }

    // connection events
    onConnect(): Observable<any> { return this.socket.fromEvent('connect'); }
    onDisconnect(): Observable<any> { return this.socket.fromEvent('disconnect'); }
    onConnectError(): Observable<any> { return this.socket.fromEvent('connect_error'); }
    onConnectTimeout(): Observable<any> { return this.socket.fromEvent('connect_timeout'); }
    onReconnectAttempt(): Observable<any> { return this.socket.fromEvent('reconnect_attempt'); }
    onReconnectFailed(): Observable<any> { return this.socket.fromEvent('reconnect_failed'); }

    // emitters puesto
    addPuesto(): void { this.socket.emit('puesto:add'); }
    deletePuesto(id: number): void { this.socket.emit('puesto:delete', { id }); }
    takePuesto(id: number): void { this.socket.emit('puesto:take', { id }); }
    liberatePuesto(id: number): void { this.socket.emit('puesto:liberate', { id }); }
    
    // emitters llamable
    llamarPersona(payload: Llamable): void { this.socket.emit('llamable:call', payload ); }
}