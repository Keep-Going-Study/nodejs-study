var http = require('http');
//var fs = require('fs');
var url = require('url'); // url 모듈을 변수에 저장
var qs = require("querystring");

var template = require('./lib/template_module.js');
//var path = require('path');
//var sanitizeHTML = require("sanitize-html");

var db = require("./lib/db");
var topic = require("./lib/topic");



/* 리팩토링 이전 함수들 
function templateHTML(title, list, body, control){
    return `
            <!doctype html>
            <html>
            <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1><a href="/">WEB</a></h1>
                ${list}
                ${control}
                ${body}
            </body>
          </html>
          `;
}

// fs.readdir() 로 filelist 를 받아서 파라미터로 넘겨줌
// 파일목록을 출력
function templateList(filelist){
    var list = '<ul>';
    var i=0;
    while(i < filelist.length){
        list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i++;
    }
    list += '</ul>';
    
    return list;
}
*/

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
        
        db.query(`SELECT * FROM topic`, function(error,topics){
            if(error){
                throw error;
            }
            
            db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id],function(error2,topic){
                if(error2){
                    throw error2;
                }
                
               db.query('SELECT * FROM author', function(error3, authors){
                    
                    var list = template.List(topics);
                    var html = template.HTML(topic[0].title,list,` 
                    <form action="/update_process" method="post">
                     <input type="hidden" name="id" value="${topic[0].id}"> 
                      <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                      <p>
                        <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                      </p>
                      <p>
                        ${template.authorSelect(authors,topic[0].author_id)}
                      </p>
                      
                      <p>
                        <input type="submit">
                      </p>
                    </form>`,
                    `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`); 
                    // /update 뒤에 쿼리스트링을 붙힘으로써 각 페이지마다 독립적으로 update를 처리할 수 있음
                    // ex ) /update?id=1
                    
                response.writeHead(200);
                response.end(html);
               });
            });
            
        });
        
    }
    
    // /update_process 에선 /update 에서 사용자에게 받은 form 데이터를 백엔드 처리한다.
    else if(pathname === '/update_process'){ 
        var body = '';
        request.on('data', function(data){
            body += data;
        });
        request.on('end',function(){
            var post = qs.parse(body);  // 쿼리스트링을 객체 형식으로 리턴
            //console.log('body : ',body);
            //console.log('post : ',post);
            db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
                    [post.title, post.description, post.author ,post.id],
                    function(error,result){
                        response.writeHead(302, {Location: `/?id=${post.id}`});
                        response.end();
                    });
            
            
        });
    }
    else if(pathname === '/delete_process'){ // delete 처리
        var body = '';
        request.on('data', function(data){
            body += data;
        });
        request.on('end',function(){
            var post = qs.parse(body);  // 쿼리스트링을 객체 형식으로 리턴
            
            db.query('DELETE FROM topic WHERE id=?', [post.id], function(error,result){
                if(error){
                    throw error;
                }
                
                response.writeHead(302, {Location: `/`});
                response.end();
                
            });
        });
    }
    
    else{ // 접속경로(path)가 루트가 아니라면..
      response.writeHead(404);
      response.end('Not found');
    }
    

});
app.listen(8080);



