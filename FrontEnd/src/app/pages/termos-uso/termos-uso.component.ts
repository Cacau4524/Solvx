import { Component } from '@angular/core';
import { LegalLayoutComponent } from '../../shared/components/legal-layout/legal-layout.component';

@Component({
  selector: 'app-termos-uso',
  standalone: true,
  imports: [LegalLayoutComponent],
  template: `
    <app-legal-layout title="Termos de Uso" subtitle="Regras de uso da plataforma Solvy.">
      <h2>1. Aceitação dos termos</h2>
      <p>Ao criar uma conta na Solvy, você concorda com estes Termos de Uso e com a nossa Política
      de Privacidade.</p>

      <h2>2. Cadastro</h2>
      <p>Clientes e prestadores devem fornecer informações verdadeiras e atualizadas. Prestadores
      passam por um processo de verificação antes de poderem oferecer serviços na plataforma.</p>

      <h2>3. Responsabilidades</h2>
      <ul>
        <li>O cliente é responsável por descrever corretamente o serviço solicitado;</li>
        <li>O prestador é responsável pela qualidade e prazo do serviço executado;</li>
        <li>A Solvy atua como intermediadora, verificando e conectando as partes.</li>
      </ul>

      <h2>4. Cancelamentos</h2>
      <p>Solicitações podem ser canceladas antes da aceitação por um prestador. Após aceitas, o
      cancelamento segue as regras informadas no momento da contratação.</p>

      <h2>5. Alterações</h2>
      <p>Estes termos podem ser atualizados periodicamente. Mudanças relevantes serão comunicadas
      aos usuários.</p>
    </app-legal-layout>
  `,
})
export class TermosUsoComponent {}
