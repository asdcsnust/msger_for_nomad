var express = require("express");
var routes = require("routes");
var http = require("http");
var path = require("path");
/*
var mysql = require('mysql');
var connection = mysql.createConnection({
    host    :'localhost',
    port : 3306,
    user : 'root',
    password : '',
    database:'chatting'
});
*/
/*
connection.connect(function(err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }
});
*/
var app = express();

app.use(express.static(path.join(__dirname, "public")));

var httpServer = http.createServer(app).listen(8081, function(req, res){
	console.log("Socket IO Server has been started");
});

var io = require("socket.io").listen(httpServer);

io.sockets.on("connection", function(socket){
	socket.on("fromclient", function(data){
	  data.msg = '[' + getTime() + '] ' + data.msg;
		socket.broadcast.emit("toclient", data);
		/*
		var separated_str_arr = data.msg.split(":");
		var insert_data = {
			text: separated_str_arr[1],
			created_user: separated_str_arr[0]
		}
		var query = connection.query('insert into chatting_log set ?',insert_data,function(err,result){
			if (err) {
			    console.error(err);
			        throw err;
			}
		    console.log(query);
		    
		});
*/
		console.log("data : ", data);
		socket.emit("toclient", data);
		console.log("Message from client:" + data.msg);
	});
	socket.on('disconnect', function(reason){
		console.log("reason : " + reason +"id: "+ this.id);
	});
});

function getTime(){
  const d = new Date(); // if server uses utc time
  const offset = d.getTimezoneOffset() / 60;
  const dArr = [d.getHours() - offset, d.getMinutes(), d.getSeconds()];
  dArr.forEach((d,i)=>dArr[i]=make2Digit(d));
  return dArr.join(":");
}
function make2Digit(num){
  return ("0" + num).slice(-2);
}