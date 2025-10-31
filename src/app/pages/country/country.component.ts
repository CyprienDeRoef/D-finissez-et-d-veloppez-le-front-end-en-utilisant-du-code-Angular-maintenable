import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Olympic } from '../../models/Olympic';
import { OlympicService } from '../../services/olympic.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
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
    private olympicService: OlympicService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((param: ParamMap) => {
      const countryName = param.get('countryName');
      if (countryName) {
        this.loadCountryData(countryName);
      }
    });
  }

  private loadCountryData(countryName: string): void {
    this.olympicService.getOlympicByCountry(countryName).subscribe(
      (selectedCountry: Olympic | undefined) => {
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
            (accumulator: number, item: string) => accumulator + parseInt(item),
            0
          );
          const nbAthletes = selectedCountry.participations.map(
            (participation) => participation.athleteCount.toString()
          );
          this.totalAthletes = nbAthletes.reduce(
            (accumulator: number, item: string) => accumulator + parseInt(item),
            0
          );
        }
      },
      (error: HttpErrorResponse) => {
        this.error = error.message;
      }
    );
  }
}
