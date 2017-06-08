angular.module('starter.services', [])

.factory('TokenFactory', function() {
    var baseURL = 'http://calm-spire-23308.herokuapp.com/';

    var bd_token = JSON.parse(window.localStorage.getItem('token_data') || '[]');
    var bd_email = JSON.parse(window.localStorage.getItem('email_data') || '[]');

    function persist() {
        window.localStorage.setItem('token_data', JSON.stringify(bd_token));
    }

    function persistEmail() {
        window.localStorage.setItem('email_data', JSON.stringify(bd_email));
    }

    return {
        verifyToken: function() {
            if (bd_token.length !== 0) {
                token = bd_token[0];
                return $http.post(baseURL + "verifyToken", token);
            }
            return false;
        },
        login: function(user) {
            return $http.post(baseURL + 'auth', user);
        },
        logout: function() {
            bd_token = [];
            bd_email = [];
            persist();
            persistEmail();
        },
        saveToken: function(token) {
            bd_token.push(token);
            persist();
        },
        saveEmail: function(email) {
            bd_email.push(email);
            persistEmail();
        },
        getToken: function() {
            if (bd_token.length !== 0) {
                return bd_token[0];
            }
            return false;
        },
        getEmail: function() {
            if (bd_email.length !== 0) {
                return bd_email[0];
            }
            return false;
        },
        getUserData: function(email) {
            return $http.post(baseURL + "me", email);
        }
    }
})

.service('UserService', function() {
    // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
    var setUser = function(user_data) {
        window.localStorage.starter_facebook_user = JSON.stringify(user_data);
    };

    var getUser = function() {
        return JSON.parse(window.localStorage.starter_facebook_user || '{}');
    };

    return {
        getUser: getUser,
        setUser: setUser
    };
})

.factory('getPoints', ['$http', '$q', function($http, $q) {
    var baseURL = 'https://calm-spire-23308.herokuapp.com/';
    return {
        get: function() {
            var deferr = $q.defer();
            $http.get(baseURL + 'getData').then(function(res) {
                deferr.resolve(res);
            }, function(err) {
                console.log(err);
            })

            return deferr.promise;
        }
    }
}])

.factory('dataService', ['$ionicPopup', '$q', function($ionicPopup, $q) {
        var forest = JSON.parse(window.localStorage.getItem('db_app') || '[]');



        function persistir() {
            window.localStorage.setItem('db_app', JSON.stringify(forest));
        }

        return {
            list: function() {
                var deferr = $q.defer();
                deferr.resolve(forest)
                return deferr.promise;
            },
            put: function(tree) {
                forest.push(tree);
                persistir();
            },
            get: function(id) {
                var deferr = $q.defer();
                deferr.resolve(forest[id]);
                return deferr.promise;
            },
            delete: function(id) {
                forest.splice(id, 1);
                persistir();
            },
            update: function(id, tree) {
                forest[id] = tree;
                persistir();
            },
            getById: function(id) {
                var deferr = $q.defer();
                var array = forest[0];
                for (i = 0; i < array.length; i++) {
                    if (array[i]._id === id) {
                        deferr.resolve(array[i]);
                        console.log(array[i])
                    }
                }
                return deferr.promise;

            }

        }
    }])
    .factory('TokenInter', function($q) {
        return {
            'request': function(config) {
                config.headers = config.headers || {};
                tk = JSON.parse(window.localStorage.getItem('token_data') || '[]');
                config.headers['x-access-token'] = tk[0];

                return config;
            },
            'responseError': function(response) {
                if (response.status === 401 || response.status === 403) {
                    alert("Falha");
                }
                return $q.reject(response);
            }
        };
    })