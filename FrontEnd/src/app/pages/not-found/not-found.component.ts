import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div style="min-height:70vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 24px;font-family:var(--font-body);">
      <p style="font-family:var(--font-display);font-size:72px;font-weight:700;color:var(--color-blue);margin:0;">404</p>
      <h1 style="font-family:var(--font-display);font-size:22px;color:var(--color-gray-900);margin:12px 0 8px;">Página não encontrada</h1>
      <p style="color:var(--color-gray-600);font-size:14.5px;margin:0 0 24px;max-width:360px;">
        A página que você procura não existe ou foi movida.
      </p>
      <a routerLink="/" style="background:var(--color-blue);color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600;font-size:14px;">
        Voltar para o início
      </a>
    </div>
  `,
})
export class NotFoundComponent {}
