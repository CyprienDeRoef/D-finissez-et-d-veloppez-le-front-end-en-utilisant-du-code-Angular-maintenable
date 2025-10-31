import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import Chart from 'chart.js/auto';
import { CHART_PALETTE } from '../../constants/chart-colors';
import { ChartService } from '../../services/chart.service';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss',
})
export class PieChartComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() countries: string[] = [];
  @Input() medalsData: number[] = [];
  @Input() chartId: string = 'pieChart';
  @Output() sliceClick = new EventEmitter<string>();

  private chart: Chart<'pie'> | null = null;

  constructor(private chartService: ChartService) {}

  ngOnInit(): void {
    // Removed chart creation from here
  }

  ngAfterViewInit(): void {
    // Create chart after view is initialized
    setTimeout(() => this.buildPieChart(), 0);
  }

  ngOnDestroy(): void {
    this.chartService.destroyChart(this.chart);
  }

  private buildPieChart(): void {
    this.chart = this.chartService.createChart({
      canvasId: this.chartId,
      type: 'pie',
      labels: this.countries,
      datasets: [
        {
          label: 'Medals',
          data: this.medalsData,
          backgroundColor: CHART_PALETTE,
          hoverOffset: 4,
        },
      ],
      options: {
        aspectRatio: 2.5,
      },
      onClick: (index, label) => {
        this.sliceClick.emit(label as string);
      },
    });
  }
}
