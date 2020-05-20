var http = require('http');
var fs = require('fs');
var url = require('url'); // url 모듈을 변수에 저장
var qs = require("querystring");

var template = require('./lib/template_module.js');
var path = require('path');
var sanitizeHTML = require("sanitize-html");


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
     
    
    //console.log(url.parse(_url,true));
    var pathname = url.parse(_url,true).pathname;
    
    if(pathname == '/'){ // 접속경로(path)가 루트라면..
       
        // data 폴더 안에 있는 파일목록(filelist)을 배열형식으로 불러옴.
        // filelist 를 동적으로 표현하기 위해 list 라는 변수 설정
        fs.readdir('./data', function(error, filelist){
            var list = template.List(filelist); 
            //console.dir(path.parse(`${queryData.id}`));
            var filteredId = path.parse(`${queryData.id}`).base;
            // 입력정보에 대한 보안 설정(부모디렉토리로 못가게함)
        
            fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
                if(queryData.id === undefined){ // 쿼리스트링이 없다면.. (= 홈페이지(WEB)에 접속했다면..)
            
                    var title = "Welcome";
                    description = "Hello, Node.js";
                    var html = template.HTML(title,list,`<h2>${title}</h2>${description}`,
                        `<a href="/create">create</a>`);
                    // 홈페이지에선 create 버튼만 보이게끔
                }
        
                else{ // 컨텐츠페이지( ex. ?id=HTML,CSS,JavaScript ) 에 접속할 때
                    var title = queryData.id;
                    
                    // sanitize-html 모듈 사용
                    // 사용자가 컨텐츠에 <script> 같은 위험성 있는 태그를 입력하면
                    // 출력 시 <script> 태그를 검열삭제한다.
                    var sanitizedTitle = sanitizeHTML(title);
                    var sanitizedDescription = sanitizeHTML(description, {
                        allowedTags:['h1']
                    }); // h1 태그는 allow 시킴
                    
                    var html = template.HTML(sanitizedTitle,list,`<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                        `<a href="/create">create</a> 
                        <a href="/update?id=${sanitizedTitle}">update</a>
                        <form action="/delete_process" method="post" 
                                onsubmit='return confirm("삭제하시겠습니까?")'>
                            <input type="hidden" name="id" value="${sanitizedTitle}">
                            <input type="submit" value="delete">
                        </form>
                        `
                    );
                    // 컨텐츠 페이지에선 create 와 update 링크가 보이게끔
                    // delete 버튼도 보이게끔함.
                }
          
                
                response.writeHead(200);
                response.end(html);
            });
        });
    }
    else if(pathname === '/create'){ // 접속경로가 create 일 때..
        
        // data 폴더 안에 있는 파일목록(filelist)을 배열형식으로 불러옴.
        // filelist 를 동적으로 표현하기 위해 list 라는 변수 설정
        fs.readdir('./data', function(error, filelist){
            var list = template.List(filelist);
            var title = 'WEB - create';
            var html = template.HTML(title,list,`
                <form action="/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
            `,``);
            response.writeHead(200);
            response.end(html);
            
        });
    }
    else if(pathname === '/create_process'){
        var body = '';
        request.on('data', function(data){
            body += data;
        });
        request.on('end',function(){
            var post = qs.parse(body);
            //console.log(post);
            var title = post.title;
            var description = post.description;
            
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
            });
        });
        
    }
    else if(pathname === '/update'){
        fs.readdir('data',function(error,filelist){
            var filteredId = path.parse(queryData.id).base;
            fs.readFile(`data/${filteredId}`, 'utf8', function(err,description){
                var title = queryData.id;
                var list = template.List(filelist);
                var html = template.HTML(title,list,` 
                    <form action="/update_process" method="post">
                     <input type="hidden" name="id" value="${title}">
                      <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                      <p>
                        <textarea name="description" placeholder="description">${description}</textarea>
                      </p>
                      <p>
                        <input type="submit">
                      </p>
                    </form>`,
                    `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
                response.writeHead(200);
                response.end(html);
            });        
        });
    }
    else if(pathname === '/update_process'){ // update 처리
        var body = '';
        request.on('data', function(data){
            body += data;
        });
        request.on('end',function(){
            var post = qs.parse(body);  // 쿼리스트링을 객체 형식으로 리턴
            var id = post.id;
            var title = post.title;
            var description = post.description;
            //console.dir(post);
            
            // 파일이름 수정하기 : fs.rename('old path','new path',callback);
            fs.rename(`data/${id}`, `data/${title}`, function(error){
               
                fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                }); 
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
            var id = post.id;
            var filteredId = path.parse(id).base;
            fs.unlink(`data/${filteredId}`,function(error){
                response.writeHead(302, {Location: `/`});
                response.end();
            })
           
            
            
        });
    }
    
    else{ // 접속경로(path)가 루트가 아니라면..
      response.writeHead(404);
      response.end('Not found');
    }
    

});
app.listen(8080);



