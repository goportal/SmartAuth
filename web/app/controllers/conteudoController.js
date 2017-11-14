angular.module('app')

.controller("conteudoController", function($scope, $http, $location){
    
    console.log("entrou no conteudo");

    $scope.coletania = {};
    
    $http.post('http://localhost:7008/servicos/conteudo',{token:localStorage.getItem('token')})
    .success((data)=>{
        console.log("Dados retornados com sucesso");
        $scope.coletania = data;
    })
    .error((err)=>{
        console.log("Erro ao buscar dados ERROR:"+err);
        elert("Erro ao buscar dados, possível acesso indevido!");
    });

    $scope.deslogar = function(){
        localStorage.setItem('token','');
        $location.url("/");
    }
    
});