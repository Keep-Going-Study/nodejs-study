/*
var express = require('express');
var app = express();
console.log('process.env.PORT',process.env.PORT);
app.get('/',function(req,res){
    res.send('Hello World!');
})
app.listen(process.env.PORT , function(){
    console.log('Connected!!');
});
*/


var http = require('http');
var fs = require('fs');
var app = http.createServer(function(request,response){
var url = request.url;
if(request.url == '/'){
    url = '/index.html';
    }
if(request.url == '/favicon.ico'){
      response.writeHead(404);
      response.end();
      return;
    }
    
    response.writeHead(200);
    response.end(fs.readFileSync(__dirname + url));
 
});
app.listen(process.env.PORT);





