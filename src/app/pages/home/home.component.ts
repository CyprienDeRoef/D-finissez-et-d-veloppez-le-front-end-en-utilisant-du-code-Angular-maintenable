import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Olympic } from '../../models/Olympic';
import { DataService } from '../../services/data.service';

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

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit() {
    console.log('HomeComponent ngOnInit called');
    console.log('titlePage:', this.titlePage);

    this.dataService.getOlympics().subscribe(
      (data: Olympic[]) => {
        console.log(`Liste des données : ${JSON.stringify(data)}`);
        console.log('Data length:', data?.length);

        if (data && data.length > 0) {
          this.totalJOs = this.dataService.getTotalJOs(data);
          this.countries = this.dataService.getCountries(data);
          this.totalCountries = this.countries.length;
          this.medalsData = this.dataService.getTotalMedalsPerCountry(data);

          console.log('totalJOs:', this.totalJOs);
          console.log('countries:', this.countries);
          console.log('totalCountries:', this.totalCountries);
          console.log('medalsData:', this.medalsData);
        } else {
          console.log('No data received or empty array');
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
