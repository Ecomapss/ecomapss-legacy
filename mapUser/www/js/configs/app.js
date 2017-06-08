// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic-material', 'starter.controllers', 'starter.directives', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform, $timeout, $cordovaSplashscreen) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

                $timeout(function() {
                    $cordovaSplashscreen.hide()
                }, 4000)

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.backgroundColorByHexString("#33cd5f");
            }
        });
    })
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('TokenInter');
    }])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('top');
    $ionicConfigProvider.navBar.alignTitle('center')

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
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
                    controller: 'HomeCtrl'
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

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
});