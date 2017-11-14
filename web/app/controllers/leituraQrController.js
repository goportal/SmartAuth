angular.module('app')

.controller('leituraQrController', function($http,$scope,$location, $location,$timeout){
    
    var param = $location.search();
    
    $scope.qrText = param.data;
    
    $scope.cancelar = function(){
        $location.url("/");
    }

    function isAutorizado(){
        
        $http.post("http://localhost:7008/servicos/isAutorizado",{hash:param.data,login:param.login})
        .success((data)=>{
            localStorage.setItem("token", data);
            $location.url("/conteudo");
            console.log("worked bitch :)");
        })
        .error((err)=>{
            console.log("erro:");
            $timeout(isAutorizado,3000);
        })
        
    }
    
    isAutorizado();
    
    
});