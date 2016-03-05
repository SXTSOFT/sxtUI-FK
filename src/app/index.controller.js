(function ()
{
    'use strict';

    angular
        .module('sxt')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming,$state,$scope,$rootScope,utils,$http)
    {
        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;
      $rootScope.showgz = function(){
        return $state.is('app.szgc.tzg');
      };
      $rootScope.send = function($event){
        utils.alert('发送成功',$event,function(){
          $http.get ('http://vkde.sxtsoft.com/api/ProjectEx/'+utils.id).then (function (result) {
            var project = result.data;
            if (project.AreaRemark) {
              try {
                var d = JSON.parse(project.AreaRemark),zg=[];
                d.features.forEach(function(f,i){
                  if(f.options.pid== $rootScope.pid){
                    f.options.summary = $rootScope.summary;
                  }
                });

                project.AreaRemark = JSON.stringify(d);
                $http.put('http://vkde.sxtsoft.com/api/ProjectEx/'+project.ProjectId,project).then(function () {
                  history.back();
                });
              }
              catch (ex) {
                history.back();
              }
            }
            else{
              history.back();
            }
          });

        })
      }
    }
})();
