import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidEnvelope, faSolidPhone } from '@ng-icons/font-awesome/solid';
@Component({
  selector: 'app-contact-us',
  imports: [NgIcon],
  templateUrl: './contact-us.component.html',
  styles: ``,
  providers: [provideIcons({ faSolidEnvelope, faSolidPhone })]
})
export class ContactUsComponent {

}
