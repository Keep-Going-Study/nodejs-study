var db = require("./db");
var template = require('./template_module.js');
var url = require('url');
var qs = require("querystring");
var sanitizeHtml = require('sanitize-html');
var cookie = require('cookie');

// 쿠키값을 통해 로그인 상태 체크
exports.authIsOwner = function(request,response){
    var isOwner = false;
    var cookies = {};
    if(request.headers.cookie){
        cookies = cookie.parse(request.headers.cookie);
    }
    if(cookies.email === 'chs98105@gmail.com' && cookies.password === '9815'){
        isOwner = true;
    }
    return isOwner;
};

exports.SetAuthStatusUI = function(request,response){
    var authStatusUI = '<a href="/login">login</a>';
    if(exports.authIsOwner(request,response)){
        var cookies = cookie.parse(request.headers.cookie);
        authStatusUI = `Hi, <strong>${cookies.email}</strong> <br>
                        <a href="/logout_process">logout</a>`;
    }
    return authStatusUI;
};

exports.login = function(request, response){
    db.query(`SELECT * FROM topic`, function(error,topics){
            //console.log(topics);
            var title = 'Welcome';
            var list = template.List(topics);
            var html = template.HTML(title,list,
                `  
                  <h2> SIGN IN </h2>
                  <form action="/login_process" method="post">
                    <p><input type="text" name="email" placeholder="email"></p>
                    <p><input type="password" name="password" placeholder="password"></p>
                    <p><input type="submit" value="join"></p>
                  </form>
                `,
                `<a href="/create">create</a>`);
            // 홈페이지에선 create 버튼만 보이게끔
            response.writeHead(200);
            response.end(html);
        });
};

exports.login_process = function(request,response){
     var body = '';
        request.on('data',function(data){
            body += data;
        });
        request.on('end',function(){
           var post = qs.parse(body);
           console.log(post);
            if(post.email === 'chs98105@gmail.com' && post.password === '9815'){ // 로그인 성공 조건
               response.writeHead(302,{ // 로그인 성공 시 로그인 쿠키 생성
                   'Set-Cookie' : [
                       `email=${post.email}`,
                       `password=${post.password}`,
                       `nickname=soul`
                       ],
                    Location: '/'
               });
                response.end();
            } 
            else{ // 로그인이 실패했을 시
                response.end('login failed');
            }
        });
};

