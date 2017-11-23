import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';

import { HttpModule } from '@angular/http'
//import service for oracle database api
import { OracleDbService } from './oracle-db.service'

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CotizacionComponent } from './cotizacion/cotizacion.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CotizacionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule
  ],
  providers: [OracleDbService],
  bootstrap: [AppComponent]
})
export class AppModule { }
