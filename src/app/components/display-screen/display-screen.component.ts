import { Component, OnInit, ChangeDetectorRef, OnDestroy} from "@angular/core";
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatCardModule } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { Llamable, LlamadorService } from "../../services/llamador.service";

@Component({
    selector: 'display-screen',
    templateUrl: './display-screen.component.html',
    styleUrl: './display-screen.component.scss',
    imports: [MatCardModule, CommonModule, MatIcon],
    providers: [LlamadorService]
})

export class DisplayScreenComponent implements OnInit, OnDestroy{
    
    TIEMPO_MINIMO = 6000;
    procesando: boolean = false;
    private llamableSubscription: Subscription = new Subscription;
    historialLlamables: Llamable[] = [];
    colaDeEspera: Llamable[] = [];
    llamableActual: any;
    textoInicial: string = 'Iniciar';
    audioUrl: string = 'assets/electronic-doorbell.mp3';
    audio: HTMLAudioElement; 

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