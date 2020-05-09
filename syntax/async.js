// async.js 실행시킬 때, root에서 node syntax/async.js 입력

var fs = require('fs');

// readFile : 비동기적
console.log('A');
fs.readFile('syntax/sample.txt', 'utf8', function(err,result){
    console.log(result);
});
console.log('C');
