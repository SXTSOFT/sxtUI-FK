/**
 * Created by emma on 2016/6/21.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxmainController',gxmainController);

  /**@ngInject*/
  function gxmainController(remote,xhUtils,$rootScope,utils,api,$q,$state,gxOfflinePack,$scope){
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
    //所有全局任务
    var globalTask = [
      function () {
        return remote.Procedure.queryProcedure();
      }
    ];
    function projectTask(projectId) {
      return [
        function () {
          return remote.Project.queryAllBulidings(projectId);
        },
        function () {
          return remote.Procedure.getRegionStatus(projectId)
        }
      ]
    }

    vm.loadPack=function(market,item){
      gxOfflinePack.download(market,function(percent,current,total){
        item.percent = parseInt(percent *100) +' %';
        item.current = current;
        item.total = total;
      },function(){
        item.percent = item.current = item.total = null;
        item.isOffline = true;
      },function(){
        utils.alert('下载失败,请检查网络');
      });
    }

    vm.download = function(item){
      item.isDown = true;
      var ix=1,len = 6;
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
      },function () {
        return api.setting('project:'+item.ProjectID,{ProjectID:item.ProjectID,date:new Date()});
      }])(function (persent) {
        item.progress = persent*100;
      },function () {
        item.progress = 100;
        item.isOffline = true;
      },function () {
        item.isDown = false;
        utils.alert('下载失败,请检查网络');
      });
    };

    remote.Procedure.getInspections(1).then(function(r){
      vm.Inspections= r.data;
    });
    vm.MemberType = [];
    remote.Procedure.authorityByUserId().then(function(res){
      console.log('resId',res)
      res.data.forEach(function(r){
        vm.MemberType.push(r.MemberType);
      })
    })
    $scope.$watch('vm.MemberType',function(){
      vm.showPermission = function(type){
        return vm.MemberType.indexOf(type) > -1;
      }
    })

    vm.loadInspection = function(item){
      item.isDown = true;
      var ix = 1,len =2;
      item.progress = ix/len;
      api.task([function(){
        return  remote.Project.getInspectionList(item.InspectionId);
      },function () {
        return api.setting('inspectionList:'+item.InspectionId,{InspectionId:item.InspectionId});
      }])(function (persent) {
        item.progress = persent*100;
      },function () {
        item.progress = 100;
        item.isOffline = true;
      },function () {
        item.isDown = false;
        utils.alert('下载失败,请检查网络');
      });
    }
    vm.zgdownload = function(item){
      item.isDown = true;
      var ix = 1,len =2;
      item.progress = ix/len;
      api.task([function(tasks){
        return  remote.Procedure.getZGById(item.RectificationID).then(function(result){
          var promise=[];
          result.data[0].Children.forEach(function(r){
            promise=[
              remote.Procedure.getZGReginQues(r.AreaID,item.RectificationID),
              remote.Procedure.getZGReginQuesPoint(r.AreaID,item.RectificationID)
            ]
            tasks.push(function(){
              return $q.all(promise);
            })
          })
        });
      },function () {
        return api.setting('zgList:'+item.RectificationID,{RectificationID:item.RectificationID});
      }])(function (persent) {
        item.progress = persent*100;
      },function () {
        item.progress = 100;
        item.isOffline = true;
      },function () {
        item.isDown = false;
        utils.alert('下载失败,请检查网络');
      });
    }
    vm.upInspection = function(){
      api.upload(function(cfg,item){
        return true;
      },function(){

      },function(){
        utils.alert('上传成功',null,function(){
          $state.go("app.xhsc.gx.gxmain",{index:0});
        });
      },function(){
        utils.alert('上传失败');
      },{
        uploaded:function (cfg,row,result) {
          cfg.db.delete(row._id);
        }
      })
    }
    remote.Procedure.getZGlist(31).then(function (r) {
      vm.zglist = [];
      var list=[]
      if (angular.isArray(r.data)){
        r.data.forEach(function(o){
           // vm.zglist.push(o);
          list.push(api.setting('zgList:'+ o.RectificationID))
        });
        $q.all(list).then(function (rs) {
          var ix=0;
          r.data.forEach(function (item) {
              item.isOffline = rs[ix++]?true:false;
              vm.zglist.push(item);
          });
        });
      }
    });

/*    remote.Procedure.getInspectionInfoBySign(8).then(function (r) {
      vm.fyList = r.data;
    });*/

    vm.ys = function(item){
      $state.go('app.xhsc.gx.gxtest',{acceptanceItemID:item.AcceptanceItemID,acceptanceItemName:item.AcceptanceItemName,name:item.Children[0].newName,
        projectId:item.ProjectID,areaId:item.Children[0].AreaID,InspectionId:item.InspectionId})
    };

    vm.fy = function(r){
      $state.go('app.xhsc.gx.gxzg',{Role:'jl',InspectionID: r.InspectionId,AcceptanceItemID: r.AcceptanceItemID,RectificationID: r.RectificationID})
    };

    //vm.selectedIndex = 2;

    vm.zg = function(r){
      $state.go('app.xhsc.gx.gxzg',{Role:'zb',InspectionID: r.InspectionId,AcceptanceItemID: r.AcceptanceItemID,RectificationID: r.RectificationID});
    };

    vm.fj = function (r) {
      $state.go('app.xhsc.gx.gxzjcheck',
        {
          acceptanceItemID:r.AcceptanceItemID,
          acceptanceItemName:r.AcceptanceItemName,
          //name: vm.data.AreaList[0].newName,
          projectId:r.ProjectID,
          //areaId:vm.data.AreaList[0].AreaID,
          InspectionId:r.InspectionId
        }
      )
    }
  }
})();
