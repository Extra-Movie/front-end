import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-nav-layout',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './nav-layout.component.html',
})
export class NavLayoutComponent {}
