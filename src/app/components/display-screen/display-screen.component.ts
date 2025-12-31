import { Component, OnInit, ChangeDetectorRef, OnDestroy} from "@angular/core";
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatCardModule } from "@angular/material/card";
import { Llamable, LlamadorService } from "../../services/llamador.service";

@Component({
    selector: 'display-screen',
    templateUrl: './display-screen.component.html',
    styleUrl: './display-screen.component.scss',
    imports: [MatCardModule, CommonModule],
    providers: [LlamadorService]
})

export class DisplayScreenComponent implements OnInit, OnDestroy{

    private llamableSubscription: Subscription = new Subscription;
    llamables: Llamable[] = [];
    //llamableActual: Llamable = undefined;

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
    
            this.llamables = llamables;
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
        this.audio.load(); // Carga el audio
        this.audio.play(); // Reproduce el audio
      }
    

      iniciarPantalla(){
        this.reproducirSonido();
        this.textoInicial = '';
      }
}