var http = require('http');
var cookie = require('cookie');

http.createServer(function(request, response){
     //console.log(request.headers.cookie); // 쿠키가 문자열로 저장
     
     if(request.headers.cookie !== undefined){ // request 에 쿠키가 있을 시, 서버에서 읽는다. 
          var cookies = cookie.parse(request.headers.cookie); // cookies에는 쿠키가 객체로 저장
     }
     
    /*
     response.writeHead(200, {
         'Set-Cookie':[
              'yummy_cookie=choco', 
              'tasty_cookie=strawberry',
              `Permanent_cookie=test; Max-Age=${60*60*24*30}`
              ]
     });
     */
     
    response.end('Cookie!!');
}).listen(8080);