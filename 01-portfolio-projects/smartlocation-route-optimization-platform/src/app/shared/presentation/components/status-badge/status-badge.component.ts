import { Component, Input } from '@angular/core';

export type StatusBadgeTone = 'neutral' | 'ready' | 'alert' | 'accent';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.css',
})
export class StatusBadgeComponent {
  @Input() label = '';
  @Input() tone: StatusBadgeTone = 'neutral';
}

