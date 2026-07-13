import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ObserveVisibilityDirective } from '../../shared/animations/observe-visibility.directive';
import { fadeInUp } from '../../shared/animations/reveal.animations';

interface Testimonial {
  name: string;
  city: string;
  comment: string;
  initials: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, ObserveVisibilityDirective],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss',
  animations: [fadeInUp],
})
export class TestimonialsComponent {
  private readonly destroyRef = inject(DestroyRef);

  readonly visible = signal(false);
  readonly activeIndex = signal(0);

  readonly testimonials: Testimonial[] = [
    { name: 'Marina Alves', city: 'Salvador, BA', initials: 'MA', comment: 'Encontrei um eletricista em menos de uma hora. Processo rápido e profissional muito qualificado.' },
    { name: 'Rafael Souza', city: 'Camaçari, BA', initials: 'RS', comment: 'A avaliação dos profissionais me deu muita segurança para contratar. Recomendo demais.' },
    { name: 'Juliana Prado', city: 'Lauro de Freitas, BA', initials: 'JP', comment: 'Reforma completa da cozinha, do orçamento à entrega. Tudo pela plataforma, sem dor de cabeça.' },
  ];

  onVisible(): void {
    this.visible.set(true);
    const interval = setInterval(() => {
      this.activeIndex.update((i) => (i + 1) % this.testimonials.length);
    }, 4500);
    this.destroyRef.onDestroy(() => clearInterval(interval));
  }

  goTo(index: number): void {
    this.activeIndex.set(index);
  }
}
