// 템플릿 모듈

// 템플릿 양식 관련 함수 객체에 저장

var sanitizeHtml = require('sanitize-html');

var template = {
    HTML : function(title, list, body, control){
            return `
                <!doctype html>
                <html>
                <head>
                    <title>WEB1 - ${title}</title>
                    <meta charset="utf-8">
                </head>
                <body>
                    <h1><a href="/">WEB</a></h1>
                    <a href="/author">author</a>
                    ${list}
                    ${control}
                    ${body}
                </body>
              </html>
              `;
            },
            
    List : function(topics){
                var list = '<ul>';
                var i=0;
                while(i < topics.length){
                   list = list + `<li><a href="/?id=${topics[i].id}">${sanitizeHtml(topics[i].title)}</a></li>`;
                    i++;
                }
                list += '</ul>';
                
                return list;
             },
            
    
    // authors : author 테이블의 레코드 값들이 들어오는 파라미터
    // author_id : update 기능에서 원래 글의 저자 id 값
    authorSelect: function(authors, author_id){
        var tag = '';
        var i=0;
        while(i < authors.length){
            var selected = '';
            if(authors[i].id === author_id){
                selected = 'selected'; // 원래 글의 저자 id 값일 때 selected 옵션 설정
            }
             tag += `<option value="${authors[i].id}"${selected}>${sanitizeHtml(authors[i].name)}</option>`;
            i++;
        }
        
        return `
            <select name="author">
                ${tag}
            </select>
        `;
    },
    
    // 저자목록 표 생성 html 
    authorTable : function(authors){
        var tag = '<table>';
        var i=0;
        while(i < authors.length){
            tag += `
                <tr>
                    <td>${sanitizeHtml(authors[i].name)}</td>
                    <td>${sanitizeHtml(authors[i].profile)}</td>
                    <td><a href="/author/update?id=${authors[i].id}">update</a></td>
                    <td>
                        <form action="/author/delete_process" method="post">
                            <input type="hidden" name="id" value="${authors[i].id}">
                            <input type="submit" value="delete">
                        </form>
                    </td>
                </tr>
            `;
            i++;
        }
        
        tag += '</table>';
        
        return tag;
        
    }
        
}
    
module.exports = template;




/* 이 코드도 가능 (

module.exports = {
    HTML : function(title, list, body, control){
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
            },
            
    List : function(filelist){
                var list = '<ul>';
                var i=0;
                while(i < filelist.length){
                    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                    i++;
                }
                list += '</ul>';
                
                return list;
             }
            
    }
    
*/


            