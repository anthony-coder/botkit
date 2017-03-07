var http = require('express');

var app = express();
app.get('/', function(req, res) {
res.send("Node-Express-Server-1");

});

//app.get('/


app.listen(3001);

http.createServer(function(req, res) {


res.writeHead(200, {'Content-Type': 'text/plain'});
res.end('Hello New York\n');
}).listen(3001);
console.log('Server running at http://localhost:3001/');
