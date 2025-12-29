import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Llamable } from './llamador.service';


@Injectable({ providedIn: 'root' })
export class SocketService {
    constructor(private socket: Socket) { }

    // events puesto
    onPuestosUpdate() { return this.socket.fromEvent('puesto:update'); }
    onPuestoAdded() { return this.socket.fromEvent('puesto:added'); }
    onPuestoTaked() { return this.socket.fromEvent('puesto:taked'); }
    onPuestoDeleted() { return this.socket.fromEvent('puesto:deleted'); }
    onPuestoLiberated() { return this.socket.fromEvent('puesto: liberated'); }
    onPersonCalled() { return this.socket.fromEvent('person:called'); }

    // events llamable
    onLlamablesUpdate() { return this.socket.fromEvent('llamable:update'); }
    onLlamarPersona() { return this.socket.fromEvent('llamable:called'); }

    // emitters puesto
    addPuesto() { this.socket.emit('puesto:add'); }
    deletePuesto(id: number) { this.socket.emit('puesto:delete', { id }); }
    takePuesto(id: number) { this.socket.emit('puesto:take', { id }); }
    liberatePuesto(id: number) { this.socket.emit('puesto:liberate', { id }); }
    
    // emitters llamable
    llamarPersona(payload: Llamable) { this.socket.emit('llamable:call', { payload }); }
}