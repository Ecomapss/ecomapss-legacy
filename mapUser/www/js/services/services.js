angular.module('starter.services', [])

    .factory('getPoints', ['$http', '$q', function ($http, $q) {
        var baseURL = 'https://calm-spire-23308.herokuapp.com/';
        return {
            get: function () {
                var deferr = $q.defer();
                $http.get(baseURL + 'getData').then(function (res) {
                    deferr.resolve(res);
                }, function (err) {
                    console.log(err);
                })

                return deferr.promise;
            }
        }
    }])

    .factory('dataService', ['$ionicPopup', '$q', function ($ionicPopup, $q) {
        var forest = JSON.parse(window.localStorage.getItem('db_app') || '[]');



        function persistir() {
            window.localStorage.setItem('db_app', JSON.stringify(forest));
        }

        return {
            list: function () {
                var deferr = $q.defer();
                deferr.resolve(forest)
                return deferr.promise;
            },
            put: function (tree) {
                forest.push(tree);
                persistir();
            },
            get: function (id) {
                var deferr = $q.defer();
                deferr.resolve(forest[id]);
                return deferr.promise;
            },
            delete: function (id) {
                forest.splice(id, 1);
                persistir();
            },
            update: function (id, tree) {
                forest[id] = tree;
                persistir();
            },
            getById: function (id) {
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

    .factory('GetLtln', function () {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        
    })