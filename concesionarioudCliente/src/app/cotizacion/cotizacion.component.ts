import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OracleDbService } from '../oracle-db.service';
import { log } from 'util';


@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.scss']
})
export class CotizacionComponent implements OnInit {

  constructor(private router: Router, private oracle: OracleDbService) { }

  seguro: number = 0;
  matricula: number = 0;
  documentoCliente = "";
  idCliente: number;
  cliente: string = "";
  contactosCliente: any[];
  autos: any[];
  caracteristicasAuto: any[];
  partesAuto: any[];
  partesLujo: any[];
  auto: string = "";
  mostrarPartes: boolean = false;
  valorAuto = [];
  partesAgregadas: any[] = [];
  total: number = 0;
  parteLujoCarro: number;
  btnParteLujo: string = "Agregar";


  cambiarTexto(indice) {
    var parte = (this.partesLujo[indice]);
    var esta = false;
    var index = -1;
    this.partesAuto.forEach(parteAuto => {
      if (parteAuto.ID == parte.ID) {
        esta = true;
        index = this.partesAuto.indexOf(parteAuto);
      }
    });
    if (!esta) {
      this.btnParteLujo = "Agregar";
    } else {
      this.btnParteLujo = "Eliminar";
    }
  }

  agregarParte() {
    var indice = this.parteLujoCarro;
    var parte = (this.partesLujo[indice]);
    var esta = false;
    var index = -1;
    this.partesAuto.forEach(parteAuto => {
      if (parteAuto.ID == parte.ID) {
        esta = true;
        index = this.partesAuto.indexOf(parteAuto);
      }
    });
    if (!esta) {
      this.partesAuto.push(parte);
      this.partesAgregadas.push(parte);
      this.total += parte.PRECIO;
    } else {
      this.partesAuto.splice(index, 1);
      this.partesAgregadas.splice(this.partesAgregadas.indexOf(parte), 1);
      this.total -= parte.PRECIO;
    }
    console.log(parte);
  }

  cotizarAuto(valor) {
    this.mostrarPartes = false;

    for (var i = 0; i < this.autos.length; i++) {
      if (this.autos[i].VIN == valor) {
        this.auto = this.autos[i].NOMBRE;
      }
    }

    this.oracle.getAutoCaracteristica(valor)
      .subscribe(response => {
        this.caracteristicasAuto = JSON.parse(response.text());
        this.oracle.getAutoParte(valor)
          .subscribe(responsePartes => {
            this.partesAuto = JSON.parse(responsePartes.text());
            this.oracle.getValorAuto(valor)
              .subscribe(responseValor => {
                this.valorAuto = [];
                this.valorAuto.push(JSON.parse(responseValor.text())[0]);
                console.log(this.valorAuto);
                this.total = this.valorAuto[0].VALOR;
                this.mostrarPartes = true;
              });
          });
      });
  }

  ngOnInit() {

    if (localStorage.getItem("user") == null) {
      this.router.navigate([""]);
    }

    this.oracle.getParteLujo()
      .subscribe(respuesta => {
        this.partesLujo = JSON.parse(respuesta.text());
      });

    this.oracle.getAuto()
      .subscribe(respuesta => {
        this.autos = JSON.parse(respuesta.text());
      });
  }

  seleccionarCliente() {
    if (this.documentoCliente != "") {
      this.oracle.getCliente(parseInt(this.documentoCliente))
        .subscribe(cliente => {
          if (JSON.parse(cliente.text()).length !== 0) {
            this.cliente = JSON.parse(cliente.text())[0].NOMBRE;
            this.idCliente = parseInt(this.documentoCliente);
            this.oracle.getContactossCliente(parseInt(this.documentoCliente))
              .subscribe(contactos => {
                this.contactosCliente = JSON.parse((contactos.text()));
              });
          } else {
            alert("El cliente no existe");
          }
        });
    } else {
      alert("Por favor dijite un documento para el cliente");
    }
  }


