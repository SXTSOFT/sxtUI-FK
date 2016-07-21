/**
 * Created by lss on 2016/7/21.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .factory('gxOfflinePack',gxOfflinePack);
  /** @ngInject */
  function gxOfflinePack(api){

    return {
      download:download
    };
    function download(market,progress,success,fail){
      switch (market){
        case "zbzj":
          zbzj(progress,success,fail);
              break;
        case "zbzg":
          zbzg(progress,success,fail);
              break;
        case "jlys":
          jlys(progress,success,fail);
              break;
        case  "jlfy":
          jlfy(progress,success,fail);
              break;
      }
    }
    function jlfy(progress,success,fail)
    {

    }

    function  jlys(progress,success,fail){

    }
    function zbzj(progress,success,fail){

    }
    function zbzg(progress,success,fail){
      var  remote=api.xhsc;
      api.task([function(){
        return remote.Procedure.queryProcedure();
      },function(){
        return remote.Procedure.getInspectionInfoBySign(8);
      },function(tasks){
        return remote.Project.getMap().then(function(result){
          result.data.forEach(function (item) {
            tasks.push(remote.Project.queryAllBulidings(item.ProjectID));
            tasks.push(remote.Procedure.getRegionStatus(projectId,8));
            tasks.push(remote.Procedure.getDrawingRelations(projectId,8).then(function(r){
              r.data.forEach(function (item_draw){
                tasks.push( remote.Procedure.getDrawing(item_draw.DrawingID));
              });
            }))
          });
        });
      }])(progress,success,fail);
    }
  }
})();
