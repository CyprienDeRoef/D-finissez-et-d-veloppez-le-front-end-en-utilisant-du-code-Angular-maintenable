import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent implements OnInit, OnDestroy {
  @Input() years: number[] = [];
  @Input() medalsData: string[] = [];
  @Input() chartId: string = 'lineChart';

  private chart!: Chart<'line', string[], number>;

  ngOnInit(): void {
    this.buildChart();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private buildChart(): void {
    this.chart = new Chart(this.chartId, {
      type: 'line',
      data: {
        labels: this.years,
        datasets: [
          {
            label: 'medals',
            data: this.medalsData,
            backgroundColor: '#0b868f',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }
}
