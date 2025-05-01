// src/app/services/dark-mode.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type themeType = 'light' | 'dark';
@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private darkMode = new BehaviorSubject<themeType>('light');
  darkMode$ = this.darkMode.asObservable();

  constructor() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';
    const storedPreference = localStorage.getItem('dark-mode');

    if (storedPreference !== null) {
      if (storedPreference === 'light' || storedPreference === 'dark') {
        this.darkMode.next(storedPreference as themeType);
      }
    } else {
      this.darkMode.next(prefersDark);
    }
  }

  toggleDarkMode() {
    this.darkMode.next(
      (this.darkMode.value === 'light' ? 'dark' : 'light') as themeType
    );
    localStorage.setItem('dark-mode', this.darkMode.value.toString());
  }
}
