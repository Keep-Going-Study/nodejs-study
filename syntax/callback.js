/*
function a(){
    console.log('A');
}
*/

// JS 에선 함수도 값이다.
var a = function(){
    console.log('A');
}

function slowfunc(callback){
    callback();
}

slowfunc(a);