import { Injectable } from '@angular/core';
import Chart from 'chart.js/auto';
import { ChartConfiguration, ChartType } from 'chart.js';

export interface ChartOptions<T extends ChartType = ChartType> {
  canvasId: string;
  type: T;
  labels: (string | number)[];
  datasets: ChartConfiguration<T>['data']['datasets'];
  options?: ChartConfiguration<T>['options'];
  onClick?: (elementIndex: number, label: string | number) => void;
}

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  /**
   * Options par défaut pour tous les charts
   */
  private readonly defaultOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2.5,
  } as const;

  /**
   * Crée un chart Chart.js avec une configuration typée
   * Retourne l'instance du chart ou null si le canvas n'existe pas
   */
  createChart<T extends ChartType = ChartType>(
    config: ChartOptions<T>
  ): Chart<T> | null {
    const canvas = document.getElementById(
      config.canvasId
    ) as HTMLCanvasElement;

    if (!canvas) {
      console.error(`Canvas with id "${config.canvasId}" not found`);
      return null;
    }

    const chartConfig: ChartConfiguration<T> = {
      type: config.type,
      data: {
        labels: config.labels,
        datasets: config.datasets,
      },
      options: {
        ...this.defaultOptions,
        ...config.options,
      } as ChartConfiguration<T>['options'],
    };

    // Ajouter le onClick handler si fourni
    if (config.onClick && chartConfig.options) {
      chartConfig.options.onClick = (event, elements, chart) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          const label = chart.data.labels?.[index];
          if (
            label !== undefined &&
            label !== null &&
            (typeof label === 'string' || typeof label === 'number')
          ) {
            config.onClick!(index, label);
          }
        }
      };
    }

    return new Chart(canvas, chartConfig);
  }

  /**
   * Détruit un chart de manière sécurisée
   */
  destroyChart(chart: Chart | null | undefined): void {
    if (chart) {
      chart.destroy();
    }
  }
}
