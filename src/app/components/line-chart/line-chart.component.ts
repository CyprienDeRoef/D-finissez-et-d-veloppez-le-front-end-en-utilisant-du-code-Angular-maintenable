import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import Chart from 'chart.js/auto';
import { CHART_COLORS } from '../../constants/chart-colors';
import { ChartService } from '../../services/chart.service';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent implements OnDestroy, AfterViewInit {
  @Input() years: number[] = [];
  @Input() medalsData: string[] = [];
  @Input() chartId: string = 'lineChart';

  private chart: Chart<'line'> | null = null;

  constructor(private chartService: ChartService) {}

  ngAfterViewInit(): void {
    // Create chart after view is initialized
    setTimeout(() => this.buildChart(), 0);
  }

  ngOnDestroy(): void {
    this.chartService.destroyChart(this.chart);
  }

  private buildChart(): void {
    this.chart = this.chartService.createChart({
      canvasId: this.chartId,
      type: 'line',
      labels: this.years,
      datasets: [
        {
          label: 'medals',
          data: this.medalsData.map((medal) => Number(medal)),
          backgroundColor: CHART_COLORS.primary,
        },
      ],
      options: {
        aspectRatio: 2.5,
      },
    });
  }
}
