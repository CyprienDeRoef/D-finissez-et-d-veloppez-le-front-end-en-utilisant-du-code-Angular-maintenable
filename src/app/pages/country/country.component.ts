import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Olympic } from '../../models/Olympic';
import { DataService } from '../../services/data.service';

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
    private dataService: DataService
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
    this.dataService.getOlympicByCountry(countryName).subscribe(
      (selectedCountry: Olympic | undefined) => {
        if (selectedCountry) {
          this.titlePage = selectedCountry.country;
          this.totalEntries = this.dataService.getTotalEntries(selectedCountry);
          this.totalMedals = this.dataService.getTotalMedals(selectedCountry);
          this.totalAthletes =
            this.dataService.getTotalAthletes(selectedCountry);
          this.years = this.dataService.getYears(selectedCountry);
          this.medalsData = this.dataService
            .getMedalsByYear(selectedCountry)
            .map((count) => count.toString());
        }
      },
      (error: HttpErrorResponse) => {
        this.error = error.message;
      }
    );
  }
}
