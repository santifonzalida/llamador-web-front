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
import { PuestosService } from '../../services/puestos.service';
import { Llamable, LlamadorService } from "../../services/llamador.service";

interface Person {
  nombreCompleto: string;
  id: number;
  timestamp: number;
  fueLlamado: boolean;
}

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
  public cola: Person[] = [];

  private puestoSubscription: Subscription = new Subscription;

  idPuestoAtencion: number = 0;
  nombreIngresado = '';
  nombrePersona: string = '';

  constructor(
    private puestosService: PuestosService,
    private llamadorService: LlamadorService
  ) { }

  ngOnInit() {
    this.puestoSubscription = this.activatedRoute.params.subscribe(params => {
      if (!params) {
        return;
      }
      this.idPuestoAtencion = Number(params['id']);
      this.puestosService.takePuesto(this.idPuestoAtencion);
    });
  }

  ngOnDestroy() {
    if (this.puestoSubscription) {
      this.puestoSubscription.unsubscribe();
    }
  }

  agregarNombre() {
    this.nombrePersona = this.nombreIngresado;
    this.nombreIngresado = '';
  }

  llamar() {
    const payload: Llamable = {
      id: 0,
      idPuesto: this.idPuestoAtencion,
      persona: this.nombrePersona,
      timestamp: Date.now()
    }
    this.llamadorService.llamarPersona(payload);
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

}