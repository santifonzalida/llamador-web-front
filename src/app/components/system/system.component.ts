import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { SystemService } from '../../services/system.service';
import { DialogContentComponent } from '../common/confirmacion-dialog/confirmacion-dialog.component';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrl: './system.component.scss',
  imports: [MatButtonModule, MatIconModule, MatCardModule],
})
export class SystemComponent {
  private systemService = inject(SystemService);
  private dialog = inject(MatDialog);

  shutdownInitiated = false;
  shutdownError = false;

  apagarSistema(): void {
    const dialogRef = this.dialog.open(DialogContentComponent, {
      width: '320px',
      data: {
        title: 'Apagar Raspberry Pi',
        message: 'La Raspberry Pi se apagará completamente. La app dejará de estar disponible hasta que se encienda nuevamente. ¿Confirmás?',
        txtBtnSuccess: 'Apagar',
        txtBtnCancel: 'Cancelar',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.ejecutarApagado();
    });
  }

  private ejecutarApagado(): void {
    this.systemService.shutdown().subscribe({
      next: () => {
        this.shutdownInitiated = true;
        this.shutdownError = false;
      },
      error: (err) => {
        if (err.status === 0) {
          // Error de red: la Pi puede estar apagándose y cortó la conexión antes de responder
          this.shutdownInitiated = true;
          this.shutdownError = false;
        } else {
          this.shutdownError = true;
        }
      },
    });
  }
}
