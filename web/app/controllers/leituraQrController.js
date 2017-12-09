angular.module('app')

.controller('leituraQrController', function($http,$scope,$location, $location,$timeout){
    
    let esperar = true;

    var param = $location.search();
    
    $scope.qrText = param.data;
    
    $scope.cancelar = function(){
        esperar = false;
        $location.url("/");
    }

    function isAutorizado(){

        $http.post("https://localhost:7008/servicos/isAutorizado",{hash:param.data,login:param.login})
        .success((data)=>{
            localStorage.setItem("token", data);
            $location.url("/conteudo");
        })
        .error((err)=>{
            console.log("erro:"+err);
            $timeout(isAutorizado,3000);
        })
        
    }
    
    isAutorizado();
    
});