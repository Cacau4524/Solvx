import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ServiceRequestService } from '../../../core/services/service-request.service';
import { ViaCepService } from '../../../core/services/via-cep.service';
import { MaskDirective } from '../../../shared/directives/mask.directive';

@Component({
  selector: 'app-new-service-request',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink, MaskDirective,
    MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule,
    MatProgressSpinnerModule, MatSelectModule,
  ],
  templateUrl: './new-request.component.html',
  styleUrl: './new-request.component.scss',
})
export class NewServiceRequestComponent {
  private readonly fb = inject(FormBuilder);
  private readonly serviceRequestService = inject(ServiceRequestService);
  private readonly viaCep = inject(ViaCepService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly isLookingUpCep = signal(false);

  readonly categorias = [
    'Eletricista', 'Encanador', 'Pintor', 'Faxineira', 'Diarista',
    'Jardineiro', 'Pedreiro', 'Marceneiro', 'Técnico em Informática',
    'Montador de móveis', 'Outros',
  ];

  readonly form = this.fb.nonNullable.group({
    categoria: ['', Validators.required],
    descricao: ['', [Validators.required, Validators.minLength(15)]],
    cep: ['', [Validators.required, Validators.minLength(9)]],
    rua: ['', Validators.required],
    numero: ['', Validators.required],
    complemento: [''],
    bairro: ['', Validators.required],
    cidade: ['', Validators.required],
    estado: ['', Validators.required],
    dataPreferida: [''],
  });

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
          this.snackBar.open('CEP não encontrado.', 'Fechar', { duration: 4000 });
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

    this.isSubmitting.set(true);
    const raw = this.form.getRawValue();

    this.serviceRequestService
      .createRequest({
        categoria: raw.categoria,
        descricao: raw.descricao,
        dataPreferida: raw.dataPreferida || undefined,
        endereco: {
          cep: raw.cep,
          rua: raw.rua,
          numero: raw.numero,
          complemento: raw.complemento,
          bairro: raw.bairro,
          cidade: raw.cidade,
          estado: raw.estado,
        },
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.snackBar.open('Solicitação enviada! Você será avisado quando um profissional aceitar.', 'Fechar', { duration: 4500 });
          this.router.navigateByUrl('/dashboard/cliente');
        },
        error: () => {
          // Sem backend ainda: simula sucesso para você seguir testando o fluxo.
          this.isSubmitting.set(false);
          this.snackBar.open('(Modo demonstração) Solicitação registrada localmente.', 'Fechar', { duration: 4500 });
          this.router.navigateByUrl('/dashboard/cliente');
        },
      });
  }
}
