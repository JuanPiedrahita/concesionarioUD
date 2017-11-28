    // app.js  
  var express = require("express");
  var app = express();
  var bodyParser = require("body-parser");
  var methodOverride = require("method-override");
  var basicOracle = require("./basicOracleDB");

  app.use(bodyParser.urlencoded({ extended:false }));
  app.use(bodyParser.json());
 // app.use(methodOverride());

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



 router.get('/parteLujo', function(request,response){
    sql = "select p.idParte id, p.nombreParte parte, h.precioParte precio from parte p, histoPrecioParte h, tipoParte tp where tp.idTipoParte=3 and tp.idTipoParte=p.idTipoParte and h.idParte=p.idParte";
    basicOracle.open(request.query.user,request.query.pass,sql,[],false,response);
    response.end;
  });

  router.get('/auto', function(request,response){
    sql = "select vim vin, nombreAuto nombre from auto";
    basicOracle.open(request.query.user,request.query.pass,sql,[],false,response);
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
    basicOracle.getMaximo(request.query.user,request.query.pass,sql,response);
    response.end;
  });

  router.get('/login',function(request, response){
  		sql = "select user from dual",
  		basicOracle.open(request.query.user,request.query.pass,sql,[],false,response);
  		response.end;
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

      // array de detalles
      var arrDet = JSON.parse(decodeURIComponent(request.query.detallesCotizacion));
      console.log("detalles",arrDet);

      

      var connection = basicOracle.getConnection(request.query.user, request.query.pass,response);
      connection.then(function(conexion){
         sql1 = "insert into cotizacion values (:idCotizacion,:fechaCotizacion,:vigencia,:idCliente,:idEmpleado,:totalCotizacion)";
         sql2 = "insert into proceso values (:idProceso, :descripcionProceso, :idTipoProceso,:idCotizacion,:fechaCotizacion)";
         basicOracle.insert(conexion, sql1,[idCotizacion,fechaCotizacion,vigencia,idCliente,idEmpleado,totalCotizacion],response)
         .then(function(){
            basicOracle.insert(conexion,sql2,[idProceso,descripcionProceso,idTipoProceso,idCotizacion,fechaCotizacion],response).
            then(function(){

                  var promesas = [];
                  for(var i = 0; i<arrDet.length; i++){
                    var detalle = arrDet[i];
                    var idDetalleCotizacion = detalle.idDetalleCotizacion;
                    var descCotizacion = detalle.descCotizacion;
                    var elemento = detalle.elemento;
                    var valorElemento = detalle.valorElemento; 
                    var sentencia = "insert into detalleCotizacion values (:idDetalleCotizacion,:descCotizacion,:idCotizacion,:elemento,:valorElemento)";
                    promesas.push(
                      basicOracle.insert(conexion,sentencia,[idDetalleCotizacion,descCotizacion,idCotizacion,elemento,valorElemento],response)
                    );
                    console.log("detalle",arrDet[i])
                  }
                  Promise.all(promesas).then(function(){
                    basicOracle.insert(conexion,"commit",[],response).then(function(){
                      response.contentType('application/json').status(200);
                      response.send(JSON.stringify("Inserta contizacion"));   
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
   