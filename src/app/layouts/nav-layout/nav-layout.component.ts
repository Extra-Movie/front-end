import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
@Component({
  selector: 'app-nav-layout',
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  templateUrl: './nav-layout.component.html',
})
export class NavLayoutComponent {}
