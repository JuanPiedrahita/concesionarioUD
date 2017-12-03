    // app.js  
  var express = require("express");
  var app = express();
  var bodyParser = require("body-parser");
  var methodOverride = require("method-override");
  var basicOracle = require("./basicOracleDB");
  var nodemailer = require('nodemailer');

    app.use(bodyParser.urlencoded({ extended:false }));
    app.use(bodyParser.json());
 // app.use(methodOverride());


//funcion para enviar un correo electronico
  var sendEmail = function(mailOptions) {  
    var promise = new Promise(function(resolve,reject){
      let transporter = nodemailer.createTransport({
      //parametros del correo institucional
      service: 'Gmail',
      auth: {
        user: 'consecionarioUD@gmail.com',
        pass: 'BASES1UD',
      }
    })

    //enviar correo
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) throw new Error(err)
      resolve("email enviado");
      console.log("email enviaod");
    })
    });
    return promise;
  }

  var router = express.Router();
  
  router.get('/empleado',function(request, response){
  	//console.log(request.query);
  	if(request.query.usuario!==undefined){
  		sql = "Select * from empleado  where usuario=:userEmpleado";
  		userEmpleado = request.query.usuario;
    	basicOracle.open(request.query.user,request.query.pass,sql,[userEmpleado],false,response)
  	}else{
  		sql = "Select * from s_emp";
    	basicOracle.open(request.query.user,request.query.pass,sql,[],false,response)
  	}
    response.end;
  });

  router.get('/contacto', function(request,response){
    sql = "Select upper(n.nombreTipoCont) tipo, d.descripcionContacto contacto from contacto d, tipoContacto n where n.idTipoContacto=d.idTipoContacto and idCliente=:id";
    id = request.query.id;
    basicOracle.open(request.query.user,request.query.pass,sql,[id],false,response);
    response.end;
  });

  router.get('/cliente', function(request,response){
    sql = "Select upper(primerNombre||' '||primerApellido) nombre from cliente where idCliente=:id";
    id = request.query.id;
    basicOracle.open(request.query.user,request.query.pass,sql,[id],false,response);
    response.end;
  });

  router.get('/autoCaracteristica', function(request,response){
    sql = "Select t.nombreTipoCarac tipo, c.descrCaracteristica descripcion from autoCaracteristica ac, caracteristica c, tipoCaracteristica t where t.idTipoCaracteristica=c.idTipoCarac and c.idCarac=ac.idCaracteristica and ac.idAuto=:id";
    id = request.query.id;
    basicOracle.open(request.query.user,request.query.pass,sql,[id],false,response);
    response.end;
  });

 router.get('/autoParte', function(request,response){
    sql = "Select p.idParte id, p.nombreParte parte, pa.precioparteauto precio from parte p, parteauto pa where pa.idParte=p.idparte and pa.idAuto=:id";
    id = request.query.id;
    basicOracle.open(request.query.user,request.query.pass,sql,[id],false,response);
    response.end;
  });

 router.get('/valorAuto', function(request,response){
    sql = "Select idHistoPreciosAuto id, precioAuto valor from histoPreciosAuto where idAuto=:id";
    id = request.query.id;
    basicOracle.open(request.query.user,request.query.pass,sql,[id],false,response);
    response.end;
  });


  router.get('/estadoCotizacion', function(request,response){
    var idCotizacion = request.query.id;
    //sql = "select t.nombretipoproceso estado from proceso p, tipoproceso t where t.idtipoproceso=p.idtipoproceso and rownum<=1 and idCotizacion=:idCotizacion order by p.idtipoproceso desc";
    sql = "select t.nombretipoproceso estado from proceso p, tipoproceso t where t.idtipoproceso=p.idtipoproceso and idCotizacion=:idCotizacion and p.activo like 'si'";
    basicOracle.open(request.query.user,request.query.pass,sql,[idCotizacion],false,response);
    response.end;
  });

  router.get('/detallesPagoTreinta', function(request,response){
    var idCotizacion = request.query.id;
    //sql = "select t.nombretipoproceso estado from proceso p, tipoproceso t where t.idtipoproceso=p.idtipoproceso and rownum<=1 and idCotizacion=:idCotizacion order by p.idtipoproceso desc";
    sql = "select m.nombremodalidad modalidaddepago, a.porcentaje porcentaje, a.valor valor, b.nombrebanco banco, a.idacuerdoPago idacuerdopago, b.idbanco idbanco, m.idmodalidad idmodalidad, nvl2(f.idacuerdopago,'TRUE','FALSE') pago from detallefactura f, modalidaddepago m, acuerdoPago a, banco b where f.idacuerdopago(+)=a.idacuerdopago and f.idCotizacion(+)=a.idCotizacion and b.idBanco=a.idBanco and m.idmodalidad=a.idmodalidaddepago and a.partepct=30 and a.valido='si' and a.idCotizacion=:idCotizacion and a.idBanco is not null union select m.nombremodalidad modalidaddepago, a.porcentaje porcentaje, a.valor valor, ' ' banco, a.idacuerdoPago idacuerdopago, 0 idbanco, m.idmodalidad idmodalidad, nvl2(f.idacuerdopago,'TRUE','FALSE') pago from detallefactura f, modalidaddepago m, acuerdoPago a where  f.idacuerdopago(+)=a.idacuerdopago and f.idCotizacion(+)=a.idCotizacion and m.idmodalidad=a.idmodalidaddepago and a.partepct=30 and a.valido='si' and a.idCotizacion=:idCotizacion and a.idBanco is null";
    basicOracle.open(request.query.user,request.query.pass,sql,[idCotizacion],false,response);
    response.end;
  });

  router.get('/detallesCotizacion', function(request,response){
    var idCotizacion = request.query.id;
    sql = "select * from detalleCotizacion where idCotizacion=:idCotizacion";
    basicOracle.open(request.query.user,request.query.pass,sql,[idCotizacion],false,response);
    response.end;
  });

 router.get('/parteLujo', function(request,response){
    sql = "select p.idParte id, p.nombreParte parte, h.precioParte precio from parte p, histoPrecioParte h, tipoParte tp where tp.idTipoParte=3 and tp.idTipoParte=p.idTipoParte and h.idParte=p.idParte";
    basicOracle.open(request.query.user,request.query.pass,sql,[],false,response);
    response.end;
  });

 router.get('/grupoFinanciero', function(request,response){
    sql = "select * from grupoFinanciero";
    basicOracle.open(request.query.user,request.query.pass,sql,[],false,response);
    response.end;
  });

 router.get('/tipoTarjeta', function(request,response){
    sql = "select * from tipoTarjeta";
    basicOracle.open(request.query.user,request.query.pass,sql,[],false,response);
    response.end;
  });

  router.get('/auto', function(request,response){
    sql = "select vim vin, nombreAuto nombre from auto";
    basicOracle.open(request.query.user,request.query.pass,sql,[],false,response);
    response.end;
  });

  router.get('/cotizacionPago', function(request,response){
    var cliente = request.query.idCliente;
    // select * from proceso where idcotizacion=194 and idTipoProceso=(select idtipoproceso from tipoproceso where nombreTipoProceso like 'Acuerdo Pago') and idProceso=(select max(idProceso) from proceso where idCotizacion=193)
    sql = "select * from cotizacion where idCliente=:cliente and (sysdate-fechacotizacion)<30 and idCotizacion in (select idcotizacion from proceso where idTipoProceso=(select idTipoproceso from tipoproceso where nombretipoproceso like 'Cotizacion') and activo like 'si')"
   // sql = "select * from cotizacion where idCliente=:cliente and (sysdate-fechacotizacion)<30";
    basicOracle.open(request.query.user,request.query.pass,sql,[cliente],false,response);
    response.end;
  });

  router.get('/cotizacionSeparar', function(request,response){
    var cliente = request.query.idCliente;
    // select * from proceso where idcotizacion=194 and idTipoProceso=(select idtipoproceso from tipoproceso where nombreTipoProceso like 'Acuerdo Pago') and idProceso=(select max(idProceso) from proceso where idCotizacion=193)
    sql = "select * from cotizacion where idCliente=:cliente  and idCotizacion in (select idcotizacion from proceso where idTipoProceso in (select idTipoproceso from tipoproceso where nombretipoproceso like 'Acuerdo Pago' or nombreTipoProceso like 'Acuerdo Pago Credito') and activo like 'si')"
   // sql = "select * from cotizacion where idCliente=:cliente and (sysdate-fechacotizacion)<30";
    basicOracle.open(request.query.user,request.query.pass,sql,[cliente],false,response);
    response.end;
  });

  router.get('/cotizacionCredito', function(request,response){
    var cliente = request.query.idCliente;
    // select * from proceso where idcotizacion=194 and idTipoProceso=(select idtipoproceso from tipoproceso where nombreTipoProceso like 'Acuerdo Pago') and idProceso=(select max(idProceso) from proceso where idCotizacion=193)
    sql = "select * from cotizacion where idCliente=:cliente  and idCotizacion in (select idcotizacion from proceso where idTipoProceso=(select idTipoproceso from tipoproceso where nombretipoproceso like 'Estudio credito') and activo like 'si')"
   // sql = "select * from cotizacion where idCliente=:cliente and (sysdate-fechacotizacion)<30";
    basicOracle.open(request.query.user,request.query.pass,sql,[cliente],false,response);
    response.end;
  });


  router.get('/maximo',function(request, response){
    tabla = request.query.tabla;
    if(tabla==="cotizacion"){
      sql = "select max(idCotizacion)+1 from cotizacion"; 
    }
    if(tabla==="proceso"){
      sql = "select max(idProceso)+1 from proceso"; 
    }
    if(tabla==="registro"){
      sql = "select max(idRegistro)+1 from registro"; 
    }
    if(tabla==="factura"){
      sql = "select max(idFactura)+1 from factura"; 
    }
    if(tabla==="preciosRegistro"){
      sql = "select max(idHistoricoPreciosReg)+1 from HistoricoPreciosReg";
    }
    basicOracle.getMaximo(request.query.user,request.query.pass,sql,response);
    response.end;
  });

  router.get('/modalidadPago',function(request, response){
      sql = "select * from modalidaddePago",
      basicOracle.open(request.query.user,request.query.pass,sql,[],false,response);
      response.end;
  });

  router.get('/bancos',function(request, response){
      sql = "select * from banco",
      basicOracle.open(request.query.user,request.query.pass,sql,[],false,response);
      response.end;
  });

  router.get('/login',function(request, response){
  		sql = "select user from dual",
  		basicOracle.open(request.query.user,request.query.pass,sql,[],false,response);
  		response.end;
  });

  router.post('/postCambiarEstado',function(request,response){
    console.log("params", request.query);
    response.header('Access-Control-Allow-Origin', '*'); 
    response.header('Access-Control-Allow-Methods', 'GET, POST');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    var fechaProceso = new Date();
    fechaProceso.setDate(fechaProceso.getDate()+1)

    var idCotizacion = parseInt(request.query.idCotizacion);

    var connection = basicOracle.getConnection(request.query.user, request.query.pass,response);
    connection.then(function(conexion){
      var sqlUpdateProceso = "update proceso set activo='no' where idcotizacion=:idCotizacion"; 
      var sqlCreditoAprobado = "insert into proceso values ((select max(idProceso)+1 from proceso), 'Se aprueba credito', (select idTipoproceso from Tipoproceso where nombreTipoProceso like 'Credito Aprobado'),:idCotizacion,:fechaProceso,'no')";
      var sqlAcuerdoPagoCredito = "insert into proceso values ((select max(idProceso)+1 from proceso), 'Confirma credito', (select idTipoproceso from Tipoproceso where nombreTipoProceso like 'Acuerdo Pago Credito'),:idCotizacion,:fechaProceso,'si')"; 
    
      basicOracle.insert(conexion,sqlUpdateProceso,[idCotizacion],response)
      .then(function(){
        basicOracle.insert(conexion,sqlCreditoAprobado,[idCotizacion,fechaProceso],response)
        .then(function(){
          basicOracle.insert(conexion,sqlAcuerdoPagoCredito,[idCotizacion,fechaProceso],response)
          .then(function(){
            basicOracle.insert(conexion,"commit",[],response).then(function(){
              basicOracle.close(conexion);
              response.contentType('application/json').status(200);
              response.send(JSON.stringify("Actualiza Registro"));  
            });    
          });
        });
      });

    });   
  });

  router.post('/postAcuerdoPago',function(request, response){
    console.log("params", request.query);
      response.header('Access-Control-Allow-Origin', '*'); 
      response.header('Access-Control-Allow-Methods', 'GET, POST');
      response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      var idCliente = parseInt(request.query.idCliente);
      var idCotizacion = parseInt(request.query.idCotizacion);
      var fechaAcuerdo = new Date(request.query.fechaAcuerdoPago);
      fechaAcuerdo.setDate(fechaAcuerdo.getDate()+1);
      var idProceso = request.query.idProceso;
      var acuerdos = JSON.parse(decodeURIComponent(request.query.acuerdos));
      console.log(acuerdos);

      var hayBanco = false;
      //inicia carga de los acuerdos
      var connection = basicOracle.getConnection(request.query.user, request.query.pass,response);
      connection.then(function(conexion){
        var promesas = [];
        for(var i = 0; i<acuerdos.length; i++){
          var acuerdo = acuerdos[i];
          var idAcuerdoPago = acuerdo.idAcuerdoPago;
          var idModalidadDePago = acuerdo.idModalidad;
          var porcentaje = acuerdo.porcentaje;
          var valor = parseFloat(acuerdo.valor).toFixed(2);
          console.log(valor)
          var partepct = acuerdo.partepct;

          var idBanco = acuerdo.idBanco;
          var nombreBanco = acuerdo.nombreBanco;
          var correoBanco = acuerdo.correoBanco;

          console.log("idBanco",idBanco);
          if(nombreBanco==='' || nombreBanco===undefined){
            var sentencia = "insert into acuerdoPago (idAcuerdoPago,fechaAcuerdo,idModalidadDePago,idCotizacion,porcentaje,valor,partepct,valido) values (:idAcuerdoPago,:fechaAcuerdo,:idModalidadDePago,:idCotizacion,:porcentaje,:valor,:partepct,'si')";
            promesas.push(
              basicOracle.insert(conexion,sentencia,[idAcuerdoPago,fechaAcuerdo,idModalidadDePago,idCotizacion,porcentaje,valor,partepct],response)
            );
          }else{
            hayBanco = true

            let mailOptions = {
              from: '<juangonzalez1597@gmail.com>',
              to: correoBanco,
              subject: nombreBanco+': Solicitud de credito cliente '+idCliente,
              html: '<h1> Señores '+nombreBanco+': </h1>' + '<h2> El cliente identificado con el numero '+idCliente+' solicita un credito por valor de '+valor+' </h2>'
            }            
            promesas.push(sendEmail(mailOptions));
            var sentencia = "insert into acuerdoPago (idAcuerdoPago,fechaAcuerdo,idBanco,idModalidadDePago,idCotizacion,porcentaje,valor,partepct,valido) values (:idAcuerdoPago,:fechaAcuerdo,:idBanco,:idModalidadDePago,:idCotizacion,:porcentaje,:valor,:partepct,'si')";
            promesas.push(
              basicOracle.insert(conexion,sentencia,[idAcuerdoPago,fechaAcuerdo,idBanco,idModalidadDePago,idCotizacion,porcentaje,valor,partepct],response)
            );
          }
        }
        Promise.all(promesas).then(function(){
          var sqlUpdateProceso = "update proceso set activo='no' where idcotizacion=:idCotizacion";
          if(!hayBanco){
            sqlUpdate = 
            sqlProceso = "insert into proceso values ((select max(idProceso)+1 from proceso),'Se acuerda pago',(select idtipoproceso from tipoproceso where nombreTipoProceso like 'Acuerdo Pago'), :idCotizacion,:fechaAcuerdo,'si')"
          }else{
            sqlProceso = "insert into proceso values ((select max(idProceso)+1 from proceso),'Se estudia credito',(select idtipoproceso from tipoproceso where nombreTipoProceso like 'Estudio credito'), :idCotizacion,:fechaAcuerdo,'si')"
          }
          basicOracle.insert(conexion,sqlUpdateProceso,[idCotizacion],response)
          .then(function(){
            basicOracle.insert(conexion, sqlProceso,[idCotizacion,fechaAcuerdo],response)
            .then(function(){
              basicOracle.insert(conexion,"commit",[],response).then(function(){
              basicOracle.close(conexion);
              response.contentType('application/json').status(200);
              response.send(JSON.stringify("Inserta Acuerdos de pago"));  
              });    
            });
          });
        });
      });
  });

  router.post('/postSepararAuto',function(request,response){
    console.log("params", request.query);
    response.header('Access-Control-Allow-Origin', '*'); 
    response.header('Access-Control-Allow-Methods', 'GET, POST');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    var idCotizacion = parseInt(request.query.idCotizacion);
    var idFactura = parseInt(request.query.idFactura);
    var fechaSeparar = new Date(request.query.fechaSeparar);    
    fechaSeparar.setDate(fechaSeparar.getDate()+1);
    var idCliente = parseInt(request.query.idCliente);
    var totalFactura = parseFloat(request.query.totalFactura).toFixed(3);
    var empleado = request.query.user;
    console.log('empelado', empleado);
    var detallesSeparar = JSON.parse(decodeURIComponent(request.query.detallesSeparar));
    var histopartes = JSON.parse(decodeURIComponent(request.query.partes));
    var idStockAuto = parseInt(request.query.idStockAuto);
    var idStockParte = parseInt(request.query.idStockParte);
    var histoAuto = parseInt(request.query.histoAuto);
    console.log("detalles",detallesSeparar);    

    var connection = basicOracle.getConnection(request.query.user, request.query.pass,response);
    connection.then(function(conexion){
      sqlFactura = "insert into factura (idFactura, fechaFacturado, idCotizacion,idCliente, idTipoFactura, idEmpleado,totalFactura) values (:idFactura,:fechaSeparar,:idCotizacion,:idCliente,1,(select idEmpleado from empleado where usuario=:empleado),:totalFactura)";
      basicOracle.insert(conexion,sqlFactura,[idFactura,fechaSeparar,idCotizacion,idCliente,empleado,totalFactura],response)
      .then(function(){
        
        var promesas = [];
        for(var i=0;i<detallesSeparar.length;i++){
          var detalle = detallesSeparar[i];
          var idAcuerdo = detalle.IDACUERDOPAGO;
          var porcentaje = detalle.PORCENTAJE;
          var valor = detalle.VALOR;
          var idBanco = detalle.IDBANCO;
          var idGrupoFinanciero = detalle.grupoFinanciero;
          var idTipoTarjeta = detalle.tipoTarjeta;
          var idModalidad = detalle.IDMODALIDAD;
          //actualizar los valores del acuerdo de pago, banco y tarjetas
          var sqlUpdateAcuerdo = "";
          if(idModalidad==1){
            sqlUpdateAcuerdo = "update acuerdopago set porcentaje=:porcentaje, valor=:valor, idBanco=:idBanco where idCotizacion=:idCotizacion and idAcuerdoPago=:idAcuerdo";
            promesas.push(
               basicOracle.insert(conexion,sqlUpdateAcuerdo,[porcentaje,valor,idBanco,idCotizacion,idAcuerdo],response)
            );
          }
          if(idModalidad==2 || idModalidad==3){
            sqlUpdateAcuerdo = "update acuerdopago set porcentaje=:porcentaje, valor=:valor, idGrupoFin=:idGrupoFinanciero, idTipoTarjeta=:idTipoTarjeta where idCotizacion=:idCotizacion and idAcuerdoPago=:idAcuerdo"
            promesas.push(
               basicOracle.insert(conexion,sqlUpdateAcuerdo,[porcentaje,valor,idGrupoFinanciero,idTipoTarjeta,idCotizacion,idAcuerdo],response)
            );
          }
          //insertar detalles de la factura
          sqlDetalleFactura = "insert into detallefactura values (:idAcuerdo,'Paga 30',:idFactura,:idAcuerdo,:idCotizacion,:valor)";
          promesas.push(
               basicOracle.insert(conexion,sqlDetalleFactura,[idAcuerdo,idFactura,idAcuerdo,idCotizacion,valor],response)
          );
        }
        Promise.all(promesas).then(function(){
          promesas = []
          //Separar auto en el stock
          sqlStockAuto = "insert into stockautos values ((select nvl(max(idstockautos)+1,1) from stockautos),1,1,:idFactura,(select idtipoMovimientos from tipomovimientos where nombretipomov like 'Separado'),(select idAuto from histoPreciosAuto where idHistoPreciosAuto=:histoAuto),(select idEstadoStock from estadoStock where descEstadoStock like 'Separado'))";
        
          promesas.push(
            basicOracle.insert(conexion,sqlStockAuto,[idFactura,histoAuto],response)
          );
          //Separar partes en el stock si hay
          for(var i=0;i<histopartes.length;i++){
            parte = histopartes[i];
            sqlStockParte = "insert into stockParte values ((select nvl(max(idStockParte)+1,1) from stockparte),1,1,:idFactura,(select idtipoMovimientos from tipomovimientos where nombretipomov like 'Separado'),(select idParte from histoPrecioParte where idHistoPreParte=:parte),(select idEstadoStockParte from EstadoStockParte where descEstadoStockParte like 'Separado'))";
            promesas.push(
              basicOracle.insert(conexion,sqlStockParte,[idFactura,parte],response)
            );
          }

          Promise.all(promesas).then(function(){
            //Se incluyen registro de auto separado
            var sqlUpdateProceso = "update proceso set activo='no' where idcotizacion=:idCotizacion"; 
            var sqlAutoSeparado = "insert into proceso values ((select max(idProceso)+1 from proceso), 'Se separa auto', (select idTipoproceso from Tipoproceso where nombreTipoProceso like 'Auto Separado'),:idCotizacion,:fechaSeparar,'si')";
            basicOracle.insert(conexion,sqlUpdateProceso,[idCotizacion],response)
            .then(function(){

              basicOracle.insert(conexion,sqlAutoSeparado,[idCotizacion,fechaSeparar],response)
              .then(function(){
                basicOracle.insert(conexion,"commit",[],response)
                .then(function(){
                  basicOracle.close(conexion);
                  response.contentType('application/json').status(200);
                  response.send(JSON.stringify("Separa auto")); 
                });
              });

            });
          });
        });
    
      }); 
    });
  });

  router.post('/postCotizacion', function(request, response){
      //console.log("body");
      console.log("params", request.query);
      response.header('Access-Control-Allow-Origin', '*'); 
      response.header('Access-Control-Allow-Methods', 'GET, POST');
      response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      var idCotizacion = parseInt(request.query.idCotizacion);
      var fechaCotizacion = new Date(request.query.fechaCotizacion);
      fechaCotizacion.setDate(fechaCotizacion.getDate()+1);
      var vigencia = parseInt(request.query.vigencia);
      var idCliente = parseInt(request.query.idCliente);
      var idEmpleado = parseInt(request.query.idEmpleado);
      var totalCotizacion = parseFloat(request.query.totalCotizacion);

      var idProceso = parseInt(request.query.idProceso);
      var descripcionProceso = request.query.descripcionProceso;
      var idTipoProceso = parseInt(request.query.idTipoProceso);

      //detalles de registro 
      var idSeguro = parseInt(request.query.idRegistro);
      var idHistoricoSeguro = parseInt(request.query.idHistoricoRegistro);
      var idMatricula = idSeguro+1;
      var idHistoricoMatricula = idHistoricoSeguro + 1;
      var seguro = parseFloat(request.query.seguro);
      var matricula = parseFloat(request.query.matricula);
 
      // array de detalles
      var arrDet = JSON.parse(decodeURIComponent(request.query.detallesCotizacion));
      console.log("detalles",arrDet);


      var connection = basicOracle.getConnection(request.query.user, request.query.pass,response);
      connection.then(function(conexion){
         sql1 = "insert into cotizacion values (:idCotizacion,:fechaCotizacion,:vigencia,:idCliente,:idEmpleado,:totalCotizacion)";
         sql2 = "insert into proceso values (:idProceso, :descripcionProceso, :idTipoProceso,:idCotizacion,:fechaCotizacion,'si')";
         sqlseguro = "insert into registro (idRegistro,idTipoRegistro,idAseguradora,idCotizacion,idAsesor) values (:idSeguro,1,1,:idCotizacion,:idEmpleado)";
         sqlMatricula = "insert into registro (idRegistro, idTipoRegistro,idCotizacion,idAsesor) values (:idMatricula,2,:idCotizacion,:idEmpleado)" ;
         sqlHistoricoSeguro = "insert into HistoricoPreciosReg values (:idHistoricoSeguro,'Valor seguro acordado',:idSeguro,:seguro)";
         sqlHistoricoMatricula = "insert into HistoricoPreciosReg values (:idHistoricoMatricula,'Valor matricula acordado',:idMatricula,:matricula)";
         basicOracle.insert(conexion, sql1,[idCotizacion,fechaCotizacion,vigencia,idCliente,idEmpleado,totalCotizacion],response)
         .then(function(){

            basicOracle.insert(conexion,sql2,[idProceso,descripcionProceso,idTipoProceso,idCotizacion,fechaCotizacion],response).
            then(function(){

                  basicOracle.insert(conexion,sqlseguro,[idSeguro,idCotizacion,idEmpleado],response).
                  then(function(){

                    basicOracle.insert(conexion,sqlMatricula,[idMatricula,idCotizacion,idEmpleado],response)
                    .then(function(){

                      basicOracle.insert(conexion,sqlHistoricoSeguro,[idHistoricoSeguro,idSeguro,seguro], response)
                      .then(function(){

                        basicOracle.insert(conexion,sqlHistoricoMatricula,[idHistoricoMatricula,idMatricula,matricula], response)
                        .then(function(){

                          var promesas = [];
                          for(var i = 0; i<arrDet.length; i++){
                            var detalle = arrDet[i];
                            var idDetalleCotizacion = detalle.idDetalleCotizacion;
                            var descCotizacion = detalle.descCotizacion;
                            var elemento = detalle.elemento;
                            var valorElemento = detalle.valorElemento; 
                            var nombreDetalle = detalle.nombre;
                            var sentencia = "insert into detalleCotizacion values (:idDetalleCotizacion,:descCotizacion,:idCotizacion,:elemento,:valorElemento,:nombreDetalle)";
                            promesas.push(
                              basicOracle.insert(conexion,sentencia,[idDetalleCotizacion,descCotizacion,idCotizacion,elemento,valorElemento,nombreDetalle],response)
                            );
                            console.log("detalle",arrDet[i])
                          }
                          Promise.all(promesas).then(function(){
                            basicOracle.insert(conexion,"commit",[],response).then(function(){
                              basicOracle.close(conexion);
                              response.contentType('application/json').status(200);
                              response.send(JSON.stringify("Inserta contizacion"));   
                            });      
                          });

                        });

                      });

                    });

                  });

            });
         });
      });
     // basicOracle.insert(request.query.user,request.query.pass, sql,[idCotizacion,fechaCotizacion,vigencia,idCliente,idEmpleado,totalCotizacion],response);
  });

  //router.post('/login', function(request, response){
  //	console.log("piden usuario");
  //	console.log(request.body);

  //	response.header('Access-Control-Allow-Origin', '*'); 
  //	response.header('Access-Control-Allow-Methods', 'GET, POST');
  //	response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  //	response.contentType('application/json').status(200);
  //	response.send(JSON.stringify("Piden susuario"));
  //});

  
  router.get('*', function(request, response){
    response.header('Access-Control-Allow-Origin', '*'); 
    response.header('Access-Control-Allow-Methods', 'GET, POST');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    response.sendStatus(404);
    response.end;
  });

  app.use(router);

  var server = app.listen(3030, function () {
    "use strict";

    var host = server.address().address,
        port = server.address().port;

    console.log(' Server is listening at http://%s:%s', host, port);
});

  //cabeceras
  //response.header('Access-Control-Allow-Origin', '*'); 
  //response.header('Access-Control-Allow-Methods', 'GET, POST');
  //response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
   