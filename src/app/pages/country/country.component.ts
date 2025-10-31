import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Olympic } from '../../models/Olympic';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  private olympicUrl = './assets/mock/olympic.json';
  public titlePage: string = '';
  public totalEntries: number = 0;
  public totalMedals: number = 0;
  public totalAthletes: number = 0;
  public error!: string;
  public years: number[] = [];
  public medalsData: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    let countryName: string | null = null;
    this.route.paramMap.subscribe(
      (param: ParamMap) => (countryName = param.get('countryName'))
    );
    this.http
      .get<Olympic[]>(this.olympicUrl)
      .pipe()
      .subscribe(
        (data: Olympic[]) => {
          if (data && data.length > 0) {
            const selectedCountry = data.find(
              (olympic: Olympic) => olympic.country === countryName
            );
            if (selectedCountry) {
              this.titlePage = selectedCountry.country;
              this.totalEntries = selectedCountry.participations.length;
              this.years = selectedCountry.participations.map(
                (participation) => participation.year
              );
              this.medalsData = selectedCountry.participations.map(
                (participation) => participation.medalsCount.toString()
              );
              this.totalMedals = this.medalsData.reduce(
                (accumulator: number, item: string) =>
                  accumulator + parseInt(item),
                0
              );
              const nbAthletes = selectedCountry.participations.map(
                (participation) => participation.athleteCount.toString()
              );
              this.totalAthletes = nbAthletes.reduce(
                (accumulator: number, item: string) =>
                  accumulator + parseInt(item),
                0
              );
            }
          }
        },
        (error: HttpErrorResponse) => {
          this.error = error.message;
        }
      );
  }
}
