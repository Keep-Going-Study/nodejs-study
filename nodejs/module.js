// module.js ( 모듈이 되는 파일 )

var M = {
    name : 'Choi',
    f : function(){
        console.log(this.name);
    }
}

//M.f(); // Choi

module.exports = M;


