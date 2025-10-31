import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Olympic } from '../../models/Olympic';
import { Statistic } from '../../models/Statistic';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public error: string = '';
  public titlePage: string = 'Medals per Country';
  public statistics: Statistic[] = [];
  public countries: string[] = [];
  public medalsData: number[] = [];
  public isLoading: boolean = false;

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    this.loadOlympicData();
  }

  private loadOlympicData(): void {
    this.resetErrorState();
    this.isLoading = true;

    this.dataService.getOlympics().subscribe(
      (data: Olympic[]) => {
        this.isLoading = false;

        if (!this.validateOlympicData(data)) {
          return;
        }

        this.displayOlympicInformation(data);
      },
      (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.handleError(error);
      }
    );
  }

  private validateOlympicData(data: Olympic[]): boolean {
    if (!data || data.length === 0) {
      this.setError('No Olympic data available. Please check back later.');
      return false;
    }

    return true;
  }

  private displayOlympicInformation(data: Olympic[]): void {
    const totalJOs = this.dataService.getTotalJOs(data);
    this.countries = this.dataService.getCountries(data);
    const totalCountries = this.countries.length;
    this.medalsData = this.dataService.getTotalMedalsPerCountry(data);

    this.statistics = [
      { label: 'Number of countries', value: totalCountries },
      { label: 'Number of JOs', value: totalJOs },
    ];
  }

  private setError(message: string): void {
    this.error = message;
  }

  private resetErrorState(): void {
    this.error = '';
  }

  private handleError(error: HttpErrorResponse): void {
    this.error = 'Failed to load Olympic data. Please try again later.';
    console.error('Error loading Olympic data:', error);
  }

  onCountryClick(countryName: string): void {
    this.router.navigate(['country', countryName]);
  }

  retryLoad(): void {
    this.loadOlympicData();
  }
}
