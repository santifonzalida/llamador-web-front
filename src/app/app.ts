import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, MatButtonModule, MatCardModule, MatSidenavModule, MatIconModule, MatToolbarModule, MatListModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  actions = [
    'Acción 1',
    'Acción 2',
    'Acción 3',
  ];

  protected readonly title = signal('sala-front');
}
