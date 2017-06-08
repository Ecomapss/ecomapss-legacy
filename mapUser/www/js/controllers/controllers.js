angular.module('starter.controllers', [])

.controller('AppCtrl', function($state, $ionicPopup, $ionicPlatform, $cordovaBarcodeScanner, $scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.scan = function() {
        console.log("Teste");
        $cordovaBarcodeScanner
            .scan()
            .then(function(data) {
                if (data.text) {
                    $state.go('app.dados', { id: data.text });
                } else {
                    $state.go('app.search');
                }

            }, function(error) {
                $state.go('app.search');
            });
    }
})

.controller('HomeCtrl', ['ionicMaterialMotion', '$timeout', '$scope', function(ionicMaterialMotion, $timeout, $scope) {

}])

.controller('SearchCtrl', ['$state', '$ionicLoading', '$scope', '$stateParams', 'getPoints', '$timeout', 'ionicMaterialMotion', 'dataService', function($state, $ionicLoading, $scope, $stateParams, getPoints, $timeout, ionicMaterialMotion, dataService) {
        var self = this;
        self.se = false;
        self.dados = [];

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 200,
            showDelay: 0
        });

        dataService.list().then(function(data) {
            console.log(data);
            if (data.length) {
                self.dados = data[0];
                console.log(self.dados);
                $ionicLoading.hide();
            } else {
                getPoints.get().then(function(res) {
                    self.dados = res.data;
                    console.log(res.data);
                    dataService.put(res.data);
                    $ionicLoading.hide();
                });
            }
        })

        self.viewData = function(id) {
            $state.go('app.dados', { id: id });
        }
    }])
    .controller('LoginCtrl', function($scope, $state, $q, UserService, $ionicLoading) {
        var fbLoginSuccess = function(response) {
            if (!response.authResponse) {
                fbLoginError("Cannot find the authResponse");
                return;
            }

            var authResponse = response.authResponse;

            getFacebookProfileInfo(authResponse)
                .then(function(profileInfo) {
                    // For the purpose of this example I will store user data on local storage
                    UserService.setUser({
                        authResponse: authResponse,
                        userID: profileInfo.id,
                        name: profileInfo.name,
                        email: profileInfo.email,
                        picture: "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
                    });
                    $ionicLoading.hide();
                    $state.go('app.home');
                }, function(fail) {
                    // Fail get profile info
                    console.log('profile info fail', fail);
                });
        };

        // This is the fail callback from the login method
        var fbLoginError = function(error) {
            console.log('fbLoginError', error);
            $ionicLoading.hide();
        };

        // This method is to get the user profile info from the facebook api
        var getFacebookProfileInfo = function(authResponse) {
            var info = $q.defer();

            facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
                function(response) {
                    console.log(response);
                    info.resolve(response);
                },
                function(response) {
                    console.log(response);
                    info.reject(response);
                }
            );
            return info.promise;
        };

        //This method is executed when the user press the "Login with facebook" button
        $scope.facebookSignIn = function() {
            facebookConnectPlugin.getLoginStatus(function(success) {
                if (success.status === 'connected') {
                    // The user is logged in and has authenticated your app, and response.authResponse supplies
                    // the user's ID, a valid access token, a signed request, and the time the access token
                    // and signed request each expire
                    console.log('getLoginStatus', success.status);

                    // Check if we have our user saved
                    var user = UserService.getUser('facebook');

                    if (!user.userID) {
                        getFacebookProfileInfo(success.authResponse)
                            .then(function(profileInfo) {
                                // For the purpose of this example I will store user data on local storage
                                UserService.setUser({
                                    authResponse: success.authResponse,
                                    userID: profileInfo.id,
                                    name: profileInfo.name,
                                    email: profileInfo.email,
                                    picture: "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
                                });

                                $state.go('app.home');
                            }, function(fail) {
                                // Fail get profile info
                                console.log('profile info fail', fail);
                            });
                    } else {
                        $state.go('app.home');
                    }
                } else {
                    // If (success.status === 'not_authorized') the user is logged in to Facebook,
                    // but has not authenticated your app
                    // Else the person is not logged into Facebook,
                    // so we're not sure if they are logged into this app or not.

                    console.log('getLoginStatus', success.status);

                    $ionicLoading.show({
                        template: 'Logging in...'
                    });

                    // Ask the permissions you need. You can learn more about
                    // FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
                    facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
                }
            });
        };
    })
    .controller('TabCtrl', function() {

    })
    .controller('MapCtrl', ['getPoints', '$scope', '$ionicLoading', '$cordovaGeolocation', function(getPoints, $scope, $ionicLoading, $cordovaGeolocation) {

        function marks() {
            getPoints.get().then(function(res) {
                var forest = res.data;
                console.log(res);
                mark = [];
                popup = [];
                for (var i = 0; i < forest.length; i++) {
                    // console.log(forest[i]);
                    lat = Number.parseFloat(forest[i].loc[0].lat);
                    long = Number.parseFloat(forest[i].loc[0].lng);
                    console.log(lat, long);
                    info = forest[i].nome_pop;
                    var image = 'img/tree.png';
                    ma = new google.maps.Marker({
                        map: $scope.map,
                        animation: google.maps.Animation.DROP,
                        title: info,
                        icon: image,
                        position: new google.maps.LatLng(lat, long),
                        info: info
                    });
                    var conteudo = forest[i];
                    atach(conteudo, ma);
                }


                function atach(msg, mark) {
                    var infoWindow = new google.maps.InfoWindow({
                        content: '<div>' +
                            '<div class="iw-head"><b>' + msg.nome_cie + '</b></div>' +
                            '<div class="iw-content">' +
                            '<div class="iw-pop">' + msg.nome_pop + '</div>' +
                            '<img src="img/trees/' + msg._id + '.jpg" height="140" width="240">' +
                            '<p> <b>Clima: </b>' + msg.clima + '<br> <b>Origem:</b> ' + msg.origem + '<br>' +
                            '</div>' +
                            '<a ng-click="function (){console.log("teste")}" class="iw-subTitle">Mais Dados</a>' +
                            '<div class="iw-bottom-gradient"></div>' +
                            '</div>',
                        maxWidth: 500
                    });

                    mark.addListener('click', function() {
                        infoWindow.open(mark.get('map'), mark);
                    });
                }
            }, function(err) {
                console.log(err);
            })
        }
        marks();

        $scope.go = function(id) {
            console.log("teste");

            $state.go('app.dados', { id: id });
        }


        $scope.mapCreated = function(map) {
            $scope.map = map;
        };

        $scope.centerOnMe = function() {
            console.log("Centering");
            if (!$scope.map) {
                console.log('Não existe')
                return;
            }
            $scope.loading = $ionicLoading.show({
                content: 'Localizando',
                showBackdrop: false
            });
            navigator.geolocation.getCurrentPosition(function(pos) {
                console.log("Centering");
                console.log('Got pos', pos);
                $scope.loading.hide();
                $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            }, function(error) {
                $scope.loading.hide();
                alert('Erro ao procurar localização: ' + error.message);
            }, { timeout: 10000 });
        };



    }])

.controller('DadosCtrl', ['$scope', '$stateParams', 'dataService', '$timeout', 'ionicMaterialMotion', 'ionicMaterialInk', function($scope, $stateParams, dataService, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    var self = this;
    self.id = $stateParams.id;
    self.dados = {};
    dataService.getById(self.id).then(function(data) {
        self.source = "img/trees/" + self.id + ".jpg";
        self.dados = data;
        console.log(self.dados);
        $scope.apply;
    })

    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    ionicMaterialInk.displayEffect();

}])