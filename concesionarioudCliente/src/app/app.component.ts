import { Component } from '@angular/core';
import { OracleDbService } from './oracle-db.service'
import { log } from 'util';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit{

  ngOnInit(): void {

  }

  user = {
    name: "",
    pass: "",
  };
  logged = false;
  title = 'Concesionario UD';

  hora = new Date();


  constructor(private oracle: OracleDbService) {
    setInterval(() => {
      this.hora = new Date();
    }, 1);
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("pass");
    this.logged = false;
  }

  login() {
    this.oracle.getLogin(this.user.name, this.user.pass).toPromise()
      .then((res: any) => {
        this.logged = true;
      })
      .catch(() => {
        this.logged = false;
        localStorage.removeItem("user");
        localStorage.removeItem("pass");
        alert("Usuario/contraseña erroneos");
      });
    this.user.name = "";
    this.user.pass = "";
  }


}
