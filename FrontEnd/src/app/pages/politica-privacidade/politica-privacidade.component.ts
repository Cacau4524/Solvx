import { Component } from '@angular/core';
import { LegalLayoutComponent } from '../../shared/components/legal-layout/legal-layout.component';

@Component({
  selector: 'app-politica-privacidade',
  standalone: true,
  imports: [LegalLayoutComponent],
  template: `
    <app-legal-layout title="Política de Privacidade" subtitle="Como coletamos, usamos e protegemos seus dados.">
      <h2>1. Quais dados coletamos</h2>
      <p>Coletamos dados fornecidos por você no cadastro (nome, e-mail, telefone, CPF, endereço) e,
      no caso de prestadores, documentos necessários para o processo de verificação.</p>

      <h2>2. Como usamos seus dados</h2>
      <ul>
        <li>Para viabilizar a contratação entre clientes e prestadores;</li>
        <li>Para verificar a identidade e idoneidade dos prestadores;</li>
        <li>Para comunicação sobre o andamento de solicitações;</li>
        <li>Para cumprir obrigações legais.</li>
      </ul>

      <h2>3. Seus direitos</h2>
      <p>Você pode, a qualquer momento, solicitar acesso, correção, portabilidade ou exclusão dos
      seus dados pessoais, nos termos da Lei Geral de Proteção de Dados (LGPD).</p>

      <h2>4. Compartilhamento</h2>
      <p>Não vendemos seus dados. Compartilhamos apenas o necessário entre cliente e prestador para
      viabilizar a execução do serviço contratado.</p>

      <h2>5. Contato</h2>
      <p>Dúvidas sobre esta política: contato&#64;solvy.com.br</p>
    </app-legal-layout>
  `,
})
export class PoliticaPrivacidadeComponent {}
