/**
 * Created by lss on 2016/5/19.
 */
/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('xtzlChooseController',xtzlChooseController);

  /** @ngInject */
  function xtzlChooseController($scope,$stateParams,db,$rootScope,xhUtils,$timeout){
    var vm=this,
      id = $stateParams.assessmentID;

    vm.ms=[];
    var pk = db('xcpk');
    var data = db('pack'+id);
    pk.get('xcpk').then(function (pk) {
      var item = pk.rows.find(function (it) {
        return it.AssessmentID == id;
      });
      if (angular.isArray(item.AssessmentClassifyRegions)&&item.AssessmentClassifyRegions.length){
          item.AssessmentClassifyRegions.forEach(function(o){
            vm.ms.push(angular.extend({
              AssessmentID:item.AssessmentID
            },o));
         });
      }
    })
  }
})();
