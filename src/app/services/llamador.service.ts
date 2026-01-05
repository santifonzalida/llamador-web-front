import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';
import { SocketService } from './socket.service';

export interface Llamable {
    id: number;
    persona: string;
    timestamp: number;
    nombrePuesto: string;
    fueLlamado: boolean;
}

@Injectable({ providedIn: 'root' })
export class LlamadorService {

    private llamableSubject = new BehaviorSubject<Llamable[]>([]);
    llamable$ = this.llamableSubject.asObservable();

    constructor(private socket: SocketService) {
        this.socket.onLlamarPersona().subscribe((l: Llamable[]) => this.llamableSubject.next(l));
    }

    llamarPersona(payload: Llamable) { this.socket.llamarPersona(payload); }   
}