angular.module('app', ["ngRoute"])

.config(['$routeProvider', function ( $routeProvider) {

    $routeProvider.when('/login', {
        templateUrl: './html/home.html',
        controller: 'homeController'
    })

    .when('/qr',{
        templateUrl: './html/homeQr.html',
        controller: 'leituraQrController'
    })

    .when('/',{
        templateUrl: './html/home.html',
        controller: 'homeController'
    })

    .when('/conteudo',{
        templateUrl:'./html/conteudo.html',
        controller: 'conteudoController'
    });

}]);