import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInUp, zoomIn } from '../../shared/animations/reveal.animations';
import { ComingSoonService } from '../../shared/services/coming-soon.service';

interface Benefit {
  label: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  animations: [fadeInUp, zoomIn],
})
export class HeroComponent {
  private readonly comingSoon = inject(ComingSoonService);
  private readonly router = inject(Router);

  readonly serviceQuery = signal('');
  readonly locationQuery = signal('');

  readonly benefits: Benefit[] = [
    { label: 'Profissionais verificados' },
    { label: 'Avaliações reais' },
    { label: 'Pagamento seguro' },
    { label: 'Suporte rápido' },
  ];

  search(): void {
    // Busca de profissionais ainda não implementada — ponto de extensão futuro.
    this.comingSoon.show('Em breve você poderá buscar profissionais diretamente pela plataforma.', 'primary');
  }

  requestService(): void {
    this.router.navigateByUrl('/auth/client/login');
  }

  becomeProfessional(): void {
    this.router.navigateByUrl('/auth/provider/register');
  }
}
