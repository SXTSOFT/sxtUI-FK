/**
 * Created by jiuyuong on 2016/3/30.
 */
(function ()
{
  'use strict';

  angular
    .module('app.xhsc')
    .controller('HomeController', HomeController);

  /** @ngInject */
  function HomeController($scope,auth,$state,$rootScope,$timeout, $mdBottomSheet)
  {

    var vm = this;
    vm.data = {};
    vm.is = function (state) {
      return vm.includes(state);
    }
    vm.markerClick = markerClick;
    vm.querySearch = function(text){
      var k=[];
      if(vm.markers){
        vm.markers.forEach(function(item){
          if(!text || text=='' || item.title.indexOf(text)!=-1 || item.pinyin.indexOf(text)!=-1){
            k.push(item);
          }
        })
      }
      return k;
    }
    vm.changeItem = function(item){
      $timeout(function(){
        $state.go('app.xhsc.choose',{pid:item.projectId, pname: item.title});
      },200)

    }

    //function markerClick($current){
    //  console.log('current',JSON.stringify([{project_id:$current.projectId,name:$current.title}]))
    //
    ////  appCookie.put('projects',JSON.stringify([{project_id:$current.projectId,name:$current.title}]))
    //  //$state.go('app.xhsc.choose',{pid:$current.projectId, pname:'天津星河时代'});
    //  $mdBottomSheet.show({
    //   templateUrl: 'app/main/xhsc/home/homeBottom.html',
    //    controller: ['$scope',function($scope){
    //      $scope.name = $current.title;
    //      $scope.projectId = $current.projectId;
    //      $scope.hide = function(){
    //        $mdBottomSheet.hide();
    //      }
    //    }],
    //    clickOutsideToClose:true,
    //    disableBackdrop:true
    //  }).then(function(clickedItem) {
    //    //$mdBottomSheet.hide(clickedItem);
    //  });
    //
    //}
    function markerClick($current){
      $state.go('app.xhsc.xxjd.xxjdmain',{projectId:$current.projectId, projectName:$current.title});
    }
    //vm.markerClick = function(){
    // // vm.showBot = true;
    //  $mdBottomSheet.show({
    //    templateUrl: 'app/main/xhsc/home/homeBottom.html',
    //    controller: ['$scope',function($scope){
    //      $scope.hide = function(){
    //        $mdBottomSheet.hide();
    //      }
    //
    //    }],
    //    disableBackdrop:true
    //  }).then(function(){
    //
    //  })
    //}
  }
})();
