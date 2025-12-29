import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SocketService } from './socket.service';

export interface Puesto {
    id: number;
    name: string;
    free: boolean;
    timestamp: number;
    idClient: string;
  }

@Injectable({ providedIn: 'root' })
export class PuestosService {

    private puestoSubject = new BehaviorSubject<Puesto[]>([]);
    puestos$ = this.puestoSubject.asObservable();

    constructor(private socket: SocketService) {
        this.socket.onPuestosUpdate().subscribe((p: Puesto[]) => this.puestoSubject.next(p));
        this.socket.onPuestoAdded().subscribe((p: Puesto) => {});
        this.socket.onPuestoTaked().subscribe((p: Puesto[]) => this.puestoSubject.next(p));
        this.socket.onPuestoLiberated().subscribe((p: Puesto[]) => this.puestoSubject.next(p));
    }

    addPuesto() { this.socket.addPuesto(); }
    deletePuesto(id: number) { this.socket.deletePuesto(id); }
    takePuesto(id: number) { this.socket.takePuesto(id); }
    liberatePuesto(id: number) { this.socket.liberatePuesto(id); }
}