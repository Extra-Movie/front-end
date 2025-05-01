import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DarkModeService } from './services/dark-mode.service';
import { AsyncPipe } from '@angular/common';
import { ToasterContainerComponent } from "./components/toaster/toaster-container/toaster-container.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsyncPipe, ToasterContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(public darkModeService: DarkModeService) {}
}
