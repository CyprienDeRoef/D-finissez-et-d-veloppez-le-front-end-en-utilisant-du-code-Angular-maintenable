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
  public error!: string;
  public titlePage: string = 'Medals per Country';
  public statistics: Statistic[] = [];
  public countries: string[] = [];
  public medalsData: number[] = [];
  public isLoading: boolean = false;

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit() {
    this.isLoading = true;

    this.dataService.getOlympics().subscribe(
      (data: Olympic[]) => {
        this.isLoading = false;

        if (data && data.length > 0) {
          const totalJOs = this.dataService.getTotalJOs(data);
          this.countries = this.dataService.getCountries(data);
          const totalCountries = this.countries.length;
          this.medalsData = this.dataService.getTotalMedalsPerCountry(data);

          // Créer le tableau de statistiques
          this.statistics = [
            { label: 'Number of countries', value: totalCountries },
            { label: 'Number of JOs', value: totalJOs },
          ];
        }
      },
      (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.error = error.message;
      }
    );
  }

  onCountryClick(countryName: string): void {
    this.router.navigate(['country', countryName]);
  }
}
