import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Olympic } from '../../models/Olympic';
import { OlympicService } from '../../services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public totalCountries: number = 0;
  public totalJOs: number = 0;
  public error!: string;
  public titlePage: string = 'Medals per Country';
  public countries: string[] = [];
  public medalsData: number[] = [];

  constructor(private router: Router, private olympicService: OlympicService) {}

  ngOnInit() {
    this.olympicService.loadInitialData().subscribe(
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
          this.countries = data.map((olympic: Olympic) => olympic.country);
          this.totalCountries = this.countries.length;
          const medals = data.map((olympic: Olympic) =>
            olympic.participations.map(
              (participation) => participation.medalsCount
            )
          );
          this.medalsData = medals.map((medalCounts) =>
            medalCounts.reduce((acc: number, count: number) => acc + count, 0)
          );
        }
      },
      (error: HttpErrorResponse) => {
        console.log(`erreur : ${error}`);
        this.error = error.message;
      }
    );
  }

  onCountryClick(countryName: string): void {
    this.router.navigate(['country', countryName]);
  }
}
