// sync.js 실행시킬 때, root에서 node syntax/sync.js 입력

var fs = require('fs');

// readFileSync : 동기적
console.log('A');
var result = fs.readFileSync('syntax/sample.txt','utf8');
console.log(result);
console.log('C');




