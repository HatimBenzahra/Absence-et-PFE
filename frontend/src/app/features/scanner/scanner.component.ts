import { ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PresenceService } from '../../core/services/presence.service';
import { NotificationService } from '../../shared/services/notification.service';
import { Presence } from '../../core/models/presence.model';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
})
export class ScannerComponent implements OnDestroy {
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasEl') canvasEl!: ElementRef<HTMLCanvasElement>;

  form: FormGroup;
  isLoading = false;
  result: Presence | null = null;

  // Camera state
  cameraActive = false;
  cameraSupported = false;
  cameraError: string | null = null;
  showManualInput = false;

  private videoStream: MediaStream | null = null;
  private barcodeDetector: any = null;
  private animFrameId: number | null = null;
  private jsQrLoaded = false;

  constructor(
    private fb: FormBuilder,
    private presenceService: PresenceService,
    private notification: NotificationService,
  ) {
    this.form = this.fb.group({
      tokenQR: ['', [Validators.required, Validators.minLength(4)]],
    });
    this.cameraSupported = !!(navigator.mediaDevices?.getUserMedia);
  }

  get tokenQR() {
    return this.form.get('tokenQR');
  }

  // ─── Camera Scanning ─────────────────────────────────────────

  async startCamera(): Promise<void> {
    this.cameraError = null;
    this.result = null;
    this.cameraActive = true;
    this.cdr.markForCheck();

    // Wait for Angular to render the video element inside @if
    await new Promise<void>(r => setTimeout(r, 50));

    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      const video = this.videoEl.nativeElement;
      video.srcObject = this.videoStream;
      await video.play();

      // Choose decode strategy: native BarcodeDetector or jsQR CDN fallback
      if ('BarcodeDetector' in window) {
        this.barcodeDetector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
        this.scanLoopNative();
      } else {
        await this.loadJsQr();
        this.scanLoopJsQr();
      }
    } catch (err: any) {
      this.cameraActive = false;
      this.cameraError =
        err.name === 'NotAllowedError'
          ? "Accès caméra refusé. Autorisez l'accès dans les paramètres du navigateur."
          : "Impossible d'accéder à la caméra.";
      this.showManualInput = true;
      this.cdr.markForCheck();
    }
  }

  /** BarcodeDetector path — detects directly from <video> */
  private scanLoopNative(): void {
    const video = this.videoEl.nativeElement;
    const tick = async () => {
      if (!this.cameraActive) return;
      try {
        const barcodes = await this.barcodeDetector.detect(video);
        if (barcodes.length > 0) {
          this.onQrDetected(barcodes[0].rawValue);
          return;
        }
      } catch { /* frame not ready */ }
      this.animFrameId = requestAnimationFrame(tick);
    };
    this.animFrameId = requestAnimationFrame(tick);
  }

  /** jsQR fallback — draws video to canvas, reads ImageData */
  private scanLoopJsQr(): void {
    const video = this.videoEl.nativeElement;
    const canvas = this.canvasEl.nativeElement;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

    const tick = () => {
      if (!this.cameraActive) return;
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = (window as any).jsQR(imageData.data, imageData.width, imageData.height);
        if (code?.data) {
          this.onQrDetected(code.data);
          return;
        }
      }
      this.animFrameId = requestAnimationFrame(tick);
    };
    this.animFrameId = requestAnimationFrame(tick);
  }

  /** Lazy-load jsQR from CDN (only for Firefox/Safari) */
  private loadJsQr(): Promise<void> {
    if (this.jsQrLoaded || (window as any).jsQR) {
      this.jsQrLoaded = true;
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
      script.onload = () => { this.jsQrLoaded = true; resolve(); };
      script.onerror = () => {
        this.cameraError = 'Impossible de charger le décodeur QR.';
        this.showManualInput = true;
        this.stopCamera();
        this.cdr.markForCheck();
        reject(new Error('jsQR load failed'));
      };
      document.head.appendChild(script);
    });
  }

  private onQrDetected(value: string): void {
    this.stopCamera();
    this.form.patchValue({ tokenQR: value });
    this.notification.success('QR code détecté !');
    this.cdr.markForCheck();
    this.submit();
  }

  stopCamera(): void {
    this.cameraActive = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(t => t.stop());
      this.videoStream = null;
    }
    this.cdr.markForCheck();
  }

  // ─── Manual Submit ──────────────────────────────────────────

  submit(): void {
    if (this.form.invalid || this.isLoading) return;
    this.isLoading = true;
    this.result = null;
    const tokenQR = this.tokenQR?.value?.trim();

    this.presenceService.pointer({ tokenQR }).subscribe({
      next: (presence: Presence) => {
        this.isLoading = false;
        this.result = presence;
        this.notification.success('Présence enregistrée !');
        this.form.reset();
        this.cdr.markForCheck();
      },
      error: (err: { error?: { message?: string } }) => {
        this.isLoading = false;
        this.notification.error(err.error?.message || 'Erreur lors du pointage');
        this.cdr.markForCheck();
      },
    });
  }

  scanAgain(): void {
    this.result = null;
    this.showManualInput = false;
    this.cameraError = null;
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  formatDate(isoString: string): string {
    return new Date(isoString).toLocaleString('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  statutLabel(statut: string): string {
    const labels: Record<string, string> = {
      PRESENT: 'Présent',
      ABSENT: 'Absent',
      RETARD: 'En retard',
      EXCUSE: 'Excusé',
    };
    return labels[statut] ?? statut;
  }
}
