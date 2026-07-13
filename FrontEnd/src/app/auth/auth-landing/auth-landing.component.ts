import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-auth-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './auth-landing.component.html',
  styleUrl: './auth-landing.component.scss',
  animations: [
    trigger('cardsIn', [
      transition(':enter', [
        query('.auth-card', [
          style({ opacity: 0, transform: 'translateY(24px)' }),
          stagger(120, animate('520ms cubic-bezier(0.22,1,0.36,1)', style({ opacity: 1, transform: 'translateY(0)' }))),
        ]),
      ]),
    ]),
  ],
})
export class AuthLandingComponent {
  constructor(private readonly router: Router) {}

  goBack(): void {
    this.router.navigateByUrl('/');
  }
}
