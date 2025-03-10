import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'store',
    pathMatch: 'full',
  },
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'store',
        loadComponent: () =>
          import('./store/store.page').then((m) => m.StorePage),
      },
      {
        path: 'requests',
        loadComponent: () =>
          import('./requests/requests.page').then((m) => m.RequestsPage),
      },
      {
        path: 'my-listings',
        loadComponent: () =>
          import('./my-listings/my-listings.page').then(
            (m) => m.MyListingsPage,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./search/search.page').then((m) => m.SearchPage),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
