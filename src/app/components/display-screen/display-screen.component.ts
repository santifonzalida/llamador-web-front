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
        this.llamableSubscription = this.llamadorService.llamable$.subscribe((llamables: any) => {
            if (!llamables || llamables.length == 0) {
                return;
            }
            this.llamableActual = llamables[llamables.length -1];
            this.historialLlamables = llamables;
            this.changeDetector.detectChanges();
            this.reproducirSonido();
        });
    }

    ngOnDestroy(): void {
        if (this.llamableSubscription) {
            this.llamableSubscription.unsubscribe(); 
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