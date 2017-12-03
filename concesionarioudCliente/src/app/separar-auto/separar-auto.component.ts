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
      alert('No se pudieron cargar los grupos financieros, por favor recargue la página.');
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
                detalle["grupoFinanciero"] = 1;
                detalle["tipoTarjeta"] = 1; 
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
            alert("El cliente digitado no tiene registrada ninguna cotización que permita separar auto.");
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
    var total30 = 0;
    var pagado = true;
    this.detallesPago30.forEach(detalle => {
      pagado = pagado && detalle.PAGADO;
      total30 += detalle.PORCENTAJE;
    });

    //para separar en stock
    var histoAuto = 0;
    var partes = [];
    this.detallesCotizacion.forEach(detalle =>{
      if(detalle.DESCCOTIZACION==="Auto"){
        histoAuto = detalle.ELEMENTO;
      }
      if(detalle.DESCCOTIZACION==="Parte"){
        partes.push(detalle.ELEMENTO);
      }
    });

    if(total30===30){
      var fecha = new Date().toJSON().slice(0, 10);
      if(pagado){
        this.oracle.getMaximo("factura")
        .subscribe(responseFactura => {
          var idFactura = JSON.parse(responseFactura.text()).id;
          var totalFactura = 0;
          this.detallesPago30.forEach(detalle =>{
            detalle.VALOR = detalle.PORCENTAJE*this.total/100;
            totalFactura += detalle.VALOR;
          });

          var dataSeparar = {
            histoAuto: histoAuto,
            partes: JSON.stringify(partes),
            idCliente: this.documentoCliente,
            totalFactura: totalFactura,
            idFactura: idFactura,
            idCotizacion:this.cotizacion,
            fechaSeparar: fecha,
            detallesSeparar: JSON.stringify(this.detallesPago30),
          };
          this.oracle.postSepararAuto(dataSeparar)
          .toPromise()
          .then(response=>{
            alert(response.text()+"\nSe generará un pdf por favor guardelo");
            this.generarPDF(dataSeparar);
            this.router.navigate([""]);
          })
          .catch(()=>{
            alert("No se ha podido separar el auto.");
          });
        });
      }else{
        alert("Aún no se han realizado todos los pagos.");
      }
    }else{
      alert("Los porcentajes no suman el 30%");
    }
  }

  getBanco(idBanco){
    var banconame = "";
    this.bancos.forEach(banco=>{
      if(banco.IDBANCO=idBanco){
        banconame = banco.NOMBREBANCO;
      }
    });
    return banconame;
  }

  getTipoTarjeta(idTipoTarjeta){
    var tarjetaname = "";
    this.tiposTarjeta.forEach(tarjeta=>{
      if(tarjeta.IDBTIPOTARJETA=idTipoTarjeta){
        tarjetaname = tarjeta.DESCRIPCIONTIPOTARJETA;
      }
    });
    return tarjetaname;
  }

  getGrupo(idGrupo){
    var gruponame = "";
    this.gruposFinancieros.forEach(grupo=>{
      if(grupo.IDGRUPO=idGrupo){
        gruponame = grupo.NOMBREGRUPOFINANCIERO;
      }
    });
    return gruponame;
  }

  generarPDF(data: any) {
    
        var pdfmaker = require('pdfmake/build/pdfmake.js');
        var pdfFonts = require('pdfmake/build/vfs_fonts.js');
    
        var body = [];
    
        var detalles = JSON.parse(data.detallesSeparar);
    
        var fila = new Array();
        fila.push("Modalidad de Pago");
        fila.push("Banco");
        fila.push("Grupo Financiero");
        fila.push("Tipo Tarjeta");
        fila.push("Porcentaje");
        fila.push("Valor");
        body.push(fila);
    
        for (var i = 0; i < detalles.length; i++) {
          fila = new Array();
          var detalle = detalles[i];
          var grupo = (detalle.IDMODALIDAD===2 || detalle.IDMODALIDAD===3)?this.getGrupo(detalle.grupoFinanciero):""; 
          var tarjeta = (detalle.IDMODALIDAD===2 || detalle.IDMODALIDAD===3)?this.getTipoTarjeta(detalle.tipoTarjeta):"";
          fila.push(detalle.MODALIDADDEPAGO);
          fila.push(this.getBanco(detalle.IDBANCO));
          fila.push(grupo);
          fila.push(tarjeta);
          fila.push(detalle.PORCENTAJE);
          fila.push((detalle.PORCENTAJE*this.total/100).toFixed(3));
          body.push(fila);
        }
    
    
    
        fila = new Array();
        fila.push("TOTAL");
        fila.push("");
        fila.push("");
        fila.push("");
        fila.push("");
        fila.push((this.total*30/100).toFixed(3));
        body.push(fila);
    
    
        //definicion del pdf
        var dd = {
          content: [
            { text: "CONCESIONARIO UD \n \n \n \n" },
            {
              text: "Factura \n \n \n",
              alignment: 'center',
            },
            {
              text: 'Consecutivo: ' + data.idFactura + ' \n \n'
            },
            {
              text: 'Fecha: ' + data.fechaSeparar + ' \n \n'
            },
            {
              text: "Cliente: \n"
                + "Número de identificación: " + this.documentoCliente
            },
            {
              text: "Detalles de la factura \n \n",
              alignment: 'center'
            },
            {
              table:
                {
                  headerRows: 1,
                  widths: ['15%', '15%', '20%', '20%','15%','15%'],
                  body: body
                }
            }
          ]
        };
    
        pdfmaker.vfs = pdfFonts.pdfMake.vfs;
        pdfmaker.createPdf(dd).download('factura:' + data.idFactura + ',para cliente' + this.documentoCliente+".pdf");
      }
}
