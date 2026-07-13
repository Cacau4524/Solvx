import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProviderUser } from '../../core/models/auth.models';

@Component({
  selector: 'app-reprovado',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './reprovado.component.html',
  styleUrl: './status-screens.scss',
})
export class ReprovadoComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly motivo =
    (this.authService.currentUser() as ProviderUser | null)?.motivoReprovacao ??
    'Não foi possível validar sua documentação com as informações enviadas.';

  reenviarDocumentacao(): void {
    this.router.navigateByUrl('/auth/provider/register');
  }
}
