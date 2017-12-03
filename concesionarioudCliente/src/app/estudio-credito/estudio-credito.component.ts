import { OracleDbService } from '../oracle-db.service';
import { forEach } from '@angular/router/src/utils/collection';
import { Router } from '@angular/router';import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-estudio-credito',
  templateUrl: './estudio-credito.component.html',
  styleUrls: ['./estudio-credito.component.scss']
})
export class EstudioCreditoComponent implements OnInit {

  dataCotizacion = {};
  cotizaciones: any[];
  total: number;
  cotizacion: number;
  detallesCotizacion: any[];
  mostarDetalles: boolean = false;
  documentoCliente: number;

  constructor(private router: Router,private oracle:OracleDbService) { }

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
          this.total = cotizacion.TOTALCOTIZACION;
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
      this.oracle.getCotizacionCredito(this.documentoCliente).
      subscribe(responseCotizacion => {
        this.cotizaciones = JSON.parse(responseCotizacion.text());
        if(this.cotizaciones.length === 0){
          alert("El cliente digitado no tiene registrada ninguna cotización pendiente por estudiar crédito.");
        }
      });
    }else{
      alert("Ingrese el documento del cliente");
    }
  }

  cambiarEstado(){
    this.oracle.postCambioEstado({
      idCotizacion:this.cotizacion
    }).toPromise()
    .then(()=>{
      alert("Se cambio el estado correctamente");
      this.router.navigate([""]);
    })
    .catch(()=>{
      alert("No se pudo cambiar el estado");
    });
  }
}
