import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';

//import for routing
import { AppRoutingModule } from './app-routing.module';

import { HttpModule } from '@angular/http'
//import service for oracle database api
import { OracleDbService } from './oracle-db.service'
//import for pdf generator


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CotizacionComponent } from './cotizacion/cotizacion.component';
import { AcordarPagoComponent } from './acordar-pago/acordar-pago.component';
import { EstudioCreditoComponent } from './estudio-credito/estudio-credito.component';
import { SepararAutoComponent } from './separar-auto/separar-auto.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CotizacionComponent,
    AcordarPagoComponent,
    EstudioCreditoComponent,
    SepararAutoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule
  ],
  providers: [
    OracleDbService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
