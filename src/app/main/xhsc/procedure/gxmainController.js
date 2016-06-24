/**
 * Created by emma on 2016/6/21.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxmainController',gxmainController);

  /**@ngInject*/
  function gxmainController(remote,xhUtils,$rootScope,utils,api,$q){
    var vm = this;
    remote.Project.getMap().then(function(result){
      var w = [];
      result.data.forEach(function (item) {
        w.push(api.setting('project:'+item.ProjectID));
      });
      $q.all(w).then(function (rs) {
        var ix=0;
        result.data.forEach(function (item) {
          item.isOffline = rs[ix++]?true:false;
        });
        vm.projects = result.data;
      });

    });

    vm.download = function(item){
      item.isDown = true;
      var ix=1,len = 7;
      item.progress = ix/len;
      remote.Project.getDrawings(item.ProjectID).then(function () {
        ix++;item.progress = ix/len;
        remote.Project.getDrawingRelations(item.ProjectID).then(function () {
          ix++;item.progress = ix/len;
          remote.Project.queryAllBulidings(item.ProjectID).then(function () {
            ix++;item.progress = ix/len;
            remote.Procedure.getRegionStatus(item.ProjectID).then(function () {
              ix++;item.progress = ix/len;
              remote.Procedure.queryProcedure().then(function () {
                api.setting('project:'+item.ProjectID,{ProjectID:item.ProjectID,date:new Date()}).then(function () {
                  ix++;
                  item.progress = ix/len;
                  item.isOffline = true;
                })
              });
            });
          })
        })
      });
    }

  }
})();
