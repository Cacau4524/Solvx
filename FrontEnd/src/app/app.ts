import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ComingSoonComponent } from './shared/components/coming-soon/coming-soon.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ComingSoonComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly router = inject(Router);

  // As telas de autenticação têm seu próprio topbar (logo + Voltar) e não
  // devem exibir o header/footer completos da landing page.
  readonly isAuthRoute = signal(this.shouldHideChrome(this.router.url));

  constructor() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
      this.isAuthRoute.set(this.shouldHideChrome((e as NavigationEnd).urlAfterRedirects));
    });
  }

  private shouldHideChrome(url: string): boolean {
    return url.startsWith('/auth') || url.startsWith('/dashboard');
  }
}
