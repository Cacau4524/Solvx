import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepperModule } from '@angular/material/stepper';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ViaCepService } from '../../core/services/via-cep.service';
import { MaskDirective } from '../../shared/directives/mask.directive';

@Component({
  selector: 'app-provider-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MaskDirective,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatStepperModule,
  ],
  providers: [{ provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } }],
  templateUrl: './provider-register.component.html',
  styleUrl: './provider-register.component.scss',
})
export class ProviderRegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly viaCep = inject(ViaCepService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly isLookingUpCep = signal(false);
  readonly hidePassword = signal(true);

  readonly generos = [
    { value: 'masculino', label: 'Masculino' },
    { value: 'feminino', label: 'Feminino' },
    { value: 'nao_informar', label: 'Prefiro não informar' },
    { value: 'outro', label: 'Outro' },
  ];

  readonly categorias = [
    'Eletricista', 'Encanador', 'Pintor', 'Faxineira', 'Diarista',
    'Jardineiro', 'Pedreiro', 'Marceneiro', 'Técnico em Informática',
    'Montador de móveis', 'Outros',
  ];

  // ---------- Etapa 1: dados pessoais ----------
  readonly personalForm = this.fb.nonNullable.group({
    nomeCompleto: ['', [Validators.required, Validators.minLength(3)]],
    cpf: ['', [Validators.required, Validators.minLength(14)]],
    rg: [''],
    dataNascimento: [null as Date | null, Validators.required],
    genero: ['', Validators.required],
    telefone: ['', [Validators.required, Validators.minLength(14)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    confirmarSenha: ['', Validators.required],
  });

  // ---------- Etapa 2: endereço ----------
  readonly addressForm = this.fb.nonNullable.group({
    cep: ['', [Validators.required, Validators.minLength(9)]],
    rua: ['', Validators.required],
    numero: ['', Validators.required],
    complemento: [''],
    bairro: ['', Validators.required],
    cidade: ['', Validators.required],
    estado: ['', Validators.required],
  });

  // ---------- Etapa 3: informações profissionais ----------
  readonly professionalForm = this.fb.nonNullable.group({
    categoriaPrincipal: ['', Validators.required],
    especialidades: ['', Validators.required],
    descricao: ['', [Validators.required, Validators.minLength(20)]],
    experiencia: ['', Validators.required],
    precoMedio: [null as number | null, [Validators.required, Validators.min(1)]],
    cidadeAtuacao: ['', Validators.required],
    raioAtendimento: [null as number | null, [Validators.required, Validators.min(1)]],
  });

  readonly fotoPerfil = signal<File | null>(null);
  readonly fotoDocumento = signal<File | null>(null);
  readonly curriculo = signal<File | null>(null);

  constructor() {
    this.addressForm.controls.cep.valueChanges
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
          this.snackBar.open('CEP não encontrado.', 'Fechar', { duration: 4000 });
          return;
        }
        this.addressForm.patchValue({
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

  onFileSelected(event: Event, target: 'fotoPerfil' | 'fotoDocumento' | 'curriculo'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (target === 'fotoPerfil') this.fotoPerfil.set(file);
    if (target === 'fotoDocumento') this.fotoDocumento.set(file);
    if (target === 'curriculo') this.curriculo.set(file);
  }

  submit(): void {
    if (this.personalForm.invalid || this.addressForm.invalid || this.professionalForm.invalid) {
      this.personalForm.markAllAsTouched();
      this.addressForm.markAllAsTouched();
      this.professionalForm.markAllAsTouched();
      this.snackBar.open('Revise os campos obrigatórios antes de continuar.', 'Fechar', { duration: 4000 });
      return;
    }

    this.isSubmitting.set(true);
    const personal = this.personalForm.getRawValue();
    const address = this.addressForm.getRawValue();
    const professional = this.professionalForm.getRawValue();

    // Observação: em um backend real, este payload normalmente vai como
    // multipart/form-data por causa dos arquivos. Ponto de extensão:
    // trocar por um FormData quando a API estiver definida.
    this.authService
      .registerProvider({
        dadosPessoais: {
          nomeCompleto: personal.nomeCompleto,
          cpf: personal.cpf,
          rg: personal.rg,
          dataNascimento: personal.dataNascimento ? personal.dataNascimento.toISOString() : '',
          genero: personal.genero as any,
          telefone: personal.telefone,
          email: personal.email,
          senha: personal.senha,
        },
        endereco: address,
        informacoesProfissionais: professional,
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.router.navigateByUrl('/auth/provider/cadastro-enviado');
        },
        error: () => {
          this.isSubmitting.set(false);
          this.snackBar.open('Não foi possível enviar sua documentação. Tente novamente.', 'Fechar', { duration: 4500 });
        },
      });
  }
}
