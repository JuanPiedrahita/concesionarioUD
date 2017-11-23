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
  	if(request.query.id!==undefined){
  		sql = "Select * from s_emp  where id=:idEmpleado";
  		idEmpleado = request.query.id;
    	basicOracle.open(request.query.user,request.query.pass,sql,[idEmpleado],false,response)
  	}else{
  		sql = "Select * from s_emp";
    	basicOracle.open(request.query.user,request.query.pass,sql,[],false,response)
  	}
    response.end;
  });

  router.get('/login',function(request, response){
  		sql = "select user from dual",
  		basicOracle.open(request.query.user,request.query.pass,sql,[],false,response);
  		response.end;
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
   