import { Subject } from 'rxjs';
import { Puesto } from '../models/puesto.model';

export class TurnosSocketServiceMock {

  private puesto$ = new Subject<Puesto>();

  escucharLlamado() {
    return this.puesto$.asObservable();
  }

  emitirLlamado = jasmine.createSpy('emitirActualizacion');

  actualizarPuesto(puesto: Puesto) {
    this.puesto$.next(puesto);
  }
}
