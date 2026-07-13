import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ObserveVisibilityDirective } from '../../shared/animations/observe-visibility.directive';
import { fadeInUp, staggerList } from '../../shared/animations/reveal.animations';

interface ServiceItem {
  icon: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, ObserveVisibilityDirective],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  animations: [fadeInUp, staggerList],
})
export class ServicesComponent {
  readonly visible = signal(false);

  readonly services: ServiceItem[] = [
    { icon: 'bolt', name: 'Elétrica', description: 'Instalações, reparos e manutenção elétrica residencial.' },
    { icon: 'drop', name: 'Hidráulica', description: 'Encanamentos, vazamentos e desentupimentos.' },
    { icon: 'brush', name: 'Pintura', description: 'Pintura interna, externa e acabamentos.' },
    { icon: 'sparkle', name: 'Limpeza', description: 'Limpeza residencial e comercial completa.' },
    { icon: 'hammer', name: 'Marcenaria', description: 'Móveis planejados e reparos em madeira.' },
    { icon: 'leaf', name: 'Jardinagem', description: 'Cuidado de jardins e paisagismo.' },
    { icon: 'house', name: 'Reformas', description: 'Reformas residenciais e comerciais completas.' },
    { icon: 'snow', name: 'Ar Condicionado', description: 'Instalação, limpeza e manutenção de A/C.' },
  ];

  onVisible(): void {
    this.visible.set(true);
  }
}
