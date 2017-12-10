angular
  .module("starter.services", [])

  
  .factory("TokenFactory", function($http) {
    var baseURL = "http://calm-spire-23308.herokuapp.com/";

    var bd_token = JSON.parse(
      window.localStorage.getItem("token_data") || "[]"
    );
    var bd_info = JSON.parse(window.localStorage.getItem("info_data") || "[]");
    var act = JSON.parse(window.localStorage.getItem("act_data") || "[]");

    function persist() {
      window.localStorage.setItem("token_data", JSON.stringify(bd_token));
    }

    function persistInfo() {
      window.localStorage.setItem("info_data", JSON.stringify(bd_info));
    }

    function persistAct() {
      window.localStorage.setItem("act_data", JSON.stringify(act));
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
        bd_info.push(user);
        persistInfo();
      },
      setavatar: function(url) {
        bd_info.push(url);
        persistInfo();
      },
      updateAvatar: function(url) {
        bd_info[1] = url;
        persistInfo();
      },
      logout: function() {
        bd_token = [];
        bd_info = [];
        act = [];
        persist();
        persistInfo();
        persistAct();
      },
      saveToken: function(token) {
        bd_token.push(token);
        persist();
      },
      saveInfo: function(info) {
        bd_info.push(info);
        persistInfo();
      },
      getToken: function() {
        if (bd_token.length !== 0) {
          return bd_token[0];
        }
        return false;
      },
      getInfo: function() {
        if (bd_info.length !== 0) {
          return bd_info[0];
        }
        return false;
      },
      getAvatar: function() {
        if (bd_info.length !== 0) {
          return bd_info[1];
        }
        return false;
      },
      updateInfos: function(info) {
        bd_info[0].nome = info.nome;
        bd_info[0].email = info.email;
        persistInfo();
      },
      getUserData: function(email) {
        return $http.post(baseURL + "me", { email: email });
      }
    };
  })




  .service("UserService", function() {
    // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
    var setUser = function(user_data) {
      window.localStorage.starter_facebook_user = JSON.stringify(user_data);
    };

    var getUser = function() {
      return JSON.parse(window.localStorage.starter_facebook_user || "{}");
    };

    return {
      getUser: getUser,
      setUser: setUser
    };
  })



  .factory("getPoints", [
    "$http",
    "$q",
    function($http, $q) {
      var baseURL = "lib/";
      return {
        get: function() {
          return $http.get(baseURL + "trees.json");
        }
      };
    }
  ])




  .factory("dataService", [
    "$ionicPopup",
    "$q",
    "$http",
    function($ionicPopup, $q, $http) {
      var baseURL = "lib/";
      var forest = JSON.parse(window.localStorage.getItem("db_app") || "[]");
      var loc = JSON.parse(window.localStorage.getItem("loc_db") || "[]");

      function persistir() {
        window.localStorage.setItem("db_app", JSON.stringify(forest));
      }

      function locpersist() {
        window.localStorage.setItem("loc_db", JSON.stringify(loc));
      }

      return {
        setLocatios: function(nloc) {
          loc.push(nloc);
          locpersist();
        },
        getLocation: function() {
          return loc;
        },
        clearLoc: function() {
          loc = [];
          locpersist();
        },
        clear: function() {
          forest = [];
          persistir();
        },
        addBd: function(data) {
          forest = data.splice();
          persistir();
        },
        list: function() {
          var deferr = $q.defer();
          deferr.resolve(forest);
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
        getByIdJSON: function(id, success, fail) {
          $http.get(baseURL + "trees.json").then(
            function(res) {
              success(res);
            },
            function(err) {
              fail(err);
            }
          );
        },
        getById: function(id) {
          var deferr = $q.defer();
          var array = forest[0];
          console.log(array);
          for (i = 0; i < array.length; i++) {
            if (array[i]._id.$oid === id) {
              deferr.resolve(array[i]);
              console.log(array[i]);
            }
          }
          return deferr.promise;
        }
      };
    }
  ])





  .factory("ActivityFactory", function($http) {
    var baseURL = "http://calm-spire-23308.herokuapp.com/";

    var activ = JSON.parse(window.localStorage.getItem("act_data") || "[]");

    function persist() {
      window.localStorage.setItem("act_data", JSON.stringify(activ));
    }

    return {
      add: function(oneAct) {
        activ.push(oneAct);
        persist();
      },
      get: function() {
        return activ;
      }

      // upload: function() {
      //     var online = navigator.onLine;
      //     if (online) {
      //         var array = activ[0];
      //         if (array.length !== 0) {
      //             for (i = 0; i <= array.length; i++) {
      //                 console.log(array[i]);
      //                 if (array[i].uploaded) {
      //                     continue;
      //                 } else {
      //                     $http.post(baseURL + 'activity', { idUser: array[i].idUser, email: array[i].email, activity: array[i].act, date: array[i].date, uploaded: array[i].uploaded })
      //                         .then(function() {
      //                             array[i].uploaded = true;
      //                             persist();
      //                         })
      //                 }

      //             }
      //         }
      //     }
      // },
      // download: function(id) {
      //     var online = navigator.onLine;

      //     if (online) {
      //         $http.get(baseURL + 'activity/' + id + '/').then(function(res) {
      //             if (res.data.Message === null) {
      //                 null;
      //             } else {
      //                 console.log(res);
      //                 activ.concat(res.data.Message);
      //                 console.log(activ);
      //                 persist();
      //             }

      //         })
      //     }

      //     return false;
      // }
    };
  });
// .factory('TokenInter', function($q) {

//     return {
//         'request': function(config) {
//             config.headers = config.headers || {};
//             tk = JSON.parse(window.localStorage.getItem('token_data') || '[]');
//             config.headers['x-access-token'] = tk[0];

//             return config;
//         },
//         'responseError': function(response) {
//             if (response.status === 401 || response.status === 403) {
//                 alert("Falha");
//             }
//             return $q.reject(response);
//         }
//     };
// })
