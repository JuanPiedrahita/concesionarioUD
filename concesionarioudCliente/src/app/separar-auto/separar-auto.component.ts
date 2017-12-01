import { Component, OnInit } from '@angular/core';
import { forEach } from '@angular/router/src/utils/collection';
import { Router } from '@angular/router';
import { OracleDbService } from '../oracle-db.service';

@Component({
  selector: 'app-separar-auto',
  templateUrl: './separar-auto.component.html',
  styleUrls: ['./separar-auto.component.scss']
})
export class SepararAutoComponent implements OnInit {

  dataCotizacion = {};
  cotizaciones: any[];
  total: number;
  cotizacion: number;
  detallesCotizacion: any[];
  mostarDetalles: boolean = false;
  documentoCliente: number;
  detallesPago30: any[];
  gruposFinancieros: any[];
  tiposTarjeta: any[];
  bancos:any[];

  constructor(private router: Router, private oracle: OracleDbService) { }

  ngOnInit() {
    this.cotizaciones = [];
    this.oracle.getGrupoFinanciero()
    .toPromise()
    .then(responseGrupos =>{
      this.gruposFinancieros = JSON.parse(responseGrupos.text());
    })
    .catch(()=>{
      alert("No se pudieron cargar los grupos financieros, por favor recargue la página.");
    });
    this.oracle.getTipoTarjeta()
    .toPromise()
    .then(responseTarjeta =>{
      this.tiposTarjeta = JSON.parse(responseTarjeta.text());
    })
    .catch(()=>{
      alert("No se pudieron cargar los tipos de tarjeta, por favor recargue la página.");
    });
    this.oracle.getBancos()
    .toPromise()
    .then(responseBancos =>{
      this.bancos = JSON.parse(responseBancos.text());
    })
    .catch(()=>{
      alert("No se pudieron cargar los bancos, por favor recargue la página.");
    });
  }

  cargarCotizacion(idCotizacion) {
    this.oracle.getEstadoCotizacion(idCotizacion)
      .toPromise()
      .then(responseEstado => {
        for (let cotizacion of this.cotizaciones) {
          if (cotizacion.IDCOTIZACION == idCotizacion) {
            this.dataCotizacion["ESTADO"] = JSON.parse(responseEstado.text())[0].ESTADO;
            this.dataCotizacion["FECHA"] = cotizacion.FECHACOTIZACION;
            this.dataCotizacion["TOTAL"] = cotizacion.TOTALCOTIZACION;
            this.total = cotizacion.TOTALCOTIZACION;
          }
        }
        this.oracle.getDetallesCotizacion(idCotizacion)
          .toPromise()
          .then(responseDetalles => {
            this.detallesCotizacion = JSON.parse(responseDetalles.text());
            this.oracle.getDetallesPago30(idCotizacion)
            .toPromise()
            .then(responseDetalles30 => {
              this.detallesPago30 = JSON.parse(responseDetalles30.text());
              this.detallesPago30.forEach(detalle => {
                detalle["PAGADO"] = detalle.PAGO==='TRUE';
              });
              this.mostarDetalles = true;
            })
            .catch(()=>{
              alert("No se pudo cargar los detalles del pago, intente nuevamente.");
            });
          })
          .catch(()=>{
            alert("No se pudo cargar los detalles de la cotización, intente nuevamente.");
          });
      })
      .catch(()=>{
        alert("No se pudo cargar el estado de la cotización, intente nuevamente.");
      });
  }

  consultarCotizaciones() {
    if (this.documentoCliente !== undefined) {
      this.oracle.getCotizacionSeparar(this.documentoCliente).
        toPromise()
        .then(responseCotizacion => {
          this.cotizaciones = JSON.parse(responseCotizacion.text());
          if (this.cotizaciones.length === 0) {
            alert("El cliente digitado no tiene registrada ninguna cotización vigente.");
          }
        })
        .catch(() => {
          alert("No se han podido cargar las cotizaciones");
        });
    } else {
      alert("Ingrese el documento del cliente");
    }
  }

  separarAuto(){
    console.log(this.detallesPago30);
  }
}
