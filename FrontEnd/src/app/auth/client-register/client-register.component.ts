import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ViaCepService } from '../../core/services/via-cep.service';
import { MaskDirective } from '../../shared/directives/mask.directive';

/** Validador de grupo: confere se senha e confirmarSenha são iguais. */
const passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const senha = group.get('senha')?.value;
  const confirmarSenha = group.get('confirmarSenha')?.value;
  return senha && confirmarSenha && senha !== confirmarSenha ? { passwordsMismatch: true } : null;
};

@Component({
  selector: 'app-client-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MaskDirective,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './client-register.component.html',
  styleUrl: './client-register.component.scss',
})
export class ClientRegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly viaCep = inject(ViaCepService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);
  readonly isLookingUpCep = signal(false);
  readonly hidePassword = signal(true);
  readonly hideConfirmPassword = signal(true);

  readonly generos = [
    { value: 'masculino', label: 'Masculino' },
    { value: 'feminino', label: 'Feminino' },
    { value: 'nao_informar', label: 'Prefiro não informar' },
    { value: 'outro', label: 'Outro' },
  ];

  readonly form = this.fb.nonNullable.group(
    {
      nomeCompleto: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required, Validators.minLength(14)]],
      cpf: ['', [Validators.required, Validators.minLength(14)]],
      cep: ['', [Validators.required, Validators.minLength(9)]],
      rua: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      dataNascimento: [null as Date | null, Validators.required],
      genero: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required],
      aceiteTermos: [false, Validators.requiredTrue],
    },
    { validators: passwordsMatchValidator }
  );

  constructor() {
    this.form.controls.cep.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((cep) => this.lookupCep(cep));
  }

  private lookupCep(cep: string): void {
    const digits = cep.replace(/\D/g, '');
    if (digits.length !== 8) return;

    this.isLookingUpCep.set(true);
    this.viaCep.lookup(cep).subscribe({
      next: (result) => {
        this.isLookingUpCep.set(false);
        if (!result) {
          this.snackBar.open('CEP não encontrado. Verifique e tente novamente.', 'Fechar', { duration: 4000 });
          return;
        }
        this.form.patchValue({
          rua: result.logradouro,
          bairro: result.bairro,
          cidade: result.localidade,
          estado: result.uf,
        });
      },
      error: () => {
        this.isLookingUpCep.set(false);
        this.snackBar.open('Não foi possível consultar o CEP agora.', 'Fechar', { duration: 4000 });
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const raw = this.form.getRawValue();

    this.authService
      .registerClient({
        nomeCompleto: raw.nomeCompleto,
        email: raw.email,
        telefone: raw.telefone,
        cpf: raw.cpf,
        cep: raw.cep,
        rua: raw.rua,
        numero: raw.numero,
        complemento: raw.complemento,
        bairro: raw.bairro,
        cidade: raw.cidade,
        estado: raw.estado,
        dataNascimento: raw.dataNascimento ? raw.dataNascimento.toISOString() : '',
        genero: raw.genero as any,
        senha: raw.senha,
      })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.snackBar.open('Conta criada com sucesso!', 'Fechar', { duration: 3500 });
          this.router.navigateByUrl('/dashboard/cliente');
        },
        error: () => {
          this.isLoading.set(false);
          this.snackBar.open('Não foi possível concluir o cadastro. Tente novamente.', 'Fechar', { duration: 4500 });
        },
      });
  }
}
