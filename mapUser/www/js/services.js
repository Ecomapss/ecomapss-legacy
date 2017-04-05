angular.module('starter.services', [])

.factory('getPoints', ['$http','$q', function ($http, $q) {
    var baseURL = 'https://calm-spire-23308.herokuapp.com/';
    return {
        get: function (){
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