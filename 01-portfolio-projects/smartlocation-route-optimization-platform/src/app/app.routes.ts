import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./route-planning/route-planning.routes').then(
        (routes) => routes.ROUTE_PLANNING_ROUTES,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
