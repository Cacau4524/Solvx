import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { ComingSoonService } from '../../services/coming-soon.service';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coming-soon.component.html',
  styleUrl: './coming-soon.component.scss',
  animations: [
    trigger('overlayFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('260ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('220ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
    trigger('panelPop', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.85) translateY(16px)' }),
        animate(
          '380ms 80ms cubic-bezier(0.22, 1, 0.36, 1)',
          style({ opacity: 1, transform: 'scale(1) translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class ComingSoonComponent {
  protected readonly comingSoon = inject(ComingSoonService);
}
