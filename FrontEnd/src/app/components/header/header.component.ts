import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

interface NavItem {
  label: string;
  href: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(private readonly router: Router) {}

  readonly isScrolled = signal(false);
  readonly isMenuOpen = signal(false);

  readonly navItems: NavItem[] = [
    { label: 'Início', href: '/#home' },
    { label: 'Serviços', href: '/#servicos' },
    { label: 'Como funciona', href: '/#como-funciona' },
    { label: 'Profissionais', href: '/#profissionais' },
    { label: 'Avaliações', href: '/#avaliacoes' },
    { label: 'Sobre nós', href: '/#sobre' },
  ];

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled.set(window.scrollY > 12);
  }

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  login(): void {
    this.router.navigateByUrl('/auth');
  }

  signup(): void {
    this.router.navigateByUrl('/auth');
  }
}
