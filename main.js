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
var url = require('url'); // url 모듈을 변수에 저장

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    // queryData 에는 쿼리스트링이 객체타입으로 저장됨
    console.log(queryData.id);
    if(_url == '/'){
        _url = '/index.html';
        }
    if(_url == '/favicon.ico'){
          response.writeHead(404);
          response.end();
          return;
        }
    response.writeHead(200);
    response.end(queryData.id);
 
});
app.listen(80);



