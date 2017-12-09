angular.module('app')

.controller("homeController", function($scope, $http, $location){

    $scope.enviaLogin = function(){

        login ={
            login:$scope.cpLogin
        }

        $http.post('https://localhost:7008/servicos/login',login)

        .success(function(data){
            $location.url("/qr?data="+data+"&login="+login.login);
        })

        .error(function(err){
            alert("ERRO:"+err);
            console.log("Erro ao enviar");
        });

        $scope.cpLogin = "";

    }

});