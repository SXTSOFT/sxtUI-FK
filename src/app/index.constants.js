(function ()
{
    'use strict';

    angular
      .module('sxt')
      .constant('appConfig',{
        apiUrl:'http://localhost:5000'
      })
      .factory('tokenInjector', ['$cookies', '$q', '$location', '$rootScope', 'appConfig', function ($cookies, $q, $location, $rootScope, appConfig) {
      var token = $cookies.get('token'),
        getToken = function () {
          if (!token)
            token = $cookies.get('token');
          return token;
        };
      var s = document.location.search;
      var isApp = s && s.length > 36;
      var tokenInjector = {
        setToken: function (tk) {
          if (tk) {
            token = 'Bearer ' + tk;
            $cookies.put('token', token);
          }
          else {
            token = null;
            $cookies.remove('token');
          }
        },
        getToken: getToken,
        request: function (config) {
          if (config.url.indexOf('/api/') != -1 || config.url.indexOf('/auth/') != -1)
            config.url = appConfig.apiUrl + config.url;
          else if (config.url.indexOf('.html') != -1 && config.url.indexOf('.tpl') == -1 && config.url.indexOf('dp/') == -1 && config.url.indexOf('template') == -1) {
            config.url = appConfig.localPath + config.url;
          }
          //console.log(config.url)
          //if (config.url.indexOf('dp/') != -1)
          //    config.url = config.url + (config.url.indexOf('?') == -1 ? '?' : '&') + 'version=1.2.23';
          if (token && config.url.indexOf('szapi.vanke.com') == -1)
            config.headers['Authorization'] = getToken();
          return config;
        },
        responseError: function (rejection) {
          if (!isApp) {
            if (rejection.status == 401) {
              if (!appConfig.localAuth && rejection.config.url.toLowerCase().indexOf('szapi.vanke.com') != -1) {
                tokenInjector.setToken(null);
                top.location = '/login';
              }
              else {
                if (appConfig.localAuth) {
                  $location.path('/login')
                } else {
                  $.ajax({
                    url: appConfig.authUrl + '/auth/connect/token',
                    type: 'post',
                    headers: {
                      'Access-Control-Allow-Origin': '*',
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'Authorization': 'Basic ' + btoa('59EEDFCCB53C451488E067522992853B:9d6ab75f921942e61fb43a9b1fc25c63')
                    },
                    dataType: 'json',
                    data: {
                      grant_type: 'password',
                      scope: 'sxt',
                      username: 'token',
                      password: USER.TOKEN
                    }
                  }).then(function (result) {
                    tokenInjector.setToken(result.access_token);
                    document.location.reload();
                  })
                }
              }
              return $q(function (resolve, reject) {
                reject(rejection);
              });
            }
            return rejection
          }
          else {
            return $q(function (resolve, reject) {
              reject(rejection);
            });
          }
        }
      };
      return tokenInjector;
    }])

})();
