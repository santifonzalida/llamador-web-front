import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from "../common/confirmacion-dialog/confirmacion-dialog.component";
import { PuestosService } from '../../services/puestos.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

interface Puesto {
    id: number;
    name: string;
    free: boolean;
    timestamp: number;
}

@Component({
    selector: 'admin-panel',
    templateUrl: './admin-panel.component.html',
    imports: [
        MatCardModule,
        MatIconModule,
        CommonModule,
        MatButtonModule,
    ],
    providers: [PuestosService],
    styleUrl: './admin-panel.component.css'
})


export class AdminPanelComponent implements OnInit, OnDestroy {

    
    private puestosSubscription: Subscription = new Subscription;

    puestos: Puesto[] = [];

    constructor(
        private puestosService: PuestosService, 
        private changeDetector: ChangeDetectorRef,
        private router: Router,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        this.puestosSubscription = this.puestosService.puestos$.subscribe((items: any[]) => {
            console.log(items);
            if (!items) {
                return;
            }

            this.puestos = items;
            this.changeDetector.detectChanges();
        });
    }

    ngOnDestroy() {
        if (this.puestosSubscription) {
            this.puestosSubscription.unsubscribe(); 
        }
    }

    agregarPuesto() {
        this.puestosService.addPuesto();
    }

    irAlPuestoAtencion(puesto: Puesto){
        if (!puesto.free){
            return;
        }
        this.router.navigate(['/puesto', puesto.id]);
    }

    cancelarEliminarPuesto(){

    }

    aceptarEliminarPuesto(p: Puesto) {
        this.puestosService.deletePuesto(p.id);
    }

    abrirDialogoEliminar(p: Puesto): void {
        const dialogRef = this.dialog.open(DialogContentComponent, {
            width: '300px',
            data: { name: p.name }
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.aceptarEliminarPuesto(p);
            }
        });
    }
  


}