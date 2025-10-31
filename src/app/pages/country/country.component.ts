import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Olympic } from '../../models/Olympic';
import { Statistic } from '../../models/Statistic';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  public titlePage: string = '';
  public statistics: Statistic[] = [];
  public error: string = '';
  public years: number[] = [];
  public medalsData: string[] = [];
  public countryNotFound: boolean = false;
  public isLoading: boolean = false;

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
      } else {
        // Si pas de nom de pays dans l'URL, rediriger vers 404
        this.router.navigate(['/404']);
      }
    });
  }

  private loadCountryData(countryName: string): void {
    this.resetErrorState();
    this.isLoading = true;

    this.dataService.getOlympicByCountry(countryName).subscribe(
      (selectedCountry: Olympic | undefined) => {
        this.isLoading = false;

        if (!this.validateCountryData(selectedCountry, countryName)) {
          return;
        }

        this.displayCountryInformation(selectedCountry!);
      },
      (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.handleError(error);
      }
    );
  }

  private resetErrorState(): void {
    this.countryNotFound = false;
    this.error = '';
  }

  private validateCountryData(
    country: Olympic | undefined,
    countryName: string
  ): boolean {
    if (!country) {
      this.setError(`Country "${countryName}" not found in our database.`);
      return false;
    }

    if (!country.participations || country.participations.length === 0) {
      this.setError(`No participation data available for "${countryName}".`);
      return false;
    }

    return true;
  }

  private setError(message: string): void {
    this.countryNotFound = true;
    this.error = message;
  }

  private displayCountryInformation(country: Olympic): void {
    this.titlePage = country.country;
    this.statistics = this.dataService.getCountryStatistics(country);
    this.years = this.dataService.getYears(country);
    this.medalsData = this.dataService
      .getMedalsByYear(country)
      .map((count) => count.toString());
  }

  private handleError(error: HttpErrorResponse): void {
    this.error =
      'An error occurred while loading country data. Please try again later.';
    console.error('Error loading country data:', error);
  }

  goBack(): void {
    this.router.navigate(['']);
  }
}
