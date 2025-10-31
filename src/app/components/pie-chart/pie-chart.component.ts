import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss',
})
export class PieChartComponent implements OnInit, OnDestroy {
  @Input() countries: string[] = [];
  @Input() medalsData: number[] = [];
  @Input() chartId: string = 'pieChart';
  @Output() sliceClick = new EventEmitter<string>();

  private chart!: Chart<'pie', number[], string>;

  ngOnInit(): void {
    this.buildPieChart();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private buildPieChart(): void {
    this.chart = new Chart(this.chartId, {
      type: 'pie',
      data: {
        labels: this.countries,
        datasets: [
          {
            label: 'Medals',
            data: this.medalsData,
            backgroundColor: [
              '#0b868f',
              '#adc3de',
              '#7a3c53',
              '#8f6263',
              'orange',
              '#94819d',
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        onClick: (e) => {
          if (e.native) {
            const points = this.chart.getElementsAtEventForMode(
              e.native,
              'point',
              { intersect: true },
              true
            );
            if (points.length) {
              const firstPoint = points[0];
              const countryName = this.chart.data.labels
                ? this.chart.data.labels[firstPoint.index]
                : '';
              this.sliceClick.emit(countryName as string);
            }
          }
        },
      },
    });
  }
}
