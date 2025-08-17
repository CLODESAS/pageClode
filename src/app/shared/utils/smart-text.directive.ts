import { Directive, ElementRef, Inject, Input, OnDestroy, AfterViewInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type Region = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

@Directive({
  selector: '[appSmartTextOnImage]',
  standalone: true
})
export class SmartTextOnImageDirective implements AfterViewInit, OnDestroy {
  // Accepts an explicit HTMLImageElement, but also tolerates presence-only attribute (string/undefined)
  @Input('appSmartTextOnImage') targetImage?: HTMLImageElement | string | null;
  @Input() sampleRegion: Region = 'bottom-left';
  @Input() sampleFraction = 0.3; // 30% of width/height area
  @Input() threshold = 200; // luminance threshold 0..255

  private removeLoadListener?: () => void;

  constructor(
    private readonly host: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const img = this.resolveImage();
    if (!img) return;

    // If image already loaded, compute immediately
    if (img.complete) {
      this.applyDecision(img);
    }
    // Also listen for load events
    this.removeLoadListener = this.renderer.listen(img, 'load', () => this.applyDecision(img));
  }

  ngOnDestroy(): void {
    if (this.removeLoadListener) this.removeLoadListener();
  }

  private resolveImage(): HTMLImageElement | null {
  if (this.targetImage instanceof HTMLImageElement) return this.targetImage;
    // Try to find nearest image within the same tile/container
  const hostEl = this.host.nativeElement;
  const tile = hostEl.closest('.tile') || hostEl.closest('.slide') || hostEl.parentElement;
  const candidate = tile ? tile.querySelector('img') : null;
  return candidate instanceof HTMLImageElement ? candidate : null;
  }

  private applyDecision(img: HTMLImageElement) {
    try {
      const isLight = this.checkRegionLuminance(img);
      if (isLight) {
        this.renderer.addClass(this.host.nativeElement, 'dark-text');
      } else {
        this.renderer.removeClass(this.host.nativeElement, 'dark-text');
      }
    } catch {
      // Ignore (e.g., canvas tainted); default styles remain
    }
  }

  private checkRegionLuminance(img: HTMLImageElement): boolean {
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    if (!w || !h) return false;

    const frac = Math.max(0.05, Math.min(0.9, this.sampleFraction));
    const sw = Math.max(1, Math.floor(w * frac));
    const sh = Math.max(1, Math.floor(h * frac));

    let sx: number; let sy: number;
    switch (this.sampleRegion) {
      case 'bottom-left':
        sx = 0; sy = Math.max(0, h - sh); break;
      case 'bottom-right':
        sx = Math.max(0, w - sw); sy = Math.max(0, h - sh); break;
      case 'top-left':
        sx = 0; sy = 0; break;
      case 'top-right':
        sx = Math.max(0, w - sw); sy = 0; break;
      default:
        sx = 0; sy = Math.max(0, h - sh); break;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1; canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, 1, 1);
    const data = ctx.getImageData(0, 0, 1, 1).data;
    const [r, g, b] = [data[0], data[1], data[2]];
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance > this.threshold;
  }
}
