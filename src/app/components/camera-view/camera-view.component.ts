import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidCamera ,faSolidBatteryHalf} from '@ng-icons/font-awesome/solid';
import { bootstrapRecordCircle } from '@ng-icons/bootstrap-icons';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-camera-view',
  imports: [NgIcon, RouterLink],
  templateUrl: './camera-view.component.html',
  styles: ``,
  providers: [provideIcons({ faSolidCamera ,faSolidBatteryHalf,bootstrapRecordCircle })],
})
export class CameraViewComponent {

}
