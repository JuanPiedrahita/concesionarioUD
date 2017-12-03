import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CotizacionComponent } from './cotizacion/cotizacion.component';
import { AcordarPagoComponent } from './acordar-pago/acordar-pago.component';
import { EstudioCreditoComponent } from './estudio-credito/estudio-credito.component' ;
import { SepararAutoComponent } from './separar-auto/separar-auto.component';
import { AbonarPagoComponent} from './abonar-pago/abonar-pago.component';
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
  },
  {
    path: 'estudio',  //parent path, define the component that you imported earlier..
    component: EstudioCreditoComponent,
  },
  {
    path: 'separar',  //parent path, define the component that you imported earlier..
    component: SepararAutoComponent,
  },
  { 
    path: 'abonar',  //parent path, define the component that you imported earlier..
    component: AbonarPagoComponent,

  }
];

@NgModule({

  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
