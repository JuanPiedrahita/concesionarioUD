import { Component } from '@angular/core';
import { OracleDbService } from './oracle-db.service'
import { log } from 'util';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  user = {
    name: "",
    pass: "",
  };
  logged = false;
  title = 'Concesionario UD';
  

  constructor(private oracle: OracleDbService){  }

  logout(){
    localStorage.removeItem("user");
    localStorage.removeItem("pass");
    this.logged = false;
  }

  login() {
    this.oracle.getLogin(this.user.name, this.user.pass)
    .then((res: any) => {
        this.logged = true;
    })
    .catch(()=>{
      this.logged = false;
      localStorage.removeItem("user");
      localStorage.removeItem("pass");
      alert("Usuario/contraseña erroneos");
    });
    this.user.name = "";
    this.user.pass = "";
  }

}
