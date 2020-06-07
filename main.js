var http = require('http');
//var fs = require('fs');
var url = require('url'); // url 모듈을 변수에 저장
var qs = require("querystring");

var template = require('./lib/template_module.js');
//var path = require('path');
//var sanitizeHTML = require("sanitize-html");

var db = require("./lib/db");
var topic = require("./lib/topic");
var author = require('./lib/author');

var app = http.createServer(function(request,response){
    var _url = request.url;
    // _url(request.url) 에는 path 이하 주소가 들어감.
    //  ex ) http://localhost:3000/?id=HTML => request.url == /?id=HTML
    var queryData = url.parse(_url,true).query;
    // queryData 에는 쿼리스트링이 객체타입으로 저장됨
    // { id : 'HTML' }
     
    
    //console.log(url.parse(_url,true));
    var pathname = url.parse(_url,true).pathname;
    
    if(pathname == '/'){ // 접속경로(path)가 루트라면..
       
        // 쿼리스트링의 id 값이 없을 때 ( = 메인페이지에 접속했을 때)
        if(queryData.id === undefined){ 
            topic.home(request, response);
        }
        
        // 쿼리스트링의 id 값이 있을 때 ( = 컨텐츠페이지에 접속했을 때)
        // ( ex. ?id=HTML,CSS,JavaScript ) 
        else{
            topic.page(request, response);
        }
    }
    
    // /create 페이지에선 /create_process 로 넘길 form을 생성한다.  
    else if(pathname === '/create'){ // 접속경로가 create 일 때..
        topic.create(request, response);
    }
    
    // /create_process 에선 /create 에서 사용자에게 받은 form 데이터를 백엔드 처리한다.
    else if(pathname === '/create_process'){
        topic.create_process(request, response);
    }
    
    // /update 페이지에선 /update_process 로 넘길 form을 생성한다.  
    else if(pathname === '/update'){
        topic.update(request, response);
    }
    
    // /update_process 에선 /update 에서 사용자에게 받은 form 데이터를 백엔드 처리한다.
    else if(pathname === '/update_process'){ 
        topic.update_process(request, response);
    }
    
    else if(pathname === '/delete_process'){ // delete 처리
        topic.delete_process(request, response);
    }
    
    // 저자관리 페이지
    else if(pathname === '/author'){
        author.home(request, response);
    }
    
    else{ // 접속경로(path)가 루트가 아니라면..
      response.writeHead(404);
      response.end('Not found');
    }
    

});
app.listen(8080);



