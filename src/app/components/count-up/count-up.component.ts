import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-count-up',
  imports: [CommonModule],
  templateUrl: './count-up.component.html',
})

 export class CountUpComponent implements OnInit {
  moviesValue = 0;
  seriesValue = 0;
  usersValue = 0;

  ngOnInit(): void {
    this.startCountUp('moviesValue', 3200);  
    this.startCountUp('seriesValue', 1200);
    this.startCountUp('usersValue', 150);
  }

  startCountUp(property: 'moviesValue' | 'seriesValue' | 'usersValue', target: number) {
    let current = 0;
    const step = Math.ceil(target / 100);
    const interval = setInterval(() => {
      if (current >= target) {
        this[property] = target;
        clearInterval(interval);
      } else {
        current += step;
        this[property] = current;
      }
    }, 15);
  }
}
