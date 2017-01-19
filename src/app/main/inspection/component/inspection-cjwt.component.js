/**
 * Created by emma on 2016/11/15.
 */
(function(){
  'use strict';

  angular
    .module('app.inspection')
    .component('inspectionCjwt',{
      templateUrl:'app/main/inspection/component/inspection-cjwt.html',
      controller:inspectionCjwtController,
      controllerAs:'vm'
    });

  /**@ngInject*/
  function inspectionCjwtController($scope,utils,$state,$rootScope,api,$stateParams,$timeout){
    var vm = this;
    vm.parm={
      type:'delivery',
      parent_id:'',
      enabled:true,
      page_size:10,
      page_number:1
    }
    $scope.source=[];

    function wrap(source) {
      if (angular.isArray(source)){
        return source.filter(function (k) {
            var t=k.children.filter(function (n) {
                return n.children.length>0;
            })
           k.children=t
           return t.length>0;
        })
      }
      return source;
    }



    api.inspection.estate.issues_tree(vm.parm).then(function (r) {
      $scope.options =wrap( r.data.data);
      $scope.source.push($scope.options)
    });
    $rootScope.shell.prev = '返回';
    utils.onCmd($scope,['prev'],function(cmd,e){

    })



    $scope.select = function(item,index){
       var ind=0;
      $scope.source.forEach(function (k) {
          if(ind>=index){
            k.forEach(function (n) {
              n.check=false;
            });
          }
         ind++;
       });
       for (var i=$scope.source.length-1;i>=0;i--){
          if (i>index){
            $scope.source.splice(i,1)
          }
       }
       item.check=true;
      $scope.source[index+1]=item.children;
    }

    $scope.check = function (item) {
      $state.go('app.inspection.check',{issues:item.issue_id})
    }
  }
})();
