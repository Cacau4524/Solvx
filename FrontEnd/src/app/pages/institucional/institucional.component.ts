import { Component } from '@angular/core';
import { LegalLayoutComponent } from '../../shared/components/legal-layout/legal-layout.component';

@Component({
  selector: 'app-institucional',
  standalone: true,
  imports: [LegalLayoutComponent],
  template: `
    <app-legal-layout title="Institucional" subtitle="Conheça a Solvy e o que nos move.">
      <h2>Quem somos</h2>
      <p>A Solvy é uma plataforma que conecta clientes a profissionais qualificados e verificados
      para serviços residenciais e comerciais, de forma rápida, moderna e segura.</p>

      <h2>Nossa missão</h2>
      <p>Tornar a contratação de serviços domésticos tão simples e confiável quanto pedir uma
      corrida ou uma entrega — eliminando a insegurança de indicações informais.</p>

      <h2>Segurança em primeiro lugar</h2>
      <p>Todo prestador passa por um processo de verificação documental antes de ser aprovado na
      plataforma. Isso inclui validação de CPF, análise documental e verificação de antecedentes,
      conforme permitido pela legislação aplicável.</p>

      <h2>Fale com a gente</h2>
      <p>Dúvidas, sugestões ou parcerias: contato&#64;solvy.com.br</p>
    </app-legal-layout>
  `,
})
export class InstitucionalComponent {}
