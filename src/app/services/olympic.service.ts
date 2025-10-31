import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {}

  /**
   * Charge les données olympiques depuis le JSON
   * Les données sont mises en cache dans le BehaviorSubject
   */
  loadInitialData(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((data) => this.olympics$.next(data)),
      catchError((error) => {
        console.error('Error loading Olympic data:', error);
        this.olympics$.next([]);
        return throwError(() => error);
      })
    );
  }

  /**
   * Retourne un Observable des données olympiques
   * Si les données ne sont pas encore chargées, retourne un tableau vide
   */
  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }

  /**
   * Retourne les données d'un pays spécifique
   */
  getOlympicByCountry(countryName: string): Observable<Olympic | undefined> {
    return new Observable((observer) => {
      this.olympics$.subscribe((olympics) => {
        const country = olympics.find(
          (olympic) => olympic.country === countryName
        );
        observer.next(country);
        observer.complete();
      });
    });
  }
}
