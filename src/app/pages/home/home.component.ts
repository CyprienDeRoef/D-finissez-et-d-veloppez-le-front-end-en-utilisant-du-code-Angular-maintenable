import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { Olympic } from '../../models/Olympic';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private olympicUrl = './assets/mock/olympic.json';
  public pieChart!: Chart<'pie', number[], string>;
  public totalCountries: number = 0;
  public totalJOs: number = 0;
  public error!: string;
  titlePage: string = 'Medals per Country';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get<Olympic[]>(this.olympicUrl)
      .pipe()
      .subscribe(
        (data: Olympic[]) => {
          console.log(`Liste des données : ${JSON.stringify(data)}`);
          if (data && data.length > 0) {
            this.totalJOs = Array.from(
              new Set(
                data
                  .map((olympic: Olympic) =>
                    olympic.participations.map(
                      (participation) => participation.year
                    )
                  )
                  .flat()
              )
            ).length;
            const countries: string[] = data.map(
              (olympic: Olympic) => olympic.country
            );
            this.totalCountries = countries.length;
            const medals = data.map((olympic: Olympic) =>
              olympic.participations.map(
                (participation) => participation.medalsCount
              )
            );
            const sumOfAllMedalsYears = medals.map((medalCounts) =>
              medalCounts.reduce((acc: number, count: number) => acc + count, 0)
            );
            this.buildPieChart(countries, sumOfAllMedalsYears);
          }
        },
        (error: HttpErrorResponse) => {
          console.log(`erreur : ${error}`);
          this.error = error.message;
        }
      );
  }

  buildPieChart(countries: string[], sumOfAllMedalsYears: number[]) {
    const pieChart = new Chart('DashboardPieChart', {
      type: 'pie',
      data: {
        labels: countries,
        datasets: [
          {
            label: 'Medals',
            data: sumOfAllMedalsYears,
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
            const points = pieChart.getElementsAtEventForMode(
              e.native,
              'point',
              { intersect: true },
              true
            );
            if (points.length) {
              const firstPoint = points[0];
              const countryName = pieChart.data.labels
                ? pieChart.data.labels[firstPoint.index]
                : '';
              this.router.navigate(['country', countryName]);
            }
          }
        },
      },
    });
    this.pieChart = pieChart;
  }
}
