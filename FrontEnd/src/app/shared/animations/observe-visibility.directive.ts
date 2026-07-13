import { Directive, ElementRef, OnDestroy, OnInit, output } from '@angular/core';

/**
 * Emite `visible` uma única vez quando o elemento hospedeiro entra na viewport.
 * Usado pelas seções da landing page para disparar as animações de entrada
 * (fadeInUp / zoomIn / staggerList) conforme o usuário rola a página.
 */
@Directive({
  selector: '[appObserveVisibility]',
  standalone: true,
})
export class ObserveVisibilityDirective implements OnInit, OnDestroy {
  readonly visible = output<boolean>();

  private observer?: IntersectionObserver;

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.visible.emit(true);
            this.observer?.unobserve(this.host.nativeElement);
          }
        }
      },
      { threshold: 0.15 }
    );
    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
