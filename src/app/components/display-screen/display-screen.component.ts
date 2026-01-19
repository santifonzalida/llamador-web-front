import { Component, OnInit, ChangeDetectorRef, OnDestroy} from "@angular/core";
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatCardModule } from "@angular/material/card";
import { LlamadorService } from "../../services/llamador.service";
import { Llamable } from "../../models/llamable.model";
import { MatTableModule } from '@angular/material/table';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
    selector: 'display-screen',
    standalone: true,
    templateUrl: './display-screen.component.html',
    styleUrl: './display-screen.component.scss',
    imports: [MatCardModule, CommonModule, MatTableModule],
    providers: [LlamadorService],
    animations: [
        trigger('llamadoAnimado', [
          transition(':enter', [
            style({ transform: 'scale(1.1)', backgroundColor: '#ffffff' }),
            animate('1300ms ease-out',
              style({ transform: 'scale(1)', backgroundColor: '#cddef5ff' })
            )
          ])
    ])]
})

export class DisplayScreenComponent implements OnInit, OnDestroy{
    private llamableSubscription: Subscription = new Subscription;
    audioUrl: string = 'assets/electronic-doorbell.mp3';
    audio: HTMLAudioElement; 
    TIEMPO_MINIMO = 6000;
    procesando: boolean = false;
    historialLlamables: Llamable[] = [];
    colaDeEspera: Llamable[] = [];
    llamableActual: any;
    textoInicial: string = 'Iniciar';
    mostrarTablaLlamadoActual = false;
    
    constructor(
        private llamadorService: LlamadorService,
        private changeDetector: ChangeDetectorRef
    ) {
        this.audio = new Audio(this.audioUrl);
    }

    ngOnInit(): void {
        this.llamableSubscription = this.llamadorService.llamable$.subscribe((llamables: Llamable[]) => {
            if (!llamables || llamables.length == 0) {
                return;
            }
            this.colaDeEspera.push(llamables[0]);

            if (!this.procesando) {
                this.mostrarTablaLlamadoActual = false;
                this.llamarPorPantalla();
            }
        });
    }

    ngOnDestroy(): void {
        if (this.llamableSubscription) {
            this.llamableSubscription.unsubscribe(); 
        }
    }

    async llamarPorPantalla(){
        if (this.colaDeEspera.length == 0) {
            this.procesando = false;
            return;
        }

        this.mostrarTablaLlamadoActual = true;

        this.procesando = true;
        this.llamableActual = this.colaDeEspera.shift();
        
        if (this.llamableActual){
            this.historialLlamables.push(this.llamableActual);
            
            this.historialLlamables.sort((a,b) => b.timestamp - a.timestamp);
            this.changeDetector.detectChanges();
        }
        
        this.reproducirSonido();
        await this.nuevasEspera(this.TIEMPO_MINIMO);
        this.llamarPorPantalla();
    }

    nuevasEspera(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    } 

    reproducirSonido() {
        this.audio.load();
        this.audio.play(); 
    }
    
    iniciarPantalla(){
        this.reproducirSonido();
        this.textoInicial = '';
    }
}