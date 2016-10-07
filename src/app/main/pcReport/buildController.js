/**
 * Created by lss on 2016/9/18.
 */
/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.pcReport')
    .controller('buildController',buildController);

  /** @ngInject */
  function buildController($scope,$stateParams,remote){
    var vm=this;
    vm.projectName=$stateParams.projectName;
    remote.Project.GetAreaChildenbyID($stateParams.projectId).then(function(r){
        vm.area= r&& r.data? r.data:[];
        vm.area.forEach(function(k){
          remote.Project.GetAreaChildenbyID(k.RegionID).then(function(n){
            k.children=n&& n.data? n.data:[];
          });
        });
    });
  }
})();
/**
 * Created by lss on 2016/10/7.
 */
