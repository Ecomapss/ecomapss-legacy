angular
  .module("starter", [
    "ionic",
    "ionic-material",
    "starter.controllers",
    "starter.directives",
    "starter.services",
    "ngCordova"
  ])
  .run(function(
    $ionicPlatform,
    $timeout,
    $cordovaSplashscreen,
    $cordovaNetwork,
    $ionicPopup,
    $cordovaStatusbar
  ) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.backgroundColorByHexString("#673AB7");
      }
      $cordovaStatusbar.styleHex("#673AB7");
    });
  })
  // .config([
  //   "$httpProvider",
  //   function($httpProvider) {
  //     $httpProvider.interceptors.push("TokenInter");
  //   }
  // ])
  .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position("botton");
    $ionicConfigProvider.navBar.alignTitle("center");
    $ionicConfigProvider.views.maxCache(1);

    $stateProvider
      .state("login", {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: "LoginCtrl as lg"
      })
      .state("loginavatar", {
        url: "/login",
        templateUrl: "templates/loginavatar.html",
        controller: "AvatCtrl as av"
      });

    $stateProvider
      .state("app", {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: "AppCtrl"
      })
      .state("app.map", {
        url: "/map",
        views: {
          map: {
            templateUrl: "templates/map.html",
            controller: "MapCtrl"
          }
        }
      })
      .state("app.home", {
        url: "/home",
        views: {
          home: {
            templateUrl: "templates/home.html",
            controller: "HomeCtrl as hm"
          }
        }
      })
      .state("app.search", {
        url: "/search",
        views: {
          search: {
            templateUrl: "templates/search.html",
            controller: "SearchCtrl as ctrl"
          }
        }
      })
      .state("app.dados", {
        url: "/dados/:id",
        views: {
          search: {
            templateUrl: "templates/dados.html",
            controller: "DadosCtrl as ctrl"
          }
        }
      });

    var bd_token = JSON.parse(
      window.localStorage.getItem("token_data") || "[]"
    );

    if (bd_token.length !== 0) {
      $urlRouterProvider.otherwise("/app/search");
    } else {
      $urlRouterProvider.otherwise("/login");
    }
  });
