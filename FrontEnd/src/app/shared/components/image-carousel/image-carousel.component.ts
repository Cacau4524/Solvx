import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, OnInit, inject, signal } from '@angular/core';

export interface CarouselSlide {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-image-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-carousel.component.html',
  styleUrl: './image-carousel.component.scss',
})
export class ImageCarouselComponent implements OnInit {
  @Input({ required: true }) slides: CarouselSlide[] = [];
  @Input() intervalMs = 4000;

  private readonly destroyRef = inject(DestroyRef);
  private timer?: ReturnType<typeof setInterval>;

  readonly activeIndex = signal(0);
  readonly isPaused = signal(false);

  ngOnInit(): void {
    this.startAutoplay();
    this.destroyRef.onDestroy(() => this.stopAutoplay());
  }

  private startAutoplay(): void {
    this.timer = setInterval(() => {
      if (!this.isPaused()) this.next();
    }, this.intervalMs);
  }

  private stopAutoplay(): void {
    if (this.timer) clearInterval(this.timer);
  }

  next(): void {
    this.activeIndex.update((i) => (i + 1) % this.slides.length);
  }

  prev(): void {
    this.activeIndex.update((i) => (i - 1 + this.slides.length) % this.slides.length);
  }

  goTo(index: number): void {
    this.activeIndex.set(index);
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).classList.add('image-carousel__img--missing');
  }
}
