import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly year = new Date().getFullYear();

  readonly quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Como funciona', href: '#como-funciona' },
    { label: 'Sobre nós', href: '#sobre' },
  ];

  readonly socials: SocialLink[] = [
    { name: 'Instagram', href: '#', icon: 'instagram' },
    { name: 'Facebook', href: '#', icon: 'facebook' },
    { name: 'GitHub', href: '#', icon: 'github' },
  ];
}
