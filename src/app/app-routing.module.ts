import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SearchCountryComponent } from './components/search-country/search-country.component';
import { MapComponent } from './components/map/map.component';
import { AboutComponent } from './components/about/about.component';

const routes: Routes = [
  {path: '**', component: HomeComponent },
  {path: 'search', component: SearchCountryComponent },
  {path: 'map', component: MapComponent },
  {path: 'about', component: AboutComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
