import { Component } from '@angular/core';
import { NgIcon , provideIcons } from '@ng-icons/core';
import { faSolidStar} from '@ng-icons/font-awesome/solid';
@Component({
  selector: 'app-mockup-responsive',
  imports: [NgIcon],
  templateUrl: './mockup-responsive.component.html',
  styles: ``,
  viewProviders:[provideIcons({faSolidStar})]
})
export class MockupResponsiveComponent {

}
