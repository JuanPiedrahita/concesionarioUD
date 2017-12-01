### inserts

insert into cliente values (1,'juan','cubillos','david','calvachi','12/12/12');
insert into cliente values (2,'johan','perez','ricardo','figueroa','12/12/12');
insert into cliente values (3,'carlos','gutierrez','hernan','ardila','12/12/12');

insert into tipocontacto values (1,'telefono');
insert into tipocontacto values (2,'correo');
insert into tipocontacto values (3,'direccion');

insert into contacto values (1,'3125492286',1,1);
insert into contacto values (2,'3125492286',1,2);
insert into contacto values (3,'3125492286',1,3);

insert into contacto values (4,'juan.p15@hotmail.com',2,1);
insert into contacto values (5,'juan.p15@hotmail.com',2,2);
insert into contacto values (6,'juan.p15@hotmail.com',2,3);

insert into contacto values (7,'bariloche 2 suba',3,1);
insert into contacto values (8,'bariloche 2 suba',3,2);
insert into contacto values (9,'bariloche 2 suba',3,3);

insert into tipoCaracteristica values (1,'MARCA');
insert into tipoCaracteristica values (2,'CLASE VEHICULO');
insert into tipoCaracteristica values (3,'TIPO CARROCERIA');
insert into tipoCaracteristica values (4,'LINEA');
insert into tipoCaracteristica values (5,'MODELO');
insert into tipoCaracteristica values (6,'COLOR');
insert into tipoCaracteristica values (7,'TRANSMISION');
insert into tipoCaracteristica values (8,'COMBUSTIBLE');

insert into caracteristica (idCarac,descrCaracteristica,idTipoCarac) values (1,'renault',1);
insert into caracteristica values (2,'camioneta',2,1);
insert into caracteristica values (3,'deportivo',2,1);
insert into caracteristica values (4,'coupe',3,2);
insert into caracteristica values (5,'sedan',3,3);
insert into caracteristica values (6,'DE potencia',4,4);
insert into caracteristica values (7,'De velocida',4,5);
insert into caracteristica values (8,'2017',5,6);
insert into caracteristica values (9,'2017',5,7);
insert into caracteristica values (10,'negro',6,8);
insert into caracteristica values (11,'negro',6,9);
insert into caracteristica values (12,'manual',7,10);
insert into caracteristica values (13,'automatica',7,11);
insert into caracteristica values (14,'gasolina',8,12);
insert into caracteristica values (15,'acpm',8,13);

insert into auto values (111111,'12/12/12');
insert into auto values (222222,'12/12/12');
insert into auto values (333333,'12/12/12');

insert into autocaracteristica (idAuto,idCaracteristica) values (111111,1);
insert into autocaracteristica (idAuto,idCaracteristica) values (111111,2);
insert into autocaracteristica (idAuto,idCaracteristica) values (111111,4);
insert into autocaracteristica (idAuto,idCaracteristica) values (111111,6);
insert into autocaracteristica (idAuto,idCaracteristica) values (111111,8);
insert into autocaracteristica (idAuto,idCaracteristica) values (111111,10);
insert into autocaracteristica (idAuto,idCaracteristica) values (111111,12);
insert into autocaracteristica (idAuto,idCaracteristica) values (111111,14);
insert into autocaracteristica (idAuto,idCaracteristica) values (222222,1);
insert into autocaracteristica (idAuto,idCaracteristica) values (222222,2);
insert into autocaracteristica (idAuto,idCaracteristica) values (222222,4);
insert into autocaracteristica (idAuto,idCaracteristica) values (222222,6);
insert into autocaracteristica (idAuto,idCaracteristica) values (222222,8);
insert into autocaracteristica (idAuto,idCaracteristica) values (222222,10);
insert into autocaracteristica (idAuto,idCaracteristica) values (222222,12);
insert into autocaracteristica (idAuto,idCaracteristica) values (222222,14);
insert into autocaracteristica (idAuto,idCaracteristica) values (333333,1);
insert into autocaracteristica (idAuto,idCaracteristica) values (333333,3);
insert into autocaracteristica (idAuto,idCaracteristica) values (333333,5);
insert into autocaracteristica (idAuto,idCaracteristica) values (333333,7);
insert into autocaracteristica (idAuto,idCaracteristica) values (333333,9);
insert into autocaracteristica (idAuto,idCaracteristica) values (333333,11);
insert into autocaracteristica (idAuto,idCaracteristica) values (333333,13);
insert into autocaracteristica (idAuto,idCaracteristica) values (333333,15);

insert into histoPreciosAuto values (1, 'precio inicial', '12/12/12',111111,123.123);
insert into histoPreciosAuto values (2, 'precio inicial', '12/12/12',222222,123.123);
insert into histoPreciosAuto values (3, 'precio inicial', '12/12/12',333333,222.222);


##inserts de partes
insert into tipoParte values (1,'electrica');
insert into tipoParte values (2,'mecanica');
insert into tipoParte values (3,'accesorio');
insert into tipoParte values (4,'cojineria');

