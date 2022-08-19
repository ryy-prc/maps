import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CesiumDirective } from './directives/cesium.directive';
import { PageCesiumComponent } from './pages/page-cesium/page-cesium.component';
import { PageLeafletComponent } from './pages/page-leaflet/page-leaflet.component';
import { PageMainComponent } from './pages/page-main/page-main.component';
import { LeafletDirective } from './directives/leaflet.directive';

@NgModule({
  declarations: [
    AppComponent,
    CesiumDirective,
    PageCesiumComponent,
    PageLeafletComponent,
    PageMainComponent,
    LeafletDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
