import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd  } from '@angular/router';
import { filter } from 'rxjs/operators';
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
export class App implements OnInit{

  isDisplayScreen: boolean = false;
  actions = [
    'Acción 1',
  ];

  protected readonly title = signal('sala-front');

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isDisplayScreen = event.urlAfterRedirects === '/display-screen';
    });
  }
  
} 
