var http = require('http').createServer(handler);
var io = require('socket.io').listen(http);
var sys = require('sys');
var fs = require('fs');
var url = require('url');

var clients = [];
var time = '17:59';
var count=1020;
var padding;
var counter;
function handler(req, res) {
    var path = url.parse(req.url).pathname;
    var fsCallback = function(error, data) {
        if(error) throw error;

        res.writeHead(200);
        res.write(data);
        res.end();
    }

    switch(path) {
        case '/control':
            doc = fs.readFile(__dirname + '/control.html', fsCallback);
        break;
        default:
            doc = fs.readFile(__dirname + '/template.html', fsCallback);
        break;
    }
}

http.listen(80);



io.sockets.on('connection', function(socket) {


	clients.push(socket);
	
	socket.emit('welcome', {Now:time});
	
	
			 
	
});


var count = 1020;

setInterval(function() {
  count--;
  if (count < 1)
  {
     time="TIME UP";
	 clients.forEach(function(socket) 
	 {
	 	socket.emit('ressen', {Now:time,flash: 1});

	 	});
     return;
  }
  padding="";
 if (count%60 <10){
	 padding=0;
 } 
  time =Math.round((count/60)%60) +":"+padding+ count%60 ;
clients.forEach(function(socket) 
{
	socket.emit('ressen', {Now:time,flash: 0});

	});
  
}, 1000);

io.sockets.on('connection', function (socket) {
  socket.on('resrec', function (data) {
    count = (data.now-1)*60;
	clients.forEach(function(socket) 
	{
		socket.emit('ressen', {Now:time, flash: 0});
	
		});
    ;
  });
});
