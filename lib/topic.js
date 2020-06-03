var db = require("./db");
var template = require('./template_module.js');

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
}
