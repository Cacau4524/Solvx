import {
  animate,
  animateChild,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';

/** Fade + leve deslocamento vertical, usado em títulos e blocos de texto. */
export const fadeInUp = trigger('fadeInUp', [
  transition(':enter, void => in', [
    style({ opacity: 0, transform: 'translateY(28px)' }),
    animate('600ms cubic-bezier(0.22, 1, 0.36, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
]);

/** Zoom sutil, usado em imagens e cards de destaque. */
export const zoomIn = trigger('zoomIn', [
  transition(':enter, void => in', [
    style({ opacity: 0, transform: 'scale(0.92)' }),
    animate('550ms cubic-bezier(0.22, 1, 0.36, 1)', style({ opacity: 1, transform: 'scale(1)' })),
  ]),
]);

/** Efeito "stagger": itens de uma lista aparecem em cascata. */
export const staggerList = trigger('staggerList', [
  transition(':enter, void => in', [
    query(
      '@fadeInUp, @zoomIn',
      [stagger(90, animateChild())],
      { optional: true }
    ),
  ]),
]);
