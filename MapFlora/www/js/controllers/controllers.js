angular.module('starter.controllers', [])

.controller('AppCtrl', function($ionicLoading, TokenFactory, ActivityFactory, $state, $ionicPopup, $ionicPlatform, $cordovaBarcodeScanner, $scope, $ionicModal, $timeout, getPoints, dataService) {
    var online = navigator.onLine;
    if (online) {
        getPoints.get().then(function(res) {
            console.log(res);
            dataService.clear();
            dataService.addBd(res.data);
        })

    } else {
        $ionicPopup.alert({
            title: 'Error!',
            template: 'Você não está conectado há uma rede, portanto os dados ficarão desatualizados'
        });
    }

    if (!TokenFactory.getToken()) {
        $state.go('login');
    } else {
        TokenFactory.getUserData(TokenFactory.getInfo().email).then(function(res) {
            $scope.nome = res.data.nome;
            ActivityFactory.upload();
            $timeout(function() {
                ActivityFactory.download(TokenFactory.getInfo().id);
            }, 5000);
        });
    }


    $scope.logOut = function() {
        $ionicLoading.show({
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        });
        TokenFactory.logout();

        $timeout(function() {
            $ionicLoading.hide();
            $state.go('login', {}, { reload: 'app' }, { reload: 'app.login' });
        }, 5000);
    }


    $scope.scan = function() {
        //Chamada ao leitor e função de callback com dados
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

.controller('HomeCtrl', ['ionicMaterialMotion', 'ActivityFactory', '$timeout', '$scope', 'dataService', '$ionicLoading', 'getPoints', '$ionicPopup', function(ionicMaterialMotion, ActivityFactory, $timeout, $scope, dataService, $ionicLoading, getPoints, $ionicPopup) {
    var self = this;
    self.dados = [];

    //Loading enquanto busca dados no serviço
    $ionicLoading.show({
        template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
    });
    //Pegando dados no serviço
    var online = navigator.onLine;
    if (online) {
        self.dados = ActivityFactory.get();
        console.log(self.dados);
        ActivityFactory.download();
        $ionicLoading.hide();
    }

}])

.controller('SearchCtrl', ['$state', '$ionicLoading', '$scope', '$stateParams', 'getPoints', '$timeout', 'ionicMaterialMotion', 'dataService', function($state, $ionicLoading, $scope, $stateParams, getPoints, $timeout, ionicMaterialMotion, dataService) {
        var self = this;
        self.se = false;
        self.dados = [];



        //Loading enquanto busca dados no serviço
        $ionicLoading.show({
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        });
        //Pegando dados no serviço
        dataService.list().then(function(data) {
            if (data.length) {
                self.dados = data[0];
                $ionicLoading.hide();
            } else {
                getPoints.get().then(function(res) {
                    self.dados = res.data;
                    dataService.put(res.data);
                    $ionicLoading.hide();
                });
            }
        })

        //Função para mudar view para dados
        self.viewData = function(id) {
            $state.go('app.dados', { id: id });
        }
    }])
    .controller('LoginCtrl', function($scope, $state, $q, UserService, $ionicLoading, $ionicPopup, TokenFactory) {
        var self = this;

        if (TokenFactory.getToken()) {
            $state.go('app.home');
        }

        self.login = function(user) {
            $ionicLoading.show({
                template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
            });

            TokenFactory.login(user).then(function(res) {
                TokenFactory.saveToken(res.data.token);
                console.log(res.data);
                TokenFactory.saveInfo({ email: res.data.email, id: res.data.user });
                $ionicLoading.hide();
                $state.go('app.home', {}, { reload: 'app' });
            }, function(err) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Error!',
                    template: 'Email ou senha errados!'
                });
            })
        }


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
                        template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
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

        //Função para marcar no mapa
        function marks() {
            //Captura os pontos em um serviço
            getPoints.get().then(function(res) {
                //recebe os dados das arvores
                var forest = res.data;
                mark = [];
                popup = [];
                //Realiza um laço para distribuir os pontos no mapa
                for (var i = 0; i < forest.length; i++) {
                    if (forest[i].loc.length > 1) {
                        console.log(forest[i].loc);
                        for (var j = 0; j < forest[i].loc.length; j++) {
                            lat = Number.parseFloat(forest[i].loc[j].lat);
                            long = Number.parseFloat(forest[i].loc[j].lng);

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

                    }
                }

                //Função para fixar uma infowindow ao seu respectivo ponto
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

                    //Add um listener ao mark para quando clicado abrir a info window
                    mark.addListener('click', function() {
                        infoWindow.open(mark.get('map'), mark);
                    });
                }
            }, function(err) {
                console.log(err);
            })
        }

        //Inicia a marcação
        marks();

        //Mudar view
        $scope.go = function(id) {
            $state.go('app.dados', { id: id });
        }

        //Criando o map
        $scope.mapCreated = function(map) {
            $scope.map = map;
        };

        //Função para centralizar no usuario
        $scope.centerOnMe = function() {
            console.log("Centering");
            if (!$scope.map) {
                console.log('Não existe')
                return;
            }
            $ionicLoading.show({
                content: 'Localizando',
                showBackdrop: true
            });
            navigator.geolocation.getCurrentPosition(function(pos) {
                console.log("Centering");
                console.log('Got pos', pos);
                $ionicLoading.hide();
                $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            }, function(error) {
                $ionicLoading.hide();
                alert('Erro ao procurar localização: ' + error.message);
            }, { timeout: 10000 });
        };



    }])

.controller('DadosCtrl', ['$scope', '$timeout', 'TokenFactory', 'ActivityFactory', '$http', '$stateParams', 'dataService', '$timeout', 'ionicMaterialMotion', 'ionicMaterialInk', function($scope, $timeout, TokenFactory, ActivityFactory, $http, $stateParams, dataService, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    var self = this;
    //Recebe o id via url
    self.id = $stateParams.id;
    self.dados = {};

    function dataAtualFormatada() {
        var data = new Date();
        var dia = data.getDate();
        if (dia.toString().length == 1)
            dia = "0" + dia;
        var mes = data.getMonth() + 1;
        if (mes.toString().length == 1)
            mes = "0" + mes;
        var ano = data.getFullYear();
        return dia + "/" + mes + "/" + ano;
    }

    //Busca no serviço pelo id da arvore
    dataService.getById(self.id).then(function(data) {
        oneACt = {
            idUser: TokenFactory.getInfo().id,
            email: TokenFactory.getInfo().email,
            act: "Visualizou uma " + data.nome_cie + " em " + dataAtualFormatada(),
            date: new Date(),
            uploaded: false
        }


        $http.get("img/trees/" + self.id + ".jpg").then(function() {
            self.source = ("img/trees/" + self.id + ".jpg");
            self.dados = data;
            $scope.apply;
        }, function() {
            self.source = ("img/stan.jpg");
            self.dados = data;
            $scope.apply;
        })
        $timeout(function() {
            ActivityFactory.add(oneACt);
            ActivityFactory.upload();
        }, 5000);


    })

    //Timeout para realizar animações
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    //ativação de animações
    ionicMaterialInk.displayEffect();

}])