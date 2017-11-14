angular.module('app')

.controller("homeController", function($scope, $http, $location){

    $scope.enviaLogin = function(){

        //console.log("eu estou aqui: "+$scope.cpLogin);

        login ={
            login:$scope.cpLogin
        }

        $http.post('http://localhost:7008/servicos/login',login)

        .success(function(data){
            //console.log("Enviado com sucesso");
            //console.log(data);

            $location.url("/qr?data="+data+"&login="+login.login);

        })

        .error(function(err){
            alert(err);
            console.log("Erro ao enviar");
        });

        $scope.cpLogin = "";

    }

});

//localStorage.setItem("token", data.token);
    
        
         