/**
 * Created by emma on 2016/6/21.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxmainController',gxmainController);

  /**@ngInject*/
  function gxmainController(remote,xhUtils,$rootScope,utils,api,$q,$state){
    var vm = this;
    function setGxList(gxdata){
      vm.gxList=[];
      var promises;
      gxdata.forEach(function(item){
        if(item.isOffline){
          promises=[
            remote.Project.getInspectionList(item.ProjectID),
            remote.Project.queryAllBulidings(item.ProjectID)
          ];
          $q.all(promises).then(function(rtn){
            var res=rtn[0],_res=rtn[1];
            res.data.forEach(function(r){
              r.Children.forEach(function(_r){
                  var tempName = xhUtils.findRegion(_res.data[0].RegionRelations[0],_r.AreaID);
                  _r.newName = item.ProjectName + tempName.fullName + _r.Describe;
                  _r.projectId = item.ProjectID;
              })
              vm.gxList.push(r);
            })
          });
        }
      });
    }
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
        setGxList(result.data);
        vm.projects = result.data;


      });
    });
    vm.ys = function(item){
      $state.go('app.xhsc.gx.gxtest',{acceptanceItemID:item.AcceptanceItemID,acceptanceItemName:item.AcceptanceItemName,name:item.Children[0].newName,
        projectId:item.Children[0].projectId,areaId:item.Children[0].AreaID,InspectionId:item.InspectionId})
    }
    vm.download = function(item){
      item.isDown = true;
      var ix=1,len = 8;
      item.progress = ix/len;
      api.task([function () {
        return remote.Project.getDrawings(item.ProjectID)
      },function () {
        return remote.Project.getDrawingRelations(item.ProjectID);
      },function () {
        return remote.Project.queryAllBulidings(item.ProjectID);
      },function () {
        return remote.Procedure.getRegionStatus(item.ProjectID);
      },function () {
        return remote.Procedure.queryProcedure();
      },function(){
        return remote.Project.getInspectionList(item.ProjectID);
      },function () {
        return api.setting('project:'+item.ProjectID,{ProjectID:item.ProjectID,date:new Date()});
      }])(function (persent) {
        item.progress = persent*100;
      },function () {
        item.progress = 100;
        item.isOffline = true;
        setGxList([item]);
      },function () {
        item.isDown = false;
        utils.alert('下载失败,请检查网络');
      });
    }

    vm.zg = function(){
      $state.go('app.xhsc.gx.gxzg')
    }

  }
})();
