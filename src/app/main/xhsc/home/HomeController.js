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

    function markerClick($current){
    //  appCookie.put('projects',JSON.stringify([{project_id:$current.projectId,name:$current.title}]))
      //$state.go('app.xhsc.choose',{pid:$current.projectId, pname:'天津星河时代'});
      $mdBottomSheet.show({
       //templateUrl: 'app/main/xhsc/home/homeBottom.html',
        template: '<md-bottom-sheet>Hello!</md-bottom-sheet>',
        controller: ['$scope','$mdBottomSheet',function($scope,$mdBottomSheet){
          $scope.hide = function(){
            $mdBottomSheet.hide();
          }
        }],
        disableBackdrop:true
      }).then(function(clickedItem) {
        //$mdBottomSheet.hide(clickedItem);
      });
    }
  }
})();
