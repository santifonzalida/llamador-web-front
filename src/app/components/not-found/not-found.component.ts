import { Component } from "@angular/core";
import { Router } from '@angular/router';

@Component({
    selector: 'not-found',
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.scss',
    imports: []
})

export class NotFoundComponent {
   
    constructor(private router: Router) { }

    irPantallaPrincipal(){
        this.router.navigate(['/admin-panel']);
    }
}