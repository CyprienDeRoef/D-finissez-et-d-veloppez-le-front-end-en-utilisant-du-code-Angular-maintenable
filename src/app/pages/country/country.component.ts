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

          const totalEntries =
            this.dataService.getTotalEntries(selectedCountry);
          const totalMedals = this.dataService.getTotalMedals(selectedCountry);
          const totalAthletes =
            this.dataService.getTotalAthletes(selectedCountry);

          // Créer le tableau de statistiques
          this.statistics = [
            { label: 'Number of entries', value: totalEntries },
            { label: 'Total Number of medals', value: totalMedals },
            { label: 'Total Number of athletes', value: totalAthletes },
          ];

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
