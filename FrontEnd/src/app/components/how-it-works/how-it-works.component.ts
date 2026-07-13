import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ObserveVisibilityDirective } from '../../shared/animations/observe-visibility.directive';
import { fadeInUp, staggerList } from '../../shared/animations/reveal.animations';

interface Step {
  number: string;
  title: string;
  icon: string;
}

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, ObserveVisibilityDirective],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.scss',
  animations: [fadeInUp, staggerList],
})
export class HowItWorksComponent {
  readonly visible = signal(false);

  readonly steps: Step[] = [
    { number: '01', title: 'Escolha um serviço', icon: 'search' },
    { number: '02', title: 'Receba orçamentos', icon: 'file' },
    { number: '03', title: 'Contrate o profissional', icon: 'handshake' },
    { number: '04', title: 'Avalie o serviço', icon: 'star' },
  ];

  onVisible(): void {
    this.visible.set(true);
  }
}
