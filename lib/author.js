// author.js : 저자기능을 구현하는 모듈

var db = require("./db");
var template = require('./template_module.js');
var qs = require("querystring");
var url = require("url");

// 저자관리 페이지(/author) 메인페이지
exports.home = function(request, response){
    //  컨텐츠 목록 레코드 불러오는 쿼리
    db.query(`SELECT * FROM topic`, function(error,topics){
        // 저자 레코드 불러오는 쿼리
        db.query(`SELECT * FROM author`, function(error2,authors){
            
            var title = 'author';
            var list = template.List(topics);
            var html = template.HTML(title,list,
                        `
                        <h2>AUTHOR INFORMATION</h2>
                        
                        ${template.authorTable(authors)}
                        <style>
                        
                            table{
                                border-collapse : collapse;
                            }
                            td{
                                border: 1px solid black;
                                text-align : center;
                                padding : 5px;
                            }
                            
                            
                        </style>
                        
                        <form action="/author/create_process" method="post">
                            <p>
                                <input type="text" name="name" placeholder="name">
                            </p>
                            <p>
                                <textarea name="profile" placeholder="description"></textarea>
                            </p>
                            <p>
                                <input type="submit" value="create">
                            </p>
                        </form>
                        `,
                        ``);
                        
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
            INSERT INTO author (name, profile)
             VALUES(?, ?)`,
             [post.name, post.profile], 
             function(error,result){
                 if(error){
                     throw error;
                 }
                 response.writeHead(302, {Location: `/author`});
                 response.end();
             });
    });
    
};

// 저자 수정 폼 생성 모듈
exports.update = function(request, response){
    //  컨텐츠 목록 레코드 불러오는 쿼리
    db.query(`SELECT * FROM topic`, function(error,topics){
        // 저자 레코드 불러오는 쿼리
        db.query(`SELECT * FROM author`, function(error2,authors){
            
            var _url = request.url;
            var queryData = url.parse(_url,true).query;
            db.query(`SELECT * FROM author WHERE id=?`,[queryData.id],
                    function(error3,author){
                        var title = 'author';
                        var list = template.List(topics);
                        var html = template.HTML(title,list,
                        `
                        <h2>AUTHOR INFORMATION</h2>
                        
                        ${template.authorTable(authors)}
                        <style>
                        
                            table{
                                border-collapse : collapse;
                            }
                            td{
                                border: 1px solid black;
                                text-align : center;
                                padding : 5px;
                            }
                            
                            
                        </style>
                        
                        <form action="/author/create_process" method="post">
                            <p>
                                <input type="text" name="name" 
                                    value="${author[0].name}" placeholder="name">
                            </p>
                            <p>
                                <textarea name="profile" placeholder="description">${author[0].profile}</textarea>
                            </p>
                            <p>
                                <input type="submit" value="create">
                            </p>
                        </form>
                        `,
                        ``);
                                    
                        response.writeHead(200);
                        response.end(html); 
                    });
            });
        });
    
};