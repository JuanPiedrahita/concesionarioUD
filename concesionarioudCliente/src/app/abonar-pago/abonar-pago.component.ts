import { Component, OnInit } from '@angular/core';
import { forEach } from '@angular/router/src/utils/collection';
import { Router } from '@angular/router';
import { OracleDbService } from '../oracle-db.service';


@Component({
  selector: 'app-abonar-pago',
  templateUrl: './abonar-pago.component.html',
  styleUrls: ['./abonar-pago.component.scss']
})
export class AbonarPagoComponent implements OnInit {

  constructor(private router: Router, private oracle: OracleDbService) { }
  dataCotizacion = {};
  cotizaciones: any[];
  total: number;
  cotizacion: number;
  detallesCotizacion: any[];
  mostarDetalles: boolean = false;
  cambio: boolean = false;
  documentoCliente: number;
  detallesPago30: any[];
  detallesPago70: any [];
  gruposFinancieros: any[];
  tiposTarjeta: any[];
  bancos: any[];
  total30: number;
  total70: number;
  porcentaje70: number;
  acuerdo70: any[];
  banco70: number;
  modalidad70: number;
  contador70:number;
  modalidadesPago: any [];




  ngOnInit() {
    this.oracle.getModalidadPago().toPromise().then(responseModalidades=>{
      this.modalidadesPago=JSON.parse(responseModalidades.text());
      console.log(this.modalidadesPago);
    }).catch(() => {
      alert("no se pudieron cargar las modalidades porfavor recargue la pagina");
    });
    this.total70 = 70;
    this.cotizaciones = [];
    this.oracle.getGrupoFinanciero()
      .toPromise()
      .then(responseGrupos => {
        this.gruposFinancieros = JSON.parse(responseGrupos.text());
      })
      .catch(() => {
        alert('No se pudieron cargar los grupos financieros, por favor recargue la página.');
      });
    this.oracle.getTipoTarjeta()
      .toPromise()
      .then(responseTarjeta => {
        this.tiposTarjeta = JSON.parse(responseTarjeta.text());
      })
      .catch(() => {
        alert("No se pudieron cargar los tipos de tarjeta, por favor recargue la página.");
      });
    this.oracle.getBancos()
      .toPromise()
      .then(responseBancos => {
        this.bancos = JSON.parse(responseBancos.text());
      })
      .catch(() => {
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
                  detalle["PAGADO"] = detalle.PAGO === 'TRUE';
                  detalle["grupoFinanciero"] = 1;
                  detalle["tipoTarjeta"] = 1;
                });
                this.oracle.getDetallesPago70(idCotizacion).toPromise()
                .then(responseDetalles70=>{
                  this.detallesPago70=JSON.parse(responseDetalles70.text());
                  this.contador70 = 1;
                  this.detallesPago70.forEach(detalle => {
                    
                    detalle["PAGADO"] = detalle.PAGO === 'TRUE';
                    detalle["grupoFinanciero"] = 1;
                    detalle["tipoTarjeta"] = 1;
                    detalle.IDBANCO = parseInt(detalle.IDBANCO);
                    detalle["nombreBanco"]= detalle.BANCO;
                    detalle["NOMBREBANCO"]= detalle.BANCO;
                    detalle["indice"]= this.contador70;
                    this.contador70++;
                    console.log(detalle);
                  });
                  this.mostarDetalles = true;
                }).catch(()=>{
                  alert("No se pudo cargar los detalles del pago del 70, intente nuevamente.");
                });

              })
              .catch(() => {
                alert("No se pudo cargar los detalles del pago del 30, intente nuevamente.");
              });
          })
          .catch(() => {
            alert("No se pudo cargar los detalles de la cotización, intente nuevamente.");
          });
      })
      .catch(() => {
        alert("No se pudo cargar el estado de la cotización, intente nuevamente.");
      });
  }

  consultarCotizaciones() {
    if (this.documentoCliente !== undefined) {
      this.oracle.getCotizacionAbono(this.documentoCliente).
        toPromise()
        .then(responseCotizacion => {
          this.cotizaciones = JSON.parse(responseCotizacion.text());
          if (this.cotizaciones.length === 0) {
            alert("El cliente digitado no tiene registrada ninguna cotización que permita abonar pago del 70");
          }
        })
        .catch(() => {
          alert("No se han podido cargar las cotizaciones");
        });
    } else {
      alert("Ingrese el documento del cliente");
    }
  }



  eliminar70(indice) {
    this.cambio=true;
    var iEliminar;
    for (var i = 0; i < this.detallesPago70.length; i++) {
      if (this.detallesPago70[i].indice == indice) {
        iEliminar = i;
        this.total70 -= this.detallesPago70[i].PORCENTAJE;
      }
    }
    this.detallesPago70.splice(iEliminar, 1);
  }

  agregar70() {
    if (this.total70 + this.porcentaje70 <= 70 && this.porcentaje70 !== 0) {
      var nombreModalidad = "";
      var nombreBanco = "";
      var correoBanco = "";
      for (let modalidad of this.modalidadesPago) {
        if (modalidad.IDMODALIDAD == this.modalidad70) {
          nombreModalidad = modalidad.NOMBREMODALIDAD;
        }
      }
      if (this.modalidad70 == 1) {
        for (let banco of this.bancos) {
          if (this.banco70 == banco.IDBANCO) {
            nombreBanco = banco.NOMBREBANCO;
            correoBanco = banco.CORREOBANCO;
          }
        }
      }
      this.detallesPago70.push({
        indice: this.contador70,
        IDMODALIDAD: parseInt(this.modalidad70),
        MODALIDADDEPAGO: nombreModalidad,
        PORCENTAJE: this.porcentaje70,
        VALOR: this.porcentaje70 * this.total / 100,
        IDBANCO: this.banco70,
        nombreBanco: nombreBanco,
        correoBanco: correoBanco,
        partepct: 70,
        grupoFinanciero: 1,
        tipoTarjeta: 1,
        PAGADO: false,
        PAGO: 'FALSE',
      });
      console.log(this.detallesPago70)
      this.contador70++;
      this.total70 += this.porcentaje70;
      this.porcentaje70 = 0;
    } else {
      alert("El total supera el valor del 70");
    }
  }

  getBanco(idBanco) {
    var banconame = "";
    this.bancos.forEach(banco => {
      if (banco.IDBANCO = idBanco) {
        banconame = banco.NOMBREBANCO;
      }
    });
    return banconame;
  }

   abonarPago(){
    if(this.cambio){
      
      if(this.total70==70){
        alert('Se actualiza acuerdo de pago');
        var dataUpdate={
          idCotizacion: this.cotizacion,
          detallesPago70: JSON.stringify(this.detallesPago70),
        };
        this.oracle.postAbonarUpdate(dataUpdate).toPromise().then(responseAbonarUpdate=>{
          alert(responseAbonarUpdate.text());
        }).catch(()=>{
          alert('No se pudo actualizar el acuerdo de pago');
        });
      }else{
        alert('Se debe ingresar el 70 %');
      }
      
   }else{
      alert('Se registra pago');
   }
}
