import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CotizacionComponent } from './cotizacion/cotizacion.component';
import { AcordarPagoComponent } from './acordar-pago/acordar-pago.component';

const routes: Routes = [
  {
    path: 'home',  //parent path, define the component that you imported earlier..
    component: HomeComponent,
  },
  {
    path: 'cotizacion',  //parent path, define the component that you imported earlier..
    component: CotizacionComponent,
  },
  {
    path: 'acordar',  //parent path, define the component that you imported earlier..
    component: AcordarPagoComponent,
  }
];

@NgModule({

  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
