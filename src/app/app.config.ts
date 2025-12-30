import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideSocketIo, SocketIoConfig } from 'ngx-socket-io';
import { routes } from './app.routes';
import { environment } from '../enviroment/enviroment';
import { MatDialogModule } from '@angular/material/dialog';

const config: SocketIoConfig = { 
  url: `${environment.apiUrl}`,
  options: {
    path: '/socket.io',
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideSocketIo(config),
    MatDialogModule,
  ],
};
