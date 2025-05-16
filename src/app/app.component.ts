import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { DarkModeService } from './services/dark-mode.service';
import { AsyncPipe } from '@angular/common';
import { ToasterContainerComponent } from './components/toaster/toaster-container/toaster-container.component';
import {ScrollProgressComponent}  from './components/scroll-progress/scroll-progress.component'
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsyncPipe, ToasterContainerComponent,ScrollProgressComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(
    public darkModeService: DarkModeService,
    private router: Router,
    private user: UserService
  ) {
    // scroll to top on route change
    this.router.events.subscribe(() => {
      window.scrollTo({ behavior: 'smooth', top: 0, left: 0 });
    });
    user.getMyData().subscribe();
  }
}
