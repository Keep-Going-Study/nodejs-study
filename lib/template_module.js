// 템플릿 모듈

// 템플릿 양식 관련 함수 객체에 저장



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
                    list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
                    i++;
                }
                list += '</ul>';
                
                return list;
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


            