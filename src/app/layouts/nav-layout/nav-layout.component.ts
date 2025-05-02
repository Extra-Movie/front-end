import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AboutComponent } from "../../pages/about/about.component";
import { ContactUsComponent } from "../../pages/contact-us/contact-us.component";

@Component({
  selector: 'app-nav-layout',
  imports: [RouterOutlet, AboutComponent, ContactUsComponent],
  templateUrl: './nav-layout.component.html',
})
export class NavLayoutComponent {}
