/**
 * Created by lss on 2016/5/3.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('offlineController',offlineController)
  /** @ngInject */
  function offlineController($scope,remote,xhUtils,$stateParams,utils,$mdDialog,$state,$rootScope,db) {
    var vm = this;
    $rootScope.title = 'my title';
    remote.Measure.query('01111').then(function(result){
      var r = db('regions');
     var data = result.data;
      data._id='123';
      r.put(vm.regions).then(function(){
        r.allDocs({}).then(function(result){
          vm.regions = result;
        })
      })

    })
  }
})();
