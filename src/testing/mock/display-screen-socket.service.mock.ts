import { Subject } from 'rxjs';
import { Llamable } from '../../app/models/llamable.model';

export class DisplayScreenSocketServiceMock {

  private llamable$ = new Subject<Llamable>();

  escucharLlamado() {
    return this.llamable$.asObservable();
  }

  emitirLlamado(llamado: Llamable): void {}

  actualizarPantalla(llamado: Llamable) {
    this.llamable$.next(llamado);
  }
}
