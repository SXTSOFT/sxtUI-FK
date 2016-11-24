/**
 * Created by HuangQingFeng on 2016/11/22.
 */
(function(angular,undefined){
  'use strict';
  angular
    .module('app.earthwork')
    .config(config);

  /** @ngInject */
  function config(apiProvider){
    var $http = apiProvider.$http,
      $q = apiProvider.$q;
    apiProvider.register('earthwork', {
      earthwork: {
        save: function (data) {
          return $http.post('/api/Eartwork/SaveAsync', data);
        },
        getEarthworkByRegionTreeId:function (args) {
          return $http.get($http.url('/api/Eartwork/GetEarthworkByRegionTreeId',{regionTreeId:args.regionTreeId}));
        },
        getEarthworkList:function (args) {
          return $http.get($http.url('/api/Eartwork/GetEarthworkList',{regionTreeId:args.regionTreeId,status:args.status}));
        },
        createEarthworkArea: function (data) {
          return $http.post('/api/Eartwork/CreateEarthworkArea', data);
        },
        updateEarthworkArea: function (id,data) {
          return $http.put('/api/Eartwork/UpdateEarthworkArea/' + id, data);
        },
        delete:function (id) {
          return $http.delete('/api/Eartwork/' + id);
        }
      }
    })
  }
})(angular,undefined);
