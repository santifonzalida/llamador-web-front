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

    private llamableSubscription: Subscription = new Subscription;
    historialLlamables: Llamable[] = [];
    colaDeEspera: Llamable[] = [];
    llamableActual: Llamable = {id: 0, idPuesto: 0, persona: '', timestamp: Date.now()};
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
            this.llamarPorPantalla(llamables);

            if (this.colaDeEspera.length > 0) {
                setTimeout(() => {
                    this.llamarPorPantalla(llamables);
                    this.colaDeEspera = [];
                }, 6000 - (this.colaDeEspera[0].timestamp - this.llamableActual.timestamp));
            }
        });
    }

    ngOnDestroy(): void {
        if (this.llamableSubscription) {
            this.llamableSubscription.unsubscribe(); 
        }
    }

    llamarPorPantalla(llamables: Llamable[]){
        if (llamables[0].timestamp - this.llamableActual.timestamp > 6000) {
            this.llamableActual = llamables[0];
            this.historialLlamables = llamables;
            this.changeDetector.detectChanges();
            this.reproducirSonido();
        } else {
            this.colaDeEspera.push(llamables[0]);
        }
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