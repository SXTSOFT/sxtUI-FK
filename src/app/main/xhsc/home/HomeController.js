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
  function HomeController($scope,auth,$state,$rootScope,$timeout, utils,remote,api,versionUpdate,delopy)
  {
    // versionUpdate.check();
    var vm = this;
    // delopy.update(function (self,r0,version,isIntall) {
    //   if (isIntall)
    //     return utils.confirm('发现新版本：' + r0 + '，是否更新？')
    //   else {
    //     return utils.confirm('版本已经更新完毕，是否重新启动?')
    //   }
    // });

    $rootScope.lst=true;


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
            var py=window.Pinyin.getPinyinArrayFirst(item.title)
            py=py.join("");
            if(!text || text=='' || item.title.indexOf(text)!=-1||py.toLowerCase().indexOf(text.toLowerCase())>-1){
              k.push(item);
            }
          })
        }
        return k;
      }
      vm.changeItem = function(item){
        $timeout(function(){
          $state.go('app.progress',{projectId:item.projectId, projectName: item.title});
        },200)

      }
      function markerClick($current){
        //$state.go('app.xhsc.xxjd.xxjdmain',{projectId:$current.projectId, projectName:$current.title});
        $state.go('app.progress',{projectId:$current.projectId, projectName:$current.title});
      }
    })

    $scope.$on("$destroy", function () {
      $rootScope.lst=false;
    });
  }
})();
