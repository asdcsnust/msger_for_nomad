var express = require("express");
var routes = require("routes");
var http = require("http");
var path = require("path");
var mysql = require('mysql');
var connection = mysql.createConnection({
    host    :'localhost',
    port : 3306,
    user : 'root',
    password : '870218sg',
    database:'chatting'
});

connection.connect(function(err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }
});

var app = express();

app.use(express.static(path.join(__dirname, "public")));

var httpServer = http.createServer(app).listen(8081, function(req, res){
	console.log("Socket IO Server has been started");
});

var io = require("socket.io").listen(httpServer);

io.sockets.on("connection", function(socket){
	socket.emit("toclient", {msg: "welcome !"});
	socket.on("fromclient", function(data){
		console.log(data);
		socket.broadcast.emit("toclient", data);
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

		    socket.emit("toclient", data);
		});
		console.log("Message from client:" + data.msg);
	});
});
