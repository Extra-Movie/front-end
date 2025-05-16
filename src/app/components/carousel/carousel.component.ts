import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaCardComponent } from '../mediacard/mediacard.component';
import { MovieService } from '../../services/server/movie.service';
import { MovieType } from '../../Types/Movie.types';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-carousel',
  imports: [CommonModule, MediaCardComponent],
  templateUrl: './carousel.component.html',
  styles: ``

})
export class CarouselComponent implements OnInit,  AfterViewInit, OnDestroy {
  getItemWidth() {
    throw new Error('Method not implemented.');
  }
  @ViewChild('carouselContainer') carouselContainer!: ElementRef;

  popularMovies: MovieType[] = [];
  loading: boolean = true;
  currentIndex: number = 0;
  visibleItems: number = 20;
  autoplayInterval: any;

  constructor(
    private movieService: MovieService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.fetchPopularMovies();
    
  }

  ngAfterViewInit(): void {
    this.adjustVisibleItems();
    window.addEventListener('resize', () => this.adjustVisibleItems());
     this.startAutoplay(); // Start autoplay on init
  }

  //Visible items , width and height of cards
  adjustVisibleItems(): void {
    const width = window.innerWidth;
    if (width < 640) {
      this.visibleItems = 1;
    } else if (width < 768) {
      this.visibleItems = 2;
    } else if (width < 1024) {
      this.visibleItems = 3;
    } else {
      this.visibleItems = 5;
    }
  }

  getCardWidth(): string {
  const width = window.innerWidth;
  if (width < 640) return '80%';
  if (width < 768) return '48%';
  if (width < 1024) return '31%';
  return '20%';
}
  getCardHeight(): string {
    const width = window.innerWidth;
    if (width < 640) return '400px';
    if (width < 768) return '300px';
    if (width < 1024) return '200px';
    return '450px';
}

  fetchPopularMovies(): void {
    this.loading = true;
    this.movieService.getAllMovies(1, {
      nameValue: '',
      yearValue: '',
      genreValue: 0,
      voteValue: 0,
      popularityValue: 0
    }).subscribe({
      next: (response) => {
        if (response.state === 'loaded') {
          // Get only 15 movies
          this.popularMovies = response.data.movies.slice(0, 15);
          this.loading = false;
        } else if (response.state === 'error') {
          this.toastService.error('Failed to load popular movies');
          this.loading = false;
        }
      },
      error: (err) => {
        this.toastService.error('An error occurred while fetching movies');
        this.loading = false;
      }
    });
  }

  next(): void {
    if (this.currentIndex < this.popularMovies.length - this.visibleItems) {
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
    left: this.currentIndex * (cardWidth + 20 ), 
    behavior: 'smooth'
  });
}

startAutoplay(): void {
  this.autoplayInterval = setInterval(() => {
    if (this.currentIndex < this.popularMovies.length - this.visibleItems) {
      this.next();
    } else {
      this.currentIndex = 0; 
      this.scrollCarousel();
    }
  }, 1000); 
}

stopAutoplay(): void {
  if (this.autoplayInterval) {
    clearInterval(this.autoplayInterval);
  }
}

ngOnDestroy(): void {
  this.stopAutoplay();
}



  }



