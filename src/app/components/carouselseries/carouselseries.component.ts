import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaCardComponent } from '../mediacard/mediacard.component';
import { SeriesService } from '../../services/server/series.service';
import { Series } from '../../Types/series.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-carousel-series',
  imports: [CommonModule, MediaCardComponent],
  templateUrl: './carouselseries.component.html',
  styles: ``
})
export class CarouselSeriesComponent implements OnInit, AfterViewInit {
  @ViewChild('carouselContainer') carouselContainer!: ElementRef;

  popularSeries: Series[] = [];
  loading: boolean = true;
  currentIndex: number = 0;
  visibleItems: number = 20;
  isMinimized: boolean = false;
  constructor(
    private seriesService: SeriesService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.fetchPopularSeries();
  }

  ngAfterViewInit(): void {
    this.adjustVisibleItems();
    window.addEventListener('resize', () => this.adjustVisibleItems());
  }

  //visible items, width and height of the card

  adjustVisibleItems(): void {
    const width = window.innerWidth;
    if (width < 640) {
      this.visibleItems = 1;
    } else if (width < 768) {
      this.visibleItems = 2;
    } else if (width < 1024) {
      this.visibleItems = 3;
    } else {
      this.visibleItems = 4;
    }
  }

  getCardWidth(): string {
    const width = window.innerWidth;
    if (width < 640) return '80%';
    if (width < 768) return '48%';
    if (width < 1024) return '31%';
    return '23%';
  }

  getCardHeight(): string {
    const width = window.innerWidth;
    if (width < 640) return '400px';
    if (width < 768) return '300px';
    if (width < 1024) return '200px';
    return '150px';
  }

  getItemWidth() {
    return this.getCardWidth();
  }

  fetchPopularSeries(): void {
    this.loading = true;
    this.seriesService.getAllSeries(1, {
      nameValue: '',
      yearValue: '',
      genreValue: 0,
      voteValue: 0,
      popularityValue: 0
    }).subscribe({
      next: (response) => {
        if (response.state === 'loaded') {
          // Get only 15 series
          this.popularSeries = response.data.tvShows.slice(0, 15);
          this.loading = false;
        } else if (response.state === 'error') {
          this.toastService.error('Failed to load popular series');
          this.loading = false;
        }
      },      error: (err) => {
        this.toastService.error('An error occurred while fetching series');
        this.loading = false;
      }
    });
  }

  next(): void {
    if (this.currentIndex < this.popularSeries.length - this.visibleItems) {
      this.currentIndex++;
      this.scrollCarousel();
    }
  }

  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.scrollCarousel();
    }
  }

  scrollCarousel(): void {
    if (!this.carouselContainer?.nativeElement) return;
    const container = this.carouselContainer.nativeElement;
    const card = container.children[0] as HTMLElement;
    const cardWidth = card?.offsetWidth || 0;
    container.scrollTo({
      left: this.currentIndex * (cardWidth + 20),
      behavior: 'smooth'
    });
  }
}
