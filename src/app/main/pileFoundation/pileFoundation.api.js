/**
 * Created by HuangQingFeng on 2016/11/28.
 */
(function(angular,undefined){
  'use strict';
  angular
    .module('app.pileFoundation')
    .config(config);

  /** @ngInject */
  function config(apiProvider){
    var $http = apiProvider.$http,
      $q = apiProvider.$q;
    apiProvider.register('pileFoundation', {
      pileFoundation: {
        save: function (data) {
          return $http.post('/api/PileFoundation/SaveAsync', data);
        },
        getPileFoundationByRegionTreeId:function (args) {
          return $http.get($http.url('/api/PileFoundation/GetPileFoundationByRegionTreeId',{regionTreeId:args.regionTreeId}));
        },
        getPileFoundationList:function (args) {
          return $http.get($http.url('/api/PileFoundation/GetPileFoundationList',{regionTreeId:args.regionTreeId,status:args.status}));
        },
        createPileFoundationArea: function (data) {
          return $http.post('/api/PileFoundation/CreatePileFoundationArea', data);
        },
        updatePileFoundationArea: function (id,data) {
          return $http.put('/api/PileFoundation/UpdatePileFoundationArea/' + id, data);
        },
        delete:function (id) {
          return $http.delete('/api/PileFoundation/' + id);
        }
      }
    })
  }
})(angular,undefined);
