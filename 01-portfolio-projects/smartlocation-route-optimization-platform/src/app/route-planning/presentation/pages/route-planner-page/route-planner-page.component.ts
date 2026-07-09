import { Component, inject } from '@angular/core';
import { StatusBadgeComponent } from '../../../../shared/presentation/components/status-badge/status-badge.component';
import { RoutePlanningFacade } from '../../../application/facades/route-planning.facade';
import { RouteControlPanelComponent } from '../../components/route-control-panel/route-control-panel.component';
import { RouteMetricsPanelComponent } from '../../components/route-metrics-panel/route-metrics-panel.component';
import { RouteNetworkMapComponent } from '../../components/route-network-map/route-network-map.component';

@Component({
  selector: 'app-route-planner-page',
  imports: [
    RouteControlPanelComponent,
    RouteMetricsPanelComponent,
    RouteNetworkMapComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './route-planner-page.component.html',
  styleUrl: './route-planner-page.component.css',
})
export class RoutePlannerPageComponent {
  protected readonly facade = inject(RoutePlanningFacade);
}
