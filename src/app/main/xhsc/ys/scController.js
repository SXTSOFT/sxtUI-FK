/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('scController',scController)
  /** @ngInject */
  function scController($scope,remote){
    var vm = this;
    remote.Measure.MeasureIndex.query('').then(function(r){
      vm.MeasureIndexs = r.data.rows;
    });
  }
})();
