import { Injectable, signal } from '@angular/core';

export interface ComingSoonState {
  visible: boolean;
  message: string;
  tone: 'primary' | 'accent';
}

@Injectable({ providedIn: 'root' })
export class ComingSoonService {
  private readonly _state = signal<ComingSoonState>({
    visible: false,
    message: '',
    tone: 'primary',
  });

  readonly state = this._state.asReadonly();

  show(message: string, tone: 'primary' | 'accent' = 'primary'): void {
    this._state.set({ visible: true, message, tone });
    setTimeout(() => this.hide(), 2600);
  }

  hide(): void {
    this._state.update((s) => ({ ...s, visible: false }));
  }
}
