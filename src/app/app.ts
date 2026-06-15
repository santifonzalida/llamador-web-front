import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SocketService, ConnectionState } from './services/socket.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, MatButtonModule, MatCardModule, MatSidenavModule, MatIconModule, MatToolbarModule, MatListModule, MatTooltipModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private router = inject(Router);
  private socketService = inject(SocketService);

  isDisplayScreen = false;
  actions = ['Acción 1'];
  protected readonly title = signal('sala-front');
  protected connectionState = toSignal(this.socketService.connectionState$, { initialValue: 'connecting' as ConnectionState });

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isDisplayScreen = event.urlAfterRedirects === '/display-screen';
    });
  }

  get connectionLabel(): string {
    const labels: Record<ConnectionState, string> = {
      connected: 'Conectado',
      connecting: 'Conectando...',
      disconnected: 'Sin conexión',
      error: 'Error de conexión',
    };
    return labels[this.connectionState()];
  }
}
