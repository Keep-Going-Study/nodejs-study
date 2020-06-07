// author.js : 저자기능을 구현하는 모듈

var db = require("./db");
var template = require('./template_module.js');

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
                        <br></br>
                        ${template.authorTable(authors)}
                        <style>
                            table{
                                border-collapse : collapse;
                            }
                            td{
                                border: 1px solid black;
                            }
                        </style>
                        `,
                        `<a href="/create">create</a>`);
                        // 홈페이지에선 create 버튼만 보이게끔
            response.writeHead(200);
            response.end(html); 
        });
    
    });
};