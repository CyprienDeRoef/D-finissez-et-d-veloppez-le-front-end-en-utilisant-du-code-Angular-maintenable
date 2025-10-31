import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Statistic } from '../../models/Statistic';

@Component({
  selector: 'app-page-stats-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-stats-header.component.html',
  styleUrl: './page-stats-header.component.scss',
})
export class PageStatsHeaderComponent {
  @Input() title: string = '';
  @Input() statistics: Statistic[] = [];
}
