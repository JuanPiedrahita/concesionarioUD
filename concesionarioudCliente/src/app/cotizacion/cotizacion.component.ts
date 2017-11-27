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

  constructor(private router:Router, private oracle: OracleDbService) { }

  documentoCliente = "";
  idCliente:number; 
  cliente:string = "";
  contactosCliente: any[];
  autos: any[];
  caracteristicasAuto: any[];
  partesAuto: any[];
  partesLujo: any[];
  vinAuto: number = 0;
  mostrarPartes: boolean = false;
  valorAuto = [];
  partesAgregadas: any[] = [];
  total: number = 0;
  parteLujoCarro: number;
  btnParteLujo: string = "Agregar";


  cambiarTexto(indice){
    var parte = (this.partesLujo[indice]);
    var esta = false;
    var index = -1;
    this.partesAuto.forEach(parteAuto => {
      if(parteAuto.ID==parte.ID){
        esta = true;
        index = this.partesAuto.indexOf(parteAuto);
      }
    });
    if(!esta){
      this.btnParteLujo="Agregar";
    }else{
      this.btnParteLujo="Eliminar";
    }
  }

  agregarParte(){
    var indice = this.parteLujoCarro;
    var parte = (this.partesLujo[indice]);
    var esta = false;
    var index = -1;
    this.partesAuto.forEach(parteAuto => {
      if(parteAuto.ID==parte.ID){
        esta = true;
        index = this.partesAuto.indexOf(parteAuto);
      }
    });
    if(!esta){
      this.partesAuto.push(parte);
      this.partesAgregadas.push(parte);
      this.total += parte.PRECIO;
    }else{
      this.partesAuto.splice(index,1);
      this.partesAgregadas.splice(this.partesAgregadas.indexOf(parte),1);
      this.total -= parte.PRECIO;
    }
    console.log(parte);
  }

  cotizarAuto(valor){
    this.mostrarPartes = false;
    this.oracle.getAutoCaracteristica(valor)
    .subscribe(response => {
      this.caracteristicasAuto = JSON.parse(response.text());
      this.oracle.getAutoParte(valor)
      .subscribe(responsePartes => {
        this.partesAuto = JSON.parse(responsePartes.text());
        this.oracle.getValorAuto(valor)
        .subscribe(responseValor =>{
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

    if(localStorage.getItem("user")==null){
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

  seleccionarCliente(){
    if(this.documentoCliente!=""){
      this.oracle.getCliente(parseInt(this.documentoCliente))
      .subscribe(cliente => {
        if(JSON.parse(cliente.text()).length !== 0){
          this.cliente = JSON.parse(cliente.text())[0].NOMBRE;
          this.idCliente = parseInt(this.documentoCliente);
          this.oracle.getContactossCliente(parseInt(this.documentoCliente))
          .subscribe(contactos => {
            this.contactosCliente = JSON.parse((contactos.text()));
          });
        }else{
          alert("El cliente no existe");
        }
      });
    }else{
      alert("Por favor dijite un documento para el cliente");
    }
  }


  registrarCotizacion(){
    this.oracle.getMaximo("cotizacion")
    .subscribe(response => {
      var idCotizacion = JSON.parse(response.text()).id;
      this.oracle.getEmpleado(localStorage.getItem("user"))
      .subscribe(empleado => {
        this.oracle.getMaximo("proceso")
        .subscribe(responseProceso =>{
          var idProceso = JSON.parse(responseProceso.text()).id;
          var fecha =new Date().toJSON().slice(0,10);
          var idEmpleado = JSON.parse(empleado.text())[0].IDEMPLEADO;
          var dataCotizacion = {
            idCotizacion : idCotizacion,
            fechaCotizacion : fecha,
            vigencia: 30,
            idCliente: this.idCliente,
            idEmpleado: idEmpleado,
            totalCotizacion: this.total
          }
          var dataDetalleCotizacion = [];
          dataDetalleCotizacion.push(JSON.stringify({
            idDetalleCotizacion: 1,
            descCotizacion: 'Valor del auto',
            idCotizacion: idCotizacion,
            elemento: this.valorAuto[0].ID,
            valorElemento : this.valorAuto[0].VALOR,
          }));
          var contador = 1;
          this.partesAgregadas.forEach(parte =>{
            contador ++;
            dataDetalleCotizacion.push(JSON.stringify(
              {
                idDetalleCotizacion: contador,
                descCotizacion: 'Valor parte',
                idCotizacion: idCotizacion,
                elemento: parte.ID,
                valorElemento: parte.PRECIO,
              }
            ));
          });
          var dataProceso = {
            idProceso : idProceso,
            descripcionProceso: 'Se realiza la cotizacion',
            idTipoProceso: 1,
            idCotizacion: idCotizacion,
            fechaProceso: fecha
          }
          this.oracle.postCotizacion(dataCotizacion)
          .subscribe(responseEnviar =>{
            console.log(responseEnviar.text());
          });
          console.log(dataCotizacion);
        });
      });
      
    });
  }

}
