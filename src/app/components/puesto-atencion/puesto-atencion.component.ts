import { Component, inject, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from '@angular/material/dialog';
import { PuestosService } from '../../services/puestos.service';
import { LlamadorService } from "../../services/llamador.service";
import { Llamable } from "../../models/llamable.model";
import { DialogContentComponent } from "../common/confirmacion-dialog/confirmacion-dialog.component";

@Component({
  selector: 'puesto-atencion',
  templateUrl: './puesto-atencion.component.html',
  styleUrl: './puesto-atencion.component.scss',
  providers: [PuestosService],
  imports: [MatInputModule, MatButtonModule, CommonModule, MatFormFieldModule, MatIconModule, MatCardModule, FormsModule, ReactiveFormsModule, MatListModule]
})

export class PuestoAtencionComponent implements OnInit, OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  private puestoSubscription: Subscription = new Subscription;

  idPuestoAtencion: number = 0;
  nombreIngresado = '';
  nombrePersona: string = '';
  namePuestoAtencion: string = '';
  payload: Llamable = {id: 0, nombrePuesto: '', persona: '', timestamp: Date.now(), fueLlamado: false};

  constructor(
    private puestosService: PuestosService,
    private llamadorService: LlamadorService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.puestoSubscription = this.activatedRoute.params.subscribe(params => {
      if (!params) {
        return;
      }
      this.idPuestoAtencion = Number(params['id']);
      this.puestosService.takePuesto(this.idPuestoAtencion);
    });

    this.activatedRoute.queryParams.subscribe(p => {
      if(!p) {
        return;
      }
      this.namePuestoAtencion = p['name'];
    })
  }

  ngOnDestroy() {
    if (this.puestoSubscription) {
      this.puestoSubscription.unsubscribe();
    }
  }

  agregarNombre() {
    this.payload = {id: 0, nombrePuesto: '', persona: '', timestamp: Date.now(), fueLlamado: false};
    this.nombrePersona = this.nombreIngresado;
    this.nombreIngresado = '';
  }

  llamar() {
    if(this.payload.fueLlamado) {
      this.abrirModalRellamado();
    } else {
      this.payload = {
        id: 0,
        nombrePuesto: this.namePuestoAtencion,
        persona: this.nombrePersona,
        timestamp: Date.now(),
        fueLlamado: true
      }
    this.llamadorService.llamarPersona(this.payload);
    }
  }

  editar() {
    if (!this.nombrePersona) return;
    this.nombreIngresado = this.nombrePersona;
    this.nombrePersona = '';
  }

  eliminar() {
    this.nombreIngresado = '';
    this.nombrePersona = '';
  }

  volverAPrincipal() {
    this.puestosService.liberatePuesto(this.idPuestoAtencion);
    this.router.navigate(['/admin-panel']);
  }

  abrirModalRellamado(): void {
    const dialogRef = this.dialog.open(DialogContentComponent, {
        width: '300px',
        data: { 
          title: 'Atención', 
          message: `Se llamará nuevamente a: ${this.payload.persona}`,
          txtBtnSuccess: 'Aceptar',
          txtBtnCancel: 'Cancelar'    
        }
    });
      
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
            this.volverALlamar();
        }
    });
  }

  volverALlamar(){
    this.llamadorService.llamarPersona(this.payload);
  }

}