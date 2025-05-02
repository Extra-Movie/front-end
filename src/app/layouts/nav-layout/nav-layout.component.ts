import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "../footer/footer.component";
@Component({
  selector: 'app-nav-layout',
  imports: [RouterOutlet, FooterComponent],
  templateUrl: './nav-layout.component.html',
})
export class NavLayoutComponent {}
