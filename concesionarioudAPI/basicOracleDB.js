var oracledb = require('oracledb');

connectionString = {
	user: "",
	password: "",
	connectString: "localhost/xe"
};

function error(err, rs, cn){
	if(err){
		console.log(err.message);
		rs.contentType('application/json').status(500);
		rs.send(err.message);
		if(cn!=null) close(cn);
		return -1;
				
	} else {
		return 0;
	}

}

function open(username,pass, sql, binds, dml, rs){

	//user credentias
	connectionString.user = username;
	connectionString.password = pass;

	//headers for response
	rs.header('Access-Control-Allow-Origin', '*'); 
  	rs.header('Access-Control-Allow-Methods', 'GET, POST');
  	rs.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

	oracledb.getConnection(connectionString, function(err,cn){

		if(error(err,rs,null)==-1) return;
		cn.execute(sql, binds, {autocommit: dml}, function(err,result){
			if(error(err,rs,cn)==-1) return;
			rs.contentType('application/json').status(200);
			console.log(sql)
			console.log(result.metaData);
			
			if(dml){
				rs.send(JSON.stringify(result.rowsAffected));
			}else{
				var rows = [];
				for(var i=0;i<result.rows.length;i++){
					var info = "{";
					for(var j=0;j<result.rows[i].length;j++){
						var valor =  (typeof result.rows[i][j] === "number")?  result.rows[i][j] : '"'+result.rows[i][j]+'"';
						var dato = '"'+result.metaData[j].name+'":'+valor;
						info = info+dato+",";
					}
					info = info.substring(0,info.length-1) + "}";
					rows.push(JSON.parse(info));
				}
				rs.send(rows);
			}
		});
	})

}


function close(cn){

	cn.release(
			function(err){
				if(err) {console.error(err.message);}
			}
		);

}

exports.open = open;
exports.close = close;