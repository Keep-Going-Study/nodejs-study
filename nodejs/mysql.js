var mysql = require('mysql');
var connection = mysql.createConnection({
    host : 'localhost', // host : 데이터베이스 서버의 주소
    user : 'soul4927',
    password : '9815chs',
    database : 'opentutorials' // 사용하려는 database ( USE 문이랑 같은 기능 )
});

connection.connect();

connection.query('SELECT * FROM topic', function( error, results, fields){
    if (error){
        console.log(error);
    }
    
    console.log(results);
})

connection.end();