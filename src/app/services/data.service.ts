import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { Statistic } from '../models/Statistic';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private olympics$ = new BehaviorSubject<Olympic[]>([
    {
      id: 1,
      country: 'Italy',
      participations: [
        {
          id: 1,
          year: 2012,
          city: 'Londres',
          medalsCount: 28,
          athleteCount: 372,
        },
        {
          id: 2,
          year: 2016,
          city: 'Rio de Janeiro',
          medalsCount: 28,
          athleteCount: 375,
        },
        {
          id: 3,
          year: 2020,
          city: 'Tokyo',
          medalsCount: 40,
          athleteCount: 381,
        },
      ],
    },
    {
      id: 2,
      country: 'Spain',
      participations: [
        {
          id: 1,
          year: 2012,
          city: 'Londres',
          medalsCount: 20,
          athleteCount: 315,
        },
        {
          id: 2,
          year: 2016,
          city: 'Rio de Janeiro',
          medalsCount: 17,
          athleteCount: 312,
        },
        {
          id: 3,
          year: 2020,
          city: 'Tokyo',
          medalsCount: 17,
          athleteCount: 321,
        },
      ],
    },
    {
      id: 3,
      country: 'United States',
      participations: [
        {
          id: 1,
          year: 2012,
          city: 'Londres',
          medalsCount: 109,
          athleteCount: 610,
        },
        {
          id: 2,
          year: 2016,
          city: 'Rio de Janeiro',
          medalsCount: 123,
          athleteCount: 652,
        },
        {
          id: 3,
          year: 2020,
          city: 'Tokyo',
          medalsCount: 113,
          athleteCount: 626,
        },
      ],
    },
    {
      id: 4,
      country: 'Germany',
      participations: [
        {
          id: 1,
          year: 2012,
          city: 'Londres',
          medalsCount: 44,
          athleteCount: 425,
        },
        {
          id: 2,
          year: 2016,
          city: 'Rio de Janeiro',
          medalsCount: 44,
          athleteCount: 422,
        },
        {
          id: 3,
          year: 2020,
          city: 'Tokyo',
          medalsCount: 37,
          athleteCount: 425,
        },
      ],
    },
    {
      id: 5,
      country: 'France',
      participations: [
        {
          id: 1,
          year: 2012,
          city: 'Londres',
          medalsCount: 35,
          athleteCount: 423,
        },
        {
          id: 2,
          year: 2016,
          city: 'Rio de Janeiro',
          medalsCount: 45,
          athleteCount: 412,
        },
        {
          id: 3,
          year: 2020,
          city: 'Tokyo',
          medalsCount: 33,
          athleteCount: 403,
        },
      ],
    },
  ]);

  /**
   * Retourne un Observable des données olympiques
   */
  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable().pipe(delay(500));
  }

  /**
   * Retourne les données d'un pays spécifique
   */
  getOlympicByCountry(countryName: string): Observable<Olympic | undefined> {
    return new Observable<Olympic | undefined>((observer) => {
      this.olympics$.subscribe((olympics) => {
        const country = olympics.find(
          (olympic) => olympic.country === countryName
        );
        observer.next(country);
        observer.complete();
      });
    }).pipe(delay(500));
  }

  /**
   * Calcule le nombre total de JOs (années uniques) à partir des données olympiques
   */
  getTotalJOs(olympics: Olympic[]): number {
    const allYears = olympics.flatMap((olympic) =>
      olympic.participations.map((participation) => participation.year)
    );
    return new Set(allYears).size;
  }

  /**
   * Extrait la liste des noms de pays
   */
  getCountries(olympics: Olympic[]): string[] {
    return olympics.map((olympic) => olympic.country);
  }

  /**
   * Calcule le total de médailles pour chaque pays
   */
  getTotalMedalsPerCountry(olympics: Olympic[]): number[] {
    return olympics.map((olympic) => this.getTotalMedals(olympic));
  }

  /**
   * Calcule le total de médailles pour un pays spécifique
   */
  getTotalMedals(olympic: Olympic): number {
    return olympic.participations.reduce(
      (total, participation) => total + participation.medalsCount,
      0
    );
  }

  /**
   * Calcule le total d'athlètes pour un pays spécifique
   */
  getTotalAthletes(olympic: Olympic): number {
    return olympic.participations.reduce(
      (total, participation) => total + participation.athleteCount,
      0
    );
  }

  /**
   * Extrait les années de participation pour un pays
   */
  getYears(olympic: Olympic): number[] {
    return olympic.participations.map((participation) => participation.year);
  }

  /**
   * Extrait le nombre de médailles par année pour un pays
   */
  getMedalsByYear(olympic: Olympic): number[] {
    return olympic.participations.map(
      (participation) => participation.medalsCount
    );
  }

  /**
   * Compte le nombre de participations (entrées) pour un pays
   */
  getTotalEntries(olympic: Olympic): number {
    return olympic.participations.length;
  }

  /**
   * Retourne les statistiques d'un pays sous forme de tableau de Statistic
   * Utilisé pour afficher les statistiques dans le composant Country
   */
  getCountryStatistics(olympic: Olympic): Statistic[] {
    const totalEntries = this.getTotalEntries(olympic);
    const totalMedals = this.getTotalMedals(olympic);
    const totalAthletes = this.getTotalAthletes(olympic);

    return [
      { label: 'Number of entries', value: totalEntries },
      { label: 'Total Number of medals', value: totalMedals },
      { label: 'Total Number of athletes', value: totalAthletes },
    ];
  }
}
