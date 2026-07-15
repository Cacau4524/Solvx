import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { ProviderUser } from '../../core/models/auth.models';

@Component({
  selector: 'app-provider-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './provider-login.component.html',
  styleUrl: './provider-login.component.scss',
})
export class ProviderLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);
  readonly hidePassword = signal(true);
  readonly loginError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    manterConectado: [false],
  });

  get email() { return this.form.controls.email; }
  get senha() { return this.form.controls.senha; }

  socialLoginPlaceholder(provider: string): void {
    this.snackBar.open(`Login com ${provider} em breve.`, 'Fechar', { duration: 3500 });
  }

  onSubmit(): void {
    this.loginError.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    const { email, senha } = this.form.getRawValue();

    this.authService.loginProvider({ email, senha }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        const user = res.user as ProviderUser;

        // Roteamento condicional pelo status da conta do prestador.
        if (user.status === 'EM_ANALISE') {
          this.router.navigateByUrl('/auth/provider/em-analise');
        } else if (user.status === 'REPROVADO') {
          this.router.navigateByUrl('/auth/provider/reprovado');
        } else {
          this.router.navigateByUrl('/dashboard/prestador');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.loginError.set('E-mail ou senha incorretos.');
      },
    });
  }
}
