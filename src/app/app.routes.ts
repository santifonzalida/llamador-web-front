import { Routes } from '@angular/router';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { DisplayScreenComponent } from './components/display-screen/display-screen.component';
import { PuestoAtencionComponent } from './components/puesto-atencion/puesto-atencion.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
    {
        path: '',
        component: AdminPanelComponent,
        title: 'admin-panel'
    },
    {
        path: 'admin-panel',
        component: AdminPanelComponent,
        title: 'admin-panel'
    },
    {
        path: 'display-screen',
        component: DisplayScreenComponent,
        title: 'display-screen'
    },
    {
        path: 'puesto/:id',
        component: PuestoAtencionComponent,
    },
    { 
        path: '**', 
        component: NotFoundComponent }
];
