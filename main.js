var http = require('http');
var fs = require('fs');
var url = require('url'); // url 모듈을 변수에 저장

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    // queryData 에는 쿼리스트링이 객체타입으로 저장됨
    var title = queryData.id; // 코드 가독성을 위해 title 변수 추가선언
    
    if(_url == '/'){
        title = 'Welcome';
        }
    if(_url == '/favicon.ico'){
          response.writeHead(404);
          response.end();
          return;
        }
    var template = `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <ol>
        <li><a href="/?id=HTML">HTML</a></li>
        <li><a href="/?id=CSS">CSS</a></li>
        <li><a href="/?id=JavaScript">JavaScript</a></li>
      </ol>
      <h2>${title}</h2>
      <p><a href="https://www.w3.org/TR/html5/" target="_blank" title="html5 speicification">Hypertext Markup Language (HTML)</a> is the standard markup language for <strong>creating <u>web</u> pages</strong> and web applications.Web browsers receive HTML documents from a web server or from local storage and render them into multimedia web pages. HTML describes the structure of a web page semantically and originally included cues for the appearance of the document.
      <img src="coding.jpg" width="100%">
      </p><p style="margin-top:45px;">HTML elements are the building blocks of HTML pages. With HTML constructs, images and other objects, such as interactive forms, may be embedded into the rendered page. It provides a means to create structured documents by denoting structural semantics for text such as headings, paragraphs, lists, links, quotes and other items. HTML elements are delineated by tags, written using angle brackets.
      </p>
    </body>
    </html>

    `;
    response.writeHead(200);
    response.end(template); 
    // response 값으로 template 변수를 설정하는데,
    // ${title} 이 동적으로 변화함.
    // 하지만, title 만 변화하고 문서내용은 정적인 상태로 유지함.
    // 다음 강의에서 이 부분 수정할 것.
 
});
app.listen(80);



