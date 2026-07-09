import { Component, Input } from '@angular/core';
import { MetricCardComponent } from '../../../../shared/presentation/components/metric-card/metric-card.component';
import { StatusBadgeComponent } from '../../../../shared/presentation/components/status-badge/status-badge.component';
import { RoadRoute, RoadRouteStatus } from '../../../domain/models/road-route.model';

@Component({
  selector: 'app-route-metrics-panel',
  imports: [MetricCardComponent, StatusBadgeComponent],
  templateUrl: './route-metrics-panel.component.html',
  styleUrl: './route-metrics-panel.component.css',
})
export class RouteMetricsPanelComponent {
  @Input() roadRoute: RoadRoute | null = null;
  @Input() roadRouteStatus: RoadRouteStatus = 'waiting-for-points';

  protected distanceValue(): string {
    if (this.roadRoute) {
      return `${(this.roadRoute.distanceMeters / 1000).toFixed(1)} km`;
    }

    return '0 km';
  }

  protected timeValue(): string {
    if (this.roadRoute) {
      return `${Math.round(this.roadRoute.durationSeconds / 60)} min`;
    }

    return '0 min';
  }

  protected congestionValue(): string {
    if (this.roadRoute) {
      return this.roadRoute.provider === 'python-osm' ? 'Python' : 'OSM';
    }

    return '-';
  }

  protected costValue(): string {
    if (this.roadRoute) {
      return `${Math.round(this.roadRoute.durationSeconds)} s`;
    }

    return '0';
  }

  protected routeSummary(): string {
    if (this.roadRoute) {
      const stepNames = this.roadRoute.steps
        .map((step) => step.name)
        .filter((name, index, names) => name !== 'Via sin nombre' && names.indexOf(name) === index)
        .slice(0, 5);

      return stepNames.length > 0 ? stepNames.join(' -> ') : 'Recorrido por red vial';
    }

    if (this.roadRouteStatus === 'waiting-for-calculation') {
      return 'Pendiente de calculo';
    }

    return 'Marca origen y destino en el mapa';
  }

  protected visitedValue(): string {
    if (this.roadRoute) {
      return `${this.roadRoute.geometry.length}`;
    }

    return '0';
  }

  protected edgeValue(): string {
    if (this.roadRoute) {
      return `${this.roadRoute.steps.length}`;
    }

    return '0';
  }

  protected criterionUnit(): string {
    if (this.roadRoute) {
      return this.algorithmLabel();
    }

    return '';
  }

  protected flowSupporting(): string {
    return this.roadRoute?.provider === 'python-osm' ? 'Algoritmo Python' : 'Sentidos OSM';
  }

  protected statusLabel(): string {
    if (this.roadRouteStatus === 'loading') {
      return 'Calculando';
    }

    if (this.roadRouteStatus === 'waiting-for-calculation') {
      return 'Pendiente';
    }

    return this.roadRoute ? 'Ruta vial' : 'Sin ruta';
  }

  protected algorithmLabel(): string {
    switch (this.roadRoute?.algorithm) {
      case 'astar':
        return 'A*';
      case 'dijkstra':
        return 'Dijkstra';
      case 'bfs':
        return 'BFS';
      default:
        return '';
    }
  }

  protected statusTone(): 'ready' | 'alert' | 'accent' {
    if (this.roadRouteStatus === 'loading') {
      return 'accent';
    }

    if (this.roadRouteStatus === 'waiting-for-calculation') {
      return 'accent';
    }

    return this.roadRoute ? 'ready' : 'alert';
  }
}
