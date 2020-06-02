var http = require('http');
//var fs = require('fs');
var url = require('url'); // url 모듈을 변수에 저장
var qs = require("querystring");

var template = require('./lib/template_module.js');
//var path = require('path');
//var sanitizeHTML = require("sanitize-html");

var db = require("./lib/db");




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
            // 목록들 출력하는 기능
            db.query(`SELECT * FROM topic`, function(error,topics){
                //console.log(topics);
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = template.List(topics);
                var html = template.HTML(title,list,
                            `<h2>${title}</h2>${description}`,
                            `<a href="/create">create</a>`);
                // 홈페이지에선 create 버튼만 보이게끔
                response.writeHead(200);
                response.end(html);
            });
        }
        
        // 쿼리스트링의 id 값이 있을 때 ( = 컨텐츠페이지에 접속했을 때)
        // ( ex. ?id=HTML,CSS,JavaScript ) 
        else{
            
            db.query(`SELECT * FROM topic`, function(error,topics){ // 전체 목록 출력
                if(error){
                    throw error;
                }
                // 해당 컨텐츠 상세보기 출력하는 함수
                // join 을 이용해서 author 테이블에 있는 저자 정보도 출력
                db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id 
                WHERE topic.id=?`,[queryData.id],function(error2,topic){
                   if(error2){
                       throw error2;
                   } 
                    //console.log(topic);
                    var title = topic[0].title;
                    var description = topic[0].description; // 컨텐츠 내용
                    var list = template.List(topics); // topics : 전체 목록 데이터가 있는 테이블
                    var html = template.HTML(title,list,
                                `<h2>${title}</h2>
                                ${description}
                                <p>by ${topic[0].name}</p>`,
                                `<a href="/create">create</a>
                                <a href="/update?id=${queryData.id}">update</a>
                                <form action="/delete_process" method="post" 
                                        onsubmit='return confirm("삭제하시겠습니까?")'>
                                  <input type="hidden" name="id" value="${queryData.id}">
                                  <input type="submit" value="delete">
                                </form>`);
                    response.writeHead(200);
                    response.end(html);
                    });

                });
            }
    }
    
    // /create 페이지에선 /create_process 로 넘길 form을 생성한다.  
    else if(pathname === '/create'){ // 접속경로가 create 일 때..
      

        // 목록들 출력과 create form 생성하는 기능
        db.query(`SELECT * FROM topic`, function(error,topics){
            
            // 저자 정보를 create 시 고를 수 있게끔 author 테이블 불러옴
            db.query('SELECT * FROM author', function(error2, authors){
                
                //console.log(topics);
                console.log(authors);
                var title = 'Create';
                var list = template.List(topics);
                var html = template.HTML(title,list,
                    `
                    <form action="/create_process" method="post">
                        <p><input type="text" name="title" placeholder="title"></p>
                        <p>
                            <textarea name="description" placeholder="description"></textarea>
                        </p>
                        <p>
                            ${template.authorSelect(authors)}
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                    `,
                    `<a href="/create">create</a>`);
                
                response.writeHead(200);
                response.end(html);
                });
            
        });
    }
    
    // /create_process 에선 /create 에서 사용자에게 받은 form 데이터를 백엔드 처리한다.
    else if(pathname === '/create_process'){
    
        var body = '';
        
        // data 이벤트 : request data가 넘어올 때 발생
        request.on('data', function(data){
            body += data;   // 변수 body 에는 request한 폼 데이터가 담겨져있음
            //console.log("data : ",data);
            //console.log("body : ",body);
        });
        request.on('end',function(){
            var post = qs.parse(body);
            //console.log("post : ",post);
            //console.log("post.author : ",post.author);
            
            db.query(`
                INSERT INTO topic (title, description, created, author_id)
                 VALUES(?, ?, NOW(), ?)`,
                 [post.title, post.description, post.author], // VALUES() 안의 물음표에 각각 매칭되어 들어간다.
                 function(error,result){
                     if(error){
                         throw error;
                     }
                     response.writeHead(302, {Location: `/?id=${result.insertId}`});
                     response.end();
                 })
        });
        
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



