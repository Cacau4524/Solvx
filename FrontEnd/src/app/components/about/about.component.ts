import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ObserveVisibilityDirective } from '../../shared/animations/observe-visibility.directive';
import { fadeInUp, zoomIn } from '../../shared/animations/reveal.animations';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, ObserveVisibilityDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  animations: [fadeInUp, zoomIn],
})
export class AboutComponent {
  readonly visible = signal(false);

  onVisible(): void {
    this.visible.set(true);
  }
}
