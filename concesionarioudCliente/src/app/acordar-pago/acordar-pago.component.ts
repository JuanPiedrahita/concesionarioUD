import { Component, OnInit } from '@angular/core';
import { OracleDbService } from '../oracle-db.service';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-acordar-pago',
  templateUrl: './acordar-pago.component.html',
  styleUrls: ['./acordar-pago.component.scss']
})
export class AcordarPagoComponent implements OnInit {

  constructor(private oracle:OracleDbService) { }

  documentoCliente: number;
  cotizaciones: any[];
  detallesCotizacion: any[];
  cotizacion: number;
  mostarDetalles: boolean = false;
  dataCotizacion = {};

  ngOnInit() {
    this.cotizaciones = [];
  }

  cargarCotizacion(idCotizacion){
    this.oracle.getEstadoCotizacion(idCotizacion)
    .subscribe(responseEstado => {

      for(let cotizacion of this.cotizaciones){
        if(cotizacion.IDCOTIZACION==idCotizacion){
          this.dataCotizacion["ESTADO"] = JSON.parse(responseEstado.text())[0].ESTADO;
          this.dataCotizacion["FECHA"] = cotizacion.FECHACOTIZACION;
          this.dataCotizacion["TOTAL"] = cotizacion.TOTALCOTIZACION;
        }
      }

      this.oracle.getDetallesCotizacion(idCotizacion)
      .subscribe(responseDetalles => {
        this.detallesCotizacion = JSON.parse(responseDetalles.text());
      });

      this.mostarDetalles = true;
    });
  }

  consultarCotizaciones(){
    if(this.documentoCliente !== undefined){
      this.oracle.getCotizacionPago(this.documentoCliente).
      subscribe(responseCotizacion => {
        this.cotizaciones = JSON.parse(responseCotizacion.text());
        if(this.cotizaciones.length === 0){
          alert("El cliente digitado no tiene registrada ninguna cotización vigente.");
        }
      });
    }else{
      alert("Ingrese el documento del cliente");
    }
  }
}
