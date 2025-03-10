import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/welcome/welcome.page').then((m) => m.WelcomePage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./pages/tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'create-listing',
    loadComponent: () =>
      import('./pages/create-listing/create-listing.page').then(
        (m) => m.CreateListingPage,
      ),
  },
  {
    path: 'edit-listing',
    loadComponent: () =>
      import('./pages/edit-listing/edit-listing.page').then(
        (m) => m.EditListingPage,
      ),
  },
  {
    path: 'listings/:id',
    loadComponent: () =>
      import('./pages/listing/listing.page').then((m) => m.ListingPage),
  },
  {
    path: 'navigate',
    loadComponent: () =>
      import('./pages/navigate/navigate.page').then((m) => m.NavigatePage),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
