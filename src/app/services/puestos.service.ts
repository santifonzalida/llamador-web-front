import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SocketService } from './socket.service';
import { Puesto } from '../models/puesto.model';

@Injectable({ providedIn: 'root' })
export class PuestosService {
    private puestoSubject = new BehaviorSubject<Puesto[]>([]);
    puestos$ = this.puestoSubject.asObservable();

    constructor(private socket: SocketService) {
        this.socket.onPuestosUpdate().subscribe(p => this.puestoSubject.next(p));
        this.socket.connectionState$.subscribe(state => {
            if (state === 'disconnected' || state === 'error') {
                this.puestoSubject.next([]);
            }
        });
    }

    addPuesto(): void { this.socket.addPuesto(); }
    deletePuesto(id: number): void { this.socket.deletePuesto(id); }
    takePuesto(id: number): void { this.socket.takePuesto(id); }
    liberatePuesto(id: number): void { this.socket.liberatePuesto(id); }
}
