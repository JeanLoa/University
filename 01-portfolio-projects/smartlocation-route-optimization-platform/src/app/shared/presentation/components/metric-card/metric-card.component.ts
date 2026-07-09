import { Component, Input } from '@angular/core';

export type MetricCardTone = 'cyan' | 'violet' | 'amber' | 'green';

@Component({
  selector: 'app-metric-card',
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.css',
})
export class MetricCardComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() supporting = '';
  @Input() tone: MetricCardTone = 'cyan';
}

