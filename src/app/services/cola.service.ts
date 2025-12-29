import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SocketService } from './socket.service';

export interface Person {
    id: string;
    name: string;
    called: boolean;
    timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class ColaService {
    // private queueSubject = new BehaviorSubject<Person[]>([]);
    // queue$ = this.queueSubject.asObservable();

    // constructor(private socket: SocketService) {
    //     this.socket.onQueueUpdate().subscribe((q: Person[]) => this.queueSubject.next(q));
    //     this.socket.onPersonAdded().subscribe((p: Person) => {
    //         // optional: already handled by queue:update, but we can play a sound here
    //     });
    //     this.socket.onPersonCalled().subscribe((p: Person) => {
    //         // show notification / animation on display
    //     });
    // }

    // addPerson(name: string) { this.socket.addPerson(name); }
    // callPerson(id: string) { this.socket.callPerson(id); }
    // next() { this.socket.next(); }
}