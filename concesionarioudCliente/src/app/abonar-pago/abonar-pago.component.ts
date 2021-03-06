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
  detallesPago70: any[];
  gruposFinancieros: any[];
  tiposTarjeta: any[];
  porcentajeDisponible:number=70;
  bancos: any[];
  total30: number;
  total70: number;
  porcentaje70: number;
  acuerdo70: any[];
  banco70: number;
  modalidad70: number;
  contador70: number;
  modalidadesPago: any[];
  idAcuerdoPago: number = 0;




  ngOnInit() {
    this.oracle.getModalidadPago().toPromise().then(responseModalidades => {
      this.modalidadesPago = JSON.parse(responseModalidades.text());
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
                this.porcentajeDisponible=70;
                this.oracle.getDetallesPago70(idCotizacion).toPromise()
                  .then(responseDetalles70 => {
                    this.detallesPago70 = JSON.parse(responseDetalles70.text());
                    this.contador70 = 1;
                    this.detallesPago70.forEach(detalle => {
                      this.idAcuerdoPago = (this.idAcuerdoPago > detalle.IDACUERDOPAGO) ? this.idAcuerdoPago : detalle.IDACUERDOPAGO;
                      detalle["PAGADO"] = detalle.PAGO === 'TRUE';
                      detalle["grupoFinanciero"] = 1;
                      detalle["tipoTarjeta"] = 1;
                      detalle.IDBANCO = parseInt(detalle.IDBANCO);
                      detalle["nombreBanco"] = detalle.BANCO;
                      detalle["NOMBREBANCO"] = detalle.BANCO;
                      detalle["indice"] = this.contador70;
                      if(detalle.PAGADO){
                        this.porcentajeDisponible-= detalle.PORCENTAJE;
                      }

                      this.contador70++;
                      console.log(detalle);
                    });
                    this.total70 = this.porcentajeDisponible;
                    this.idAcuerdoPago++;
                    this.mostarDetalles = true;
                  }).catch(() => {
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
    this.cambio = true;
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
    if (this.total70 + this.porcentaje70 <= this.porcentajeDisponible && this.porcentaje70 !== 0) {
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
        IDACUERDOPAGO: 0,
        indice: this.contador70,
        IDMODALIDAD: parseInt(this.modalidad70+""),
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

  registrarPago() {
    var pagosHechos = [];
    var total = 0;
    var todoPagado = "true";
    this.detallesPago70.forEach(detalle => {
      if (detalle.PAGADO===false) {
        todoPagado = "false";
      }
      if (detalle.PAGO === 'FALSE' && detalle.PAGADO) {
        pagosHechos.push(detalle);
        total += detalle.VALOR;
      }
    });

    if (pagosHechos.length > 0) {
      var histoAuto = 0;
      var partes = [];
      this.detallesCotizacion.forEach(detalle => {
        if (detalle.DESCCOTIZACION === "Auto") {
          histoAuto = detalle.ELEMENTO;
        }
        if (detalle.DESCCOTIZACION === "Parte") {
          partes.push(detalle.ELEMENTO);
        }
      });
      this.oracle.getMaximo("factura").subscribe(responseIdFactura => {
        var idFactura = JSON.parse(responseIdFactura.text()).id;
        var dataPagos = {
          partes: JSON.stringify(partes),
          idCotizacion: this.cotizacion,
          idCliente: this.documentoCliente,
          idFactura: idFactura,
          total: total,
          detalles: JSON.stringify(pagosHechos),
          histoAuto: histoAuto,
          todoPagado: todoPagado
        }
        this.oracle.postPagar(dataPagos).toPromise().then((responsePagos) => {
          alert(responsePagos.text() + "\nSe generará un pdf por favor guardelo");
          this.generarPDF(dataPagos);
          this.router.navigate([""]);
        }).catch(() => {
          alert('No se pudieron registrar los pagos');
        });
      });
    } else {
      alert('No se ha realizado ningun pago');
    }

  }

  abonarPago() {
    if (this.cambio) {
      if (this.total70 == this.porcentajeDisponible) {
        this.detallesPago70.forEach(detalle => {
          detalle.IDACUERDOPAGO = this.idAcuerdoPago;
          this.idAcuerdoPago++;
        });
        var dataUpdate = {
          idCotizacion: this.cotizacion,
          detallesPago70: JSON.stringify(this.detallesPago70),
        };
        this.oracle.postAbonarUpdate(dataUpdate).toPromise().then(responseAbonarUpdate => {
          this.registrarPago();
          this.cambio = false;
          alert(responseAbonarUpdate.text());
        }).catch(() => {
          alert('No se pudo actualizar el acuerdo de pago');
        });
      } else {
        alert('Se debe ingresar el 70 %');
      }

    } else {
      this.registrarPago();

    }
  }
  getTipoTarjeta(idTipoTarjeta) {
    var tarjetaname = "";
    this.tiposTarjeta.forEach(tarjeta => {
      if (tarjeta.IDBTIPOTARJETA = idTipoTarjeta) {
        tarjetaname = tarjeta.DESCRIPCIONTIPOTARJETA;
      }
    });
    return tarjetaname;
  }

  getGrupo(idGrupo) {
    var gruponame = "";
    this.gruposFinancieros.forEach(grupo => {
      if (grupo.IDGRUPO = idGrupo) {
        gruponame = grupo.NOMBREGRUPOFINANCIERO;
      }
    });
    return gruponame;
  }

  generarPDF(data: any) {

    var pdfmaker = require('pdfmake/build/pdfmake.js');
    var pdfFonts = require('pdfmake/build/vfs_fonts.js');

    var body = [];
    var total = 0;
    var f= new Date();
    f.setDate(f.getDate() +1);
    var fecha = f.toJSON().slice(0, 10);
    var detalles = JSON.parse(data.detalles);

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
      var banco = (detalle.IDMODALIDAD === 1) ? this.getBanco(detalle.IDBANCO): "";
      var grupo = (detalle.IDMODALIDAD === 2 || detalle.IDMODALIDAD === 3) ? this.getGrupo(detalle.grupoFinanciero) : "";
      var tarjeta = (detalle.IDMODALIDAD === 2 || detalle.IDMODALIDAD === 3) ? this.getTipoTarjeta(detalle.tipoTarjeta) : "";
      fila.push(detalle.MODALIDADDEPAGO);
      fila.push(banco);
      fila.push(grupo);
      fila.push(tarjeta);
      fila.push(detalle.PORCENTAJE);
      fila.push((detalle.PORCENTAJE * this.total / 100).toFixed(3));
      body.push(fila);

      total += detalle.VALOR;
    }



    fila = new Array();
    fila.push("TOTAL");
    fila.push("");
    fila.push("");
    fila.push("");
    fila.push("");
    fila.push((total).toFixed(3));
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
          text: 'Fecha: ' + fecha + ' \n \n'
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
              widths: ['15%', '15%', '20%', '20%', '15%', '15%'],
              body: body
            }
        }
      ]
    };

    pdfmaker.vfs = pdfFonts.pdfMake.vfs;
    pdfmaker.createPdf(dd).download('factura:' + data.idFactura + ',para cliente' + this.documentoCliente + ".pdf");
  }
}
