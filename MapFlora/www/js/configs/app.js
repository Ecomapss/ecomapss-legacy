angular.module('starter', ['ionic', 'ionic-material', 'starter.controllers', 'starter.directives', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform, $timeout, $cordovaSplashscreen, $cordovaNetwork, $ionicPopup) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            ionic.material.motion.blinds();
            
            var isOnline = $cordovaNetwork.isOnline();
            if (!isOnline) {
                $ionicPopup.confirm({
                    title: "Sem conexão",
                    content: "Os dados ficaram desatualizados."
                })
            }


            if (window.StatusBar) {
                StatusBar.backgroundColorByHexString("#28a54c");
            }
        });
    })
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('TokenInter');
    }])
    .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $ionicConfigProvider.tabs.position('top');
        $ionicConfigProvider.navBar.alignTitle('center')
        $ionicConfigProvider.views.maxCache(0);

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl as lg'
            })

        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })
            .state('app.map', {
                url: '/map',
                views: {
                    'map': {
                        templateUrl: 'templates/map.html',
                        controller: 'MapCtrl'
                    }
                }
            })
            .state('app.home', {
                url: '/home',
                views: {
                    'home': {
                        templateUrl: 'templates/home.html',
                        controller: 'HomeCtrl as hm'
                    }
                }
            })
            .state('app.search', {
                url: '/search',
                views: {
                    'search': {
                        templateUrl: 'templates/search.html',
                        controller: 'SearchCtrl as ctrl'
                    }
                }
            })
            .state('app.dados', {
                url: '/dados/:id',
                views: {
                    'search': {
                        templateUrl: 'templates/dados.html',
                        controller: 'DadosCtrl as ctrl'
                    }
                }
            });;

        var bd_token = JSON.parse(window.localStorage.getItem('token_data') || '[]');

        if (bd_token.length !== 0) {
            $urlRouterProvider.otherwise('/app/home');
        } else {
            $urlRouterProvider.otherwise('/login');
        }

    });