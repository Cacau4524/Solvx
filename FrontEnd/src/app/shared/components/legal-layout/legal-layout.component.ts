import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-legal-layout',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './legal-layout.component.html',
  styleUrl: './legal-layout.component.scss',
})
export class LegalLayoutComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle = '';

  constructor(private readonly location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
