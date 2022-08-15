import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageCesiumComponent } from './pages/page-cesium/page-cesium.component';
import { PageLeafletComponent } from './pages/page-leaflet/page-leaflet.component';
import { PageMainComponent } from './pages/page-main/page-main.component';

const routes: Routes = [
  { path: 'cesium', component: PageCesiumComponent },
  { path: 'leaflet', component: PageLeafletComponent },
  { path: '', component: PageMainComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
