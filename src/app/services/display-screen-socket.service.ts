import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Puesto } from '../models/puesto.model';

@Injectable({
  providedIn: 'root'
})
export class DisplayScreenSocketService {

  private socket!: Socket;

  connect(url: string): void {
    if (!this.socket) {
      this.socket = io(url);
    }
  }

  escucharActualizarPuesto(): Observable<Puesto> {
    return new Observable(observer => {
      this.socket.on('puesto', (data: Puesto) => {
        observer.next(data);
      });
    });
  }

  actualizarPuesto(puesto: Puesto): void {
    this.socket.emit('actualizar-puesto', puesto);
  }
}
