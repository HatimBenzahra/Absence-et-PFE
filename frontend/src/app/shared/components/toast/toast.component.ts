import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastData {
  message: string;
  type: ToastType;
}

const TOAST_CONFIG: Record<ToastType, { icon: string; label: string }> = {
  success: { icon: 'check_circle', label: 'Succès' },
  error: { icon: 'error', label: 'Erreur' },
  info: { icon: 'info', label: 'Information' },
  warning: { icon: 'warning', label: 'Attention' },
};

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="toast" [class]="'toast toast--' + data.type">
      <div class="toast__icon-wrapper">
        <mat-icon class="toast__icon">{{ config.icon }}</mat-icon>
      </div>
      <div class="toast__body">
        <span class="toast__label">{{ config.label }}</span>
        <span class="toast__message">{{ data.message }}</span>
      </div>
      <button class="toast__close" (click)="dismiss()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 18px;
      border-radius: 14px;
      min-width: 340px;
      max-width: 480px;
      backdrop-filter: blur(12px);
      animation: toastSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        border-radius: 14px 0 0 14px;
      }
    }

    .toast--success {
      background: linear-gradient(135deg, #ecfdf5, #d1fae5);
      border: 1px solid #a7f3d0;
      color: #065f46;

      &::before { background: #10b981; }
      .toast__icon-wrapper { background: rgba(16, 185, 129, 0.15); }
      .toast__icon { color: #10b981; }
      .toast__label { color: #065f46; }
      .toast__message { color: #047857; }
    }

    .toast--error {
      background: linear-gradient(135deg, #fef2f2, #fee2e2);
      border: 1px solid #fecaca;
      color: #991b1b;

      &::before { background: #ef4444; }
      .toast__icon-wrapper { background: rgba(239, 68, 68, 0.15); }
      .toast__icon { color: #ef4444; }
      .toast__label { color: #991b1b; }
      .toast__message { color: #b91c1c; }
    }

    .toast--info {
      background: linear-gradient(135deg, #eff6ff, #dbeafe);
      border: 1px solid #bfdbfe;
      color: #1e40af;

      &::before { background: #0097c4; }
      .toast__icon-wrapper { background: rgba(0, 151, 196, 0.15); }
      .toast__icon { color: #0097c4; }
      .toast__label { color: #1e40af; }
      .toast__message { color: #1d4ed8; }
    }

    .toast--warning {
      background: linear-gradient(135deg, #fffbeb, #fef3c7);
      border: 1px solid #fde68a;
      color: #92400e;

      &::before { background: #f59e0b; }
      .toast__icon-wrapper { background: rgba(245, 158, 11, 0.15); }
      .toast__icon { color: #f59e0b; }
      .toast__label { color: #92400e; }
      .toast__message { color: #b45309; }
    }

    .toast__icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      flex-shrink: 0;
    }

    .toast__icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    .toast__body {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
      min-width: 0;
    }

    .toast__label {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .toast__message {
      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;
    }

    .toast__close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: rgba(0, 0, 0, 0.06);
      border-radius: 8px;
      cursor: pointer;
      flex-shrink: 0;
      transition: background 0.2s ease;

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: inherit;
        opacity: 0.6;
      }

      &:hover {
        background: rgba(0, 0, 0, 0.12);

        mat-icon { opacity: 1; }
      }
    }

    @keyframes toastSlideIn {
      from {
        opacity: 0;
        transform: translateY(-12px) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `],
})
export class ToastComponent {
  config: { icon: string; label: string };

  constructor(
    public snackBarRef: MatSnackBarRef<ToastComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: ToastData
  ) {
    this.config = TOAST_CONFIG[data.type];
  }

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}
