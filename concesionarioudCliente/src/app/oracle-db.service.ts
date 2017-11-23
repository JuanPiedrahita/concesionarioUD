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
    }).toPromise();   
  }

  oraclePost(tabla, parametros){
    let body = new URLSearchParams(parametros).toString();
    return this.http.post(this.url+tabla,body,{
      headers: this.headers
    }).toPromise();
  }

  getEmpleados(){
    return this.oracleGet(this.empleado, null);
  }

  getEmpleado(id: number){
    return this.oracleGet(this.empleado, {id: id});
  }


  getLogin(user:string, pass: string){
    localStorage.setItem('user', user);
    localStorage.setItem('pass', pass);
    return this.oracleGet("login", null);
  }

}
