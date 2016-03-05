/**
 * Created by emma on 2016/3/5.
 */
(function(){
  'use strict';

  angular
  .module('app.szgc')
    .controller('SzgcZgController',SzgcZgController);

  /** @ngInject */
  function  SzgcZgController($stateParams,utils,$http,$scope){
    if($stateParams.pid){

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
})()