  registrarCotizacion() {
    //se agrega el total
    this.total += this.seguro+this.matricula;

    //se buscan los ids para insertar
    this.oracle.getMaximo("cotizacion")
      .subscribe(response => {
        var idCotizacion = JSON.parse(response.text()).id;
        this.oracle.getEmpleado(localStorage.getItem("user"))
          .subscribe(empleado => {
            this.oracle.getMaximo("proceso")
              .subscribe(responseProceso => {
                var idProceso = JSON.parse(responseProceso.text()).id;
                this.oracle.getMaximo("registro")
                .subscribe(responseRegistro =>{
                  var idRegistro = JSON.parse(responseRegistro.text()).id;
                  this.oracle.getMaximo("preciosRegistro")
                  .subscribe(responsePreciosRegistro => {
                    var idHistoricoPreciosRegistro = JSON.parse(responsePreciosRegistro.text()).id;

                    var fecha = new Date().toJSON().slice(0, 10);
                    var idEmpleado = JSON.parse(empleado.text())[0].IDEMPLEADO;
    
    
                    //data de los detalles de la cotizacion
                    var dataDetalleCotizacion = [];
                    dataDetalleCotizacion.push({
                      idDetalleCotizacion: 1,
                      descCotizacion: 'Auto',
                      nombre: this.auto,
                      elemento: this.valorAuto[0].ID,
                      valorElemento: this.valorAuto[0].VALOR,
                    });
                    var contador = 1;
                    this.partesAgregadas.forEach(parte => {
                      contador++;
                      dataDetalleCotizacion.push(
                        {
                          idDetalleCotizacion: contador,
                          descCotizacion: 'Parte',
                          nombre: parte.PARTE,
                          elemento: parte.ID,
                          valorElemento: parte.PRECIO,
                        }
                      );
                    });
                    contador ++;
                    dataDetalleCotizacion.push({
                      idDetalleCotizacion: contador,
                      descCotizacion: 'Tramite',
                      nombre: 'Seguro',
                      elemento: idHistoricoPreciosRegistro,
                      valorElemento: this.seguro,
                    });
                    contador ++;
                    dataDetalleCotizacion.push({
                      idDetalleCotizacion: contador,
                      descCotizacion: 'Tramite',
                      nombre: 'Matricula',
                      elemento: (idHistoricoPreciosRegistro+1),
                      valorElemento: this.matricula,
                    });
    
                    var dataCotizacion = {
                      // data para la cotizacion
                      idCotizacion: idCotizacion,
                      fechaCotizacion: fecha,
                      vigencia: 30,
                      idCliente: this.idCliente,
                      idEmpleado: idEmpleado,
                      totalCotizacion: this.total,
    
                      //data para la tabla proceso
                      idProceso: idProceso,
                      descripcionProceso: 'Se realiza cotizacion',
                      idTipoProceso: 1,
    
                      //data detalles de la cotizacion
                      detallesCotizacion: JSON.stringify(dataDetalleCotizacion),
    
                      //data para los tramitees
                      idRegistro : idRegistro,
                      idHistoricoRegistro : idHistoricoPreciosRegistro,
                      seguro: this.seguro,
                      matricula: this.matricula
                    }
                    console.log(dataCotizacion);
                    this.oracle.postCotizacion(dataCotizacion)
                      .subscribe(responseEnviar => {
                        console.log(responseEnviar.text());
                        alert("Se registro la cotización exitosamente, por favor guarde el pdf.");
                        this.generarPDF(dataCotizacion);
                        this.router.navigate([""]);
                      });

                  });
                });
              });
          });

      });
  }

  generarPDF(data: any) {

    var pdfmaker = require('pdfmake/build/pdfmake.js');
    var pdfFonts = require('pdfmake/build/vfs_fonts.js');

    var body = [];

    var detalles = JSON.parse(data.detallesCotizacion);

    var fila = new Array();
    fila.push("Elemento");
    fila.push("Item");
    fila.push("Nombre Item");
    fila.push("Valor");
    body.push(fila);

    for (var i = 0; i < detalles.length; i++) {
      fila = new Array();
      var detalle = detalles[i];
      fila.push(detalle.idDetalleCotizacion);
      fila.push(detalle.descCotizacion);
      fila.push(detalle.nombre);
      fila.push(detalle.valorElemento);
      body.push(fila);
      if(i===0){
        for(var j = 0; j<this.partesAuto.length;j++){
          fila = new Array();
          var parte = this.partesAuto[j];
          fila.push("");
          fila.push("");
          fila.push(parte.PARTE);
          fila.push("");
          body.push(fila);
        }
      }
    }



    fila = new Array();
    fila.push("TOTAL");
    fila.push("");
    fila.push("");
    fila.push(this.total);
    body.push(fila);


    var contactos = "";
    for (var i = 0; i < this.contactosCliente.length; i++) {
      var contacto = this.contactosCliente[i];
      contactos += contacto.TIPO + ": " + contacto.CONTACTO + "\n"
    }


    //definicion del pdf
    var dd = {
      content: [
        { text: "CONCESIONARIO UD \n \n \n \n" },
        {
          text: "Formato de cotización \n \n \n",
          alignment: 'center',
        },
        {
          text: 'Consecutivo: ' + data.idCotizacion + ' \n \n'
        },
        {
          text: "Datos del cliente: \n"
            + "Número de identificación: " + this.idCliente + "\n"
            + "Nombre: " + this.cliente + "\n \n"
        },
        {
          text: "Contactos del cliente:\n"
            + contactos
            + "\n \n"
        },
        {
          text: "Detalles de la cotización \n \n",
          alignment: 'center'
        },
        {
          table:
            {
              headerRows: 1,
              widths: ['25%', '25%', '25%', '25%'],
              body: body
            }
        }
      ]
    };

    pdfmaker.vfs = pdfFonts.pdfMake.vfs;
    pdfmaker.createPdf(dd).download('cotizacion:' + data.idCotizacion + ',para cliente' + this.idCliente+".pdf");
  }

}
