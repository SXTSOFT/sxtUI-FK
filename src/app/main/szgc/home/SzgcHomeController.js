(function ()
{
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcHomeController', SzgcHomeController);

  /** @ngInject */
  function SzgcHomeController($scope,auth,$state,$rootScope,appCookie,$timeout,versionUpdate,api)
  {

    api.szgc.vanke.profile();
    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 //|| u.indexOf('Linux') > -1; //android终端或者uc浏览器
   // var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    //alert('是否是Android：'+isAndroid);
    //alert('是否是iOS：'+isiOS);

    if(isAndroid)
    {
      versionUpdate.check();

    }

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
        $state.go('app.szgc.project',{pid:item.projectId, pname: item.title});
      },200)

    }

    function markerClick($current){
      appCookie.put('projects',JSON.stringify([{project_id:$current.projectId,name:$current.title}]))
      $state.go('app.szgc.project',{pid:$current.projectId, pname: $current.title});
    }
  }
})();