insert into parte values (1,'llanta','parte del vehiculo',2);
insert into parte values (2,'radio','parte del vehiculo',3);
insert into parte values (3,'defensa','parte del vehiculo',3);
insert into parte values (4,'espejo de lujo','parte del vehiculo',3);
insert into parte values (5,'asientos','parte del vehiculo',4);
insert into parte values (6,'luz delantera','parte del vehiculo',1);
insert into parte values (7,'pito','parte del vehiculo',1);
insert into parte values (8,'amortiguador','parte del vehiculo',2);
insert into parte values (9,'timon','parte del vehiculo',2);
insert into parte values (10,'bolsa de aire','parte del vehiculo',3);
insert into parte values (11,'vidrio polarizado','parte del vehiculo',3);
insert into parte values (13,'pantalla en asiento','parte del vehiculo',3);

insert into histoPrecioParte values (1,'precio inicial',1,10.20,'12/12/12');
insert into histoPrecioParte values (2,'precio inicial',2,20.20,'12/12/12');
insert into histoPrecioParte values (3,'precio inicial',3,10.20,'12/12/12');
insert into histoPrecioParte values (4,'precio inicial',4,20.20,'12/12/12');
insert into histoPrecioParte values (5,'precio inicial',5,10.20,'12/12/12');
insert into histoPrecioParte values (6,'precio inicial',6,20.20,'12/12/12');
insert into histoPrecioParte values (7,'precio inicial',7,10.20,'12/12/12');
insert into histoPrecioParte values (8,'precio inicial',8,20.20,'12/12/12');
insert into histoPrecioParte values (9,'precio inicial',9,10.20,'12/12/12');
insert into histoPrecioParte values (10,'precio inicial',10,10.20,'12/12/12');
insert into histoPrecioParte values (11,'precio inicial',11,10.20,'12/12/12');
insert into histoPrecioParte values (13,'precio inicial',13,10.20,'12/12/12');


##unir partes de auto  con auto
insert into parteAuto values (1,'necesario',111111,1,0);
insert into parteAuto values (2,'necesario',111111,3,0);
insert into parteAuto values (3,'necesario',111111,5,0);
insert into parteAuto values (4,'necesario',111111,6,0);
insert into parteAuto values (5,'necesario',111111,7,0);
insert into parteAuto values (6,'necesario',111111,8,0);
insert into parteAuto values (7,'necesario',111111,9,0);
insert into parteAuto values (8,'necesario',222222,1,0);
insert into parteAuto values (9,'necesario',222222,3,0);
insert into parteAuto values (10,'necesario',222222,5,0);
insert into parteAuto values (11,'necesario',222222,6,0);
insert into parteAuto values (12,'necesario',222222,7,0);
insert into parteAuto values (13,'necesario',222222,8,0);
insert into parteAuto values (14,'necesario',222222,9,0);
insert into parteAuto values (15,'necesario',333333,1,0);
insert into parteAuto values (16,'necesario',333333,3,0);
insert into parteAuto values (17,'necesario',333333,5,0);
insert into parteAuto values (18,'necesario',333333,6,0);
insert into parteAuto values (19,'necesario',333333,7,0);
insert into parteAuto values (20,'necesario',333333,8,0);
insert into parteAuto values (21,'necesario',333333,9,0);
insert into parteAuto values (22,'agregado en ensamble',111111,11,10.20);
insert into parteAuto values (23,'agregado en ensamble',111111,13,10.20);


insert into cargo values (1, 'vendedor');

insert into region values (1, 'central');

insert into empleado (idEmpleado,nombreEmpleado, ApellidoEmpleado,fechainicio,fechafin,salariobase, idcargo,idregion,usuario) values (1,'sebastian','bohorquez','12/12/12','13/12/12',0,1,1,'cod20141020036');


insert into tipoProceso values (1,'Cotizacion');
insert into tipoProceso values (2,'Acuerdo Pago');
insert into tipoProceso values (3,'Estudio credito');	
insert into tipoProceso values (4,'Credito Aprobado');	
insert into tipoProceso values (5,'Acuerdo Pago Credito');

##inserts into registro
insert into aseguradora values (1,'Seguros del estado',0);

insert into tipoRegistro values (1,'Tramite del seguro');
insert into tipoRegistro values (2,'Tramite de matricula');

insert into modalidaddepago values (1,'Crédito bancario','Crédito bancario');
insert into modalidaddepago values (2,'Crédito tarjeta','Crédito tarjeta');
insert into modalidaddepago values (3,'Efectivo tarjeta','Efectivo tarjeta');
insert into modalidaddepago values (4,'Efectivo','Efectivo');

insert into banco values (1,'Colpatria','juangonzalez1597@gmail.com');
insert into banco values (2,'Caja social','juangonzalez1597@gmail.com');
insert into banco values (3,'Bancolombia','juangonzalez1597@gmail.com');

insert into grupoFinanciero values (1,'Visa'); 
insert into grupoFinanciero values (2,'Master'); 

insert into tipoTarjeta values (1,'credito');
insert into tipoTarjeta values (2,'debito');

insert into tipoFactura values (1,'Factura por venta');

insert into factura values (1,'12/12/12',4,1,1,);



    