var http = require('http');
var fs = require('fs');
var url = require('url'); // url 모듈을 변수에 저장

var app = http.createServer(function(request,response){
    var _url = request.url;
    // _url(request.url) 에는 path 이하 주소가 들어감.
    //  ex ) http://localhost:3000/?id=HTML => request.url == /?id=HTML
    var queryData = url.parse(_url,true).query;
    // queryData 에는 쿼리스트링이 객체타입으로 저장됨
     
    
    //console.log(url.parse(_url,true));
    var pathname = url.parse(_url,true).pathname;
    
    if(pathname == '/'){ // 접속경로(path)가 루트라면..
       
        // data 폴더 안에 있는 파일목록(filelist)을 배열형식으로 불러옴.
        // filelist 를 동적으로 표현하기 위해 list 라는 변수 설정
        fs.readdir('./data', function(error, filelist){
            var list = '<ul>';
            var i=0;
            while(i < filelist.length){
                list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                i++;
            }
            list += '</ul>';
        
            fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
                if(queryData.id === undefined){ // 쿼리스트링이 없다면.. (= 홈페이지(WEB)에 접속했다면..)
            
                    var title = "Welcome";
                    description = "Hello, Node.js";
                }
        
                else{ // ?id=HTML,CSS,JavaScript 에 접속할 때
                    var title = queryData.id;
                }
          
                var template = `
                <!doctype html>
                <html>
                <head>
                    <title>WEB1 - ${title}</title>
                    <meta charset="utf-8">
                </head>
                <body>
                    <h1><a href="/">WEB</a></h1>
                    ${list}
                    <h2>${title}</h2>
                    <p>${description}</p>
                </body>
              </html>
              `;
              response.writeHead(200);
              response.end(template);
            });
        });
    } 
    
    else{ // 접속경로(path)가 루트가 아니라면..
      response.writeHead(404);
      response.end('Not found');
    }
    

});
app.listen(80);



