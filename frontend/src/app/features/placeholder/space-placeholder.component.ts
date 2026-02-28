import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-space-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="placeholder-card">
      <p class="eyebrow">Espace en preparation</p>
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
    </section>
  `,
  styles: [`
    .placeholder-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 18px;
      padding: 26px;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
    }

    .eyebrow {
      color: #0097c4;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }

    h2 {
      color: #1e293b;
      font-size: 26px;
      margin-bottom: 10px;
    }

    p {
      color: #64748b;
      max-width: 700px;
      line-height: 1.6;
    }
  `],
})
export class SpacePlaceholderComponent {
  title: string;
  description: string;

  constructor(private route: ActivatedRoute) {
    this.title = this.route.snapshot.data['title'] ?? 'Module';
    this.description = this.route.snapshot.data['description'] ?? 'Page en cours d implementation.';
  }
}
