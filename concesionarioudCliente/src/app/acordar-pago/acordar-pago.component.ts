import { Component, OnInit } from '@angular/core';
import { OracleDbService } from '../oracle-db.service';
import { forEach } from '@angular/router/src/utils/collection';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acordar-pago',
  templateUrl: './acordar-pago.component.html',
  styleUrls: ['./acordar-pago.component.scss']
})
export class AcordarPagoComponent implements OnInit {

  constructor(private router: Router,private oracle:OracleDbService) { }

  documentoCliente: number;
  cotizaciones: any[];
  detallesCotizacion: any[];
  modalidadesPago: any[];
  bancos: any[];
  cotizacion: number;
  mostarDetalles: boolean = false;
  dataCotizacion = {};
  valor30: number;
  valor70: number;
  modalidad30: number;
  modalidad70: number;
  porcentaje30: number;
  porcentaje70: number;
  total30: number;
  total70: number;
  acuerdo30: any[];
  acuerdo70: any[];
  total: number;
  contador30: number;
  contador70: number;
  banco30: number;
  banco70: number;

  ngOnInit() {
    this.cotizaciones = [];
    this.acuerdo30 = [];
    this.acuerdo70 = [];
    this.total30 = 0;
    this.total70 = 0;
    this.contador30 = 0;
    this.contador70 = 0;
    this.oracle.getModalidadPago()
    .subscribe(responseModalidades =>{
      this.modalidadesPago = JSON.parse(responseModalidades.text());
    });
    this.oracle.getBancos()
    .subscribe(responseBancos => {
      this.bancos = JSON.parse(responseBancos.text());
    });
  }

  agregarAcuerdo(){
    if(this.total30+this.total70===100){
      //se crea la data para el post del acuerdo
      var fecha = new Date().toJSON().slice(0, 10);

      var acuerdos = this.acuerdo30.concat(this.acuerdo70);
      for(var i=0; i<acuerdos.length; i++){
        acuerdos[i]["idAcuerdoPago"] = i+1;
      }

      var dataAcuerdos = {
        idCotizacion: this.cotizacion,
        idCliente: this.documentoCliente,
        fechaAcuerdoPago: fecha,
        acuerdos: JSON.stringify(acuerdos)
      }

      this.oracle.postAcuerdo(dataAcuerdos)
      .subscribe(responseAcuerdoPago => {
        alert("El acuerdo se registro exitosamente");
        this.router.navigate([""]);
        console.log(responseAcuerdoPago.text());
      });


      //se envia la data del post del acuerdo
    }else{
      alert("Aún no se ha acordado el 100% del pago ");
    }
  }


  eliminar70(indice){
    var iEliminar;
    for(var i = 0; i<this.acuerdo70.length;i++){
      if(this.acuerdo70[i].indice==indice){
        iEliminar = i;
        this.total70-=this.acuerdo70[i].porcentaje;
      }
    }
    this.acuerdo70.splice(iEliminar,1);
  }

  agregar70(){
    if(this.total70+this.porcentaje70<=70 && this.porcentaje70!==0){
      var nombreModalidad = "";
      var nombreBanco = "";
      var correoBanco = "";
      for(let modalidad of this.modalidadesPago){
        if(modalidad.IDMODALIDAD==this.modalidad70){
          nombreModalidad = modalidad.NOMBREMODALIDAD;
        }
      }
      if(this.modalidad70 == 1){
        for(let banco of this.bancos){
          if(this.banco70==banco.IDBANCO){
            nombreBanco = banco.NOMBREBANCO;
            correoBanco = banco.CORREOBANCO;
          }
        }
      }
      this.acuerdo70.push({
        indice: this.contador70,
        idModalidad: this.modalidad70,
        modalidad: nombreModalidad,
        porcentaje: this.porcentaje70,
        valor: this.porcentaje70*this.total/100,
        idBanco: this.banco70,
        nombreBanco: nombreBanco,
        correoBanco: correoBanco,
        partepct:70,
      });
      this.contador70++;
      this.total70 += this.porcentaje70;
      this.porcentaje70 = 0;
    }else{
      alert("El total supera el valor del 70");
    }
  }

  eliminar30(indice){
    var iEliminar;
    for(var i = 0; i<this.acuerdo30.length;i++){
      if(this.acuerdo30[i].indice==indice){
        iEliminar = i;
        this.total30-=this.acuerdo30[i].porcentaje;
      }
    }
    this.acuerdo30.splice(iEliminar,1);
  }

  agregar30(){
    if(this.total30+this.porcentaje30<=30 && this.porcentaje30!==0){
      var nombreModalidad = "";
      var nombreBanco = "";
      var correoBanco = "";
      for(let modalidad of this.modalidadesPago){
        if(modalidad.IDMODALIDAD==this.modalidad30){
          nombreModalidad = modalidad.NOMBREMODALIDAD;
        }
      }
      if(this.modalidad30 == 1){
        for(let banco of this.bancos){
          if(this.banco30==banco.IDBANCO){
            nombreBanco = banco.NOMBREBANCO;
            correoBanco = banco.CORREOBANCO;
          }
        }
      }
      this.acuerdo30.push({
        indice: this.contador30,
        idModalidad: this.modalidad30,
        modalidad: nombreModalidad,
        porcentaje: this.porcentaje30,
        valor: this.porcentaje30*this.total/100,
        idBanco: this.banco30,
        nombreBanco: nombreBanco,
        correoBanco: correoBanco,
        partepct:30,
      });
      this.contador30++;
      this.total30 += this.porcentaje30;
      this.porcentaje30 = 0;
    }else{
      alert("El total supera el valor del 30");
    }
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
      this.oracle.getCotizacionPago(this.documentoCliente).
      subscribe(responseCotizacion => {
        this.cotizaciones = JSON.parse(responseCotizacion.text());
        if(this.cotizaciones.length === 0){
          alert("El cliente digitado no tiene registrada ninguna cotización pendiente por acordar pago.");
        }
      });
    }else{
      alert("Ingrese el documento del cliente");
    }
  }
}
