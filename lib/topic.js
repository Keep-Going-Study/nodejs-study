var db = require("./db");
var template = require('./template_module.js');
var url = require('url');
var qs = require("querystring");


// 쿼리스트링의 id 값이 없을 때 ( = 메인페이지에 접속했을 때)
exports.home = function( request, response ){
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
};


// 쿼리스트링의 id 값이 있을 때 ( = 컨텐츠페이지에 접속했을 때)
// ( ex. ?id=HTML,CSS,JavaScript ) 
exports.page = function(request, response){
     
    var _url = request.url;
    // _url(request.url) 에는 path 이하 주소가 들어감.
    //  ex ) http://localhost:3000/?id=HTML => request.url == /?id=HTML
    var queryData = url.parse(_url,true).query;
    // queryData 에는 쿼리스트링이 객체타입으로 저장됨
    // { id : 'HTML' }
    
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
    
};

// /create 페이지에선 /create_process 로 넘길 form을 생성한다.  
exports.create = function(request, response){
    // 목록들 출력과 create form 생성하는 기능
        db.query(`SELECT * FROM topic`, function(error,topics){
            
            // 저자 정보를 create 시 고를 수 있게끔 author 테이블 불러옴
            db.query('SELECT * FROM author', function(error2, authors){
                
                //console.log(topics);
                //console.log(authors);
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
};


exports.create_process = function(request, response){
    
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
             });
    });
    
};

// /update_process 에선 /update 에서 사용자에게 받은 form 데이터를 백엔드 처리한다.
exports.update = function(request, response){
    
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
  
    
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
};

exports.update_process = function(request, response){
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
};

exports.delete_process = function(request ,response){
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
};