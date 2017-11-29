import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { HttpParams } from '@angular/common/http';
import { log } from 'util';

@Injectable()
export class OracleDbService {

  headers = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded',
  });

  url: string = "http://localhost:3030/";
  empleado: string = "empleado";
  login: string = "login";
  contactosCliente:string = "contacto";
  cliente: string = "cliente";  
  auto: string = "auto";
  autoCaracteristica: string = "autoCaracteristica";
  autoParte: string = "autoParte";
  valorAuto: string = "valorAuto";
  parteLujo: string = "parteLujo";
  maximo: string = "maximo";
  postCotizar: string = "postCotizacion";
  cotizacionPago: string = "cotizacionPago";
  estadoCotizacion: string = "estadoCotizacion";
  detallesCotizacion: string = "detallesCotizacion";
  modalidadPago: string = "modalidadPago";
  bancos:string = "bancos";
  postAcuerdoPago: string = "postAcuerdoPago";

  constructor(private http: Http) { }

  addUserParams(parametros: any){
    if(parametros==null){
      parametros = {};
    }
    parametros['user'] = {};
    parametros['pass'] = {};
    parametros.user = localStorage.getItem('user');
    parametros.pass = localStorage.getItem('pass');
    return parametros;
  }

  oracleGet(tabla: string,parametros: any){
    return this.http.get(this.url+tabla,{
      headers: this.headers,
      //params: (parametros!=null)?new URLSearchParams(this.addUserParams(parametros)).toString():'',
      params: new URLSearchParams(this.addUserParams(parametros)).toString(),
    });
    //}).toPromise();   
  }

  oraclePost(tabla, parametros){
    //let body = new URLSearchParams(parametros).toString();
    return this.http.post(this.url+tabla,parametros,{
      headers: this.headers,
      params: new URLSearchParams(this.addUserParams(parametros)).toString()
    });
    //}).toPromise();
  }

  postAcuerdo(parametro: any){
    return this.oraclePost(this.postAcuerdoPago, parametro);
  }

  postCotizacion(parametro: any){
    return this.oraclePost(this.postCotizar, parametro);
  }

  getEmpleados(){
    return this.oracleGet(this.empleado, null);
  }

  getCotizacionPago(id: number){
    return this.oracleGet(this.cotizacionPago, {idCliente: id});
  }

  getEmpleado(id: string){
    return this.oracleGet(this.empleado, {usuario: id});
  }

  getMaximo(tabla: string){
    return this.oracleGet(this.maximo, {tabla: tabla});
  }

  getAutoCaracteristica(id: number){
    return this.oracleGet(this.autoCaracteristica, {id: id});
  }

  getEstadoCotizacion(id: number){
    return this.oracleGet(this.estadoCotizacion, {id: id});
  }

  getDetallesCotizacion(id: number){
    return this.oracleGet(this.detallesCotizacion, {id: id});
  }

  getValorAuto(id: number){
    return this.oracleGet(this.valorAuto, {id: id});
  }

  getAutoParte(id: number){
    return this.oracleGet(this.autoParte, {id: id});
  }

  getAuto(){
    return this.oracleGet(this.auto, null);
  }

  getBancos(){
    return this.oracleGet(this.bancos, null);
  }

  getModalidadPago(){
    return this.oracleGet(this.modalidadPago, null);
  }

  getParteLujo(){
    return this.oracleGet(this.parteLujo, null);
  }

  getContactossCliente(idCliente: number){
    return this.oracleGet(this.contactosCliente, {id: idCliente});
  }

  getCliente(idCliente: number){
    return this.oracleGet(this.cliente, {id: idCliente});
  }


  getLogin(user:string, pass: string){
    localStorage.setItem('user', user);
    localStorage.setItem('pass', pass);
    return this.oracleGet("login", null);
  }

}
