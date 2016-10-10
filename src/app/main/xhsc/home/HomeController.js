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
  function HomeController($scope,auth,$state,$rootScope,$timeout, utils,remote,api,versionUpdate)
  {
    versionUpdate.check();
    var vm = this;
    api.setNetwork(0).then(function(){
      remote.profile()
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
          $state.go('app.pcReport_bd',{projectId:item.projectId, projectName: item.title});
        },200)

      }
      function markerClick($current){
        //$state.go('app.xhsc.xxjd.xxjdmain',{projectId:$current.projectId, projectName:$current.title});
        $state.go('app.pcReport_bd',{projectId:$current.projectId, projectName:$current.title});
      }
    })
  }
})();
