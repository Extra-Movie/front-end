
import { Component } from '@angular/core';
import {NgIcon ,provideIcons} from '@ng-icons/core';
import {faBrandSquareFacebook,faBrandSquareXTwitter,faBrandSquareInstagram,faBrandSquareYoutube} from "@ng-icons/font-awesome/brands"
@Component({
  selector: 'app-footer',
  imports: [NgIcon],
  templateUrl: './footer.component.html',
  styles: ``,
  providers: [provideIcons({faBrandSquareFacebook,faBrandSquareXTwitter,faBrandSquareInstagram,faBrandSquareYoutube})]
})
export class FooterComponent {

}
