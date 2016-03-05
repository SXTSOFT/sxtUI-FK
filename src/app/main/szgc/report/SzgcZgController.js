/**
 * Created by emma on 2016/3/5.
 */
(function(){
  'use strict';

  angular
  .module('app.szgc')
    .controller('SzgcZgController',SzgcZgController);

  /** @ngInject */
  function  SzgcZgController($stateParams,utils,$http,$scope,$rootScope){
    $rootScope.pid = $stateParams.pid;
    $scope.$watch('summary',function(){
      $rootScope.summary = $scope.summary;
    })
    if($stateParams.pid){
      $scope.p = $stateParams;
      $http.get('http://vkde.sxtsoft.com/api/Files?group='+$stateParams.pid).then(function(result){
        $scope.images = result.data.Files;
      })
    }
    else{
      $http.get ('http://vkde.sxtsoft.com/api/ProjectEx/'+utils.id).then (function (result) {
        var project = result.data;
        if (project.AreaRemark) {
          try {
            var d = JSON.parse(project.AreaRemark);
            var zg = [];
            d.features.forEach(function(f){
              if(f.geometry.type=='Point'){
                zg.push(f.options)
              }
            })
            console.log('d',d)
            $scope.zg = zg;
          }
          catch (ex) {

          }
        }
      });
    }
  }
})();
