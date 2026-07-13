import { Component } from '@angular/core';
import { HeroComponent } from '../components/hero/hero.component';
import { ServicesComponent } from '../components/services/services.component';
import { HowItWorksComponent } from '../components/how-it-works/how-it-works.component';
import { TestimonialsComponent } from '../components/testimonials/testimonials.component';
import { AboutComponent } from '../components/about/about.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, ServicesComponent, HowItWorksComponent, TestimonialsComponent, AboutComponent],
  template: `
    <app-hero />
    <app-services />
    <app-how-it-works />
    <app-testimonials />
    <app-about />
  `,
})
export class HomeComponent {}
