import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.scss']
})
export class CotizacionComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
    if(localStorage.getItem("user")==null){
      this.router.navigate([""]);
  }
  }

}
