var http = require('http');
var fs = require('fs');
var url = require('url'); // url 모듈을 변수에 저장

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    // queryData 에는 쿼리스트링이 객체타입으로 저장됨
    var title = queryData.id; // 코드 가독성을 위해 title 변수 추가선언
    
    console.log(url.parse(_url,true));
    var pathname = url.parse(_url,true).pathname;
    
    if(pathname == '/'){ // 접속경로가 루트라면
      fs.readFile(`data/${queryData.id}`,'utf8',function(err,description){
        var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            <ol>
              <li><a href="/?id=HTML">HTML</a></li>
              <li><a href="/?id=CSS">CSS</a></li>
              <li><a href="/?id=JavaScript">JavaScript</a></li>
            </ol>
            <h2>${title}</h2>
            <p>${description}</p>
          </body>
          </html>
          `;
        response.writeHead(200);
        response.end(template); 
    });
    } else{
      response.writeHead(404);
      response.end('Not found');
    }
    

});
app.listen(80);



