import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

type MaskType = 'cpf' | 'cep' | 'telefone';

const MASKERS: Record<MaskType, (digits: string) => string> = {
  cpf: (d) =>
    d
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2'),
  cep: (d) => d.slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2'),
  telefone: (d) =>
    d.length > 10
      ? d.slice(0, 11).replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
      : d.slice(0, 10).replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3'),
};

/** Uso: <input appMask="cpf" formControlName="cpf" /> */
@Directive({
  selector: '[appMask]',
  standalone: true,
})
export class MaskDirective {
  @Input('appMask') maskType!: MaskType;

  private readonly el = inject(ElementRef<HTMLInputElement>);
  private readonly control = inject(NgControl, { optional: true });

  @HostListener('input')
  onInput(): void {
    const digits = (this.el.nativeElement.value || '').replace(/\D/g, '');
    const masked = MASKERS[this.maskType](digits);
    this.el.nativeElement.value = masked;
    this.control?.control?.setValue(masked, { emitEvent: true });
  }
}
