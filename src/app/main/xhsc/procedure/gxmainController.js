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
      result.data.forEach(function (item) {
        remote.offline.query('zj'+item.ProjectID).then(function (r) {
          item.isOffline = !!r.data.length;
        });
      });
      vm.projects = result.data;
    });
    //所有全局任务
    var globalTask = [
      function () {
        return remote.Procedure.queryProcedure();
      }
    ];
    //项目包
    function projectTask(projectId,areas,acceptanceItemID) {
      return [
        function (tasks) {
          return $q(function(resolve) {
            remote.Project.getDrawingRelations(projectId).then(function (result) {
              var pics = [];
              result.data.forEach(function (item) {
                if ((!acceptanceItemID || item.AcceptanceItemID == acceptanceItemID) &&
                  (!areas || areas.find(function (a) {
                    return a.AreaID==item.RegionId;
                  }))&&
                  pics.indexOf(item.DrawingID) == -1) {
                  pics.push(item.DrawingID);
                }
              });
              //console.log(pics);
              pics.forEach(function (drawingID) {
                tasks.push(function () {
                  return remote.Project.getDrawing(drawingID);
                })
              });
              resolve(result);
            })
          })
        },
        function () {
          return remote.Project.queryAllBulidings(projectId);
        }
      ]
    }
/*    function projectPoints(projectId,sign) {
      return
    }*/
    function InspectionTask(item) {
      var t = [function () {
        return remote.Project.getInspectionList(item.InspectionId);
      }];
      item.Children.forEach(function (area) {
        t.push(function (tasks,down) {
            return remote.Procedure.InspectionCheckpoint.query(item.AcceptanceItemID,area.AreaID,item.InspectionId).then(function (result) {
              result.data.forEach(function (p) {
                tasks.push(function () {
                  return remote.Procedure.InspectionProblemRecord.query(p.CheckpointID).then(function (result) {
                    result.data.forEach(function (r) {
                      tasks.push(function () {
                        return remote.Procedure.InspectionProblemRecordFile.query(r.ProblemRecordID).then(function (result) {
                          result.data.forEach(function (f) {
                            tasks.push(function () {
                              return down('images',f.Id+'.jpg',f.FileUrl);
                            })
                          })
                        })
                      })
                    })
                  })
                });
              });
            })
          });
        t.push(function(){
          return remote.Procedure.InspectionIndexJoinApi.query(item.InspectionId)
        })
        t.push(function () {
          return remote.Procedure.InspectionPoint.query(item.AcceptanceItemID,item.InspectionId,area.AreaID)
        })

      });
      return t;
    }

    function rectificationTask(item) {
      return [
        function (tasks) {
          return remote.Procedure.getZGById(item.RectificationID).then(function (r) {
            r.data[0].Children.forEach(function (area) {
              tasks.push(function () {
                return remote.Procedure.getZGReginQues(area.AreaID,item.RectificationID);
              });
              tasks.push(function () {
                return remote.Procedure.getZGReginQuesPoint(area.AreaID,item.RectificationID);
              })
            })
          });
        },
        function () {
          return remote.Procedure.getRectification(item.RectificationID);
        }
      ]
    }

    vm.downloadzj = function (item) {
     var tasks = [].concat(globalTask)
       .concat(projectTask(item.ProjectID))
       .concat([
         function (tasks) {
           return remote.Procedure.getRegionStatus(item.ProjectID,"8").then(function (result) {
             result.data.forEach(function (item) {
               if(item.AcceptanceItemID && item.AreaId && item.InspectionId) {
                 tasks.push(function () {
                   return remote.Project.getInspectionList(item.InspectionId);
                 });
                 tasks.push(function () {
                   return remote.Procedure.InspectionCheckpoint.query(item.AcceptanceItemID, item.AreaId, item.InspectionId);
                 })
               }
             })
           })
         }
       ]);
     api.task(tasks,{
       event:'downloadzj',
       target:item
     })(null, function () {
       item.percent = item.current = item.total = null;
       item.isOffline = true;
       remote.offline.create({Id:'zj'+item.ProjectID});
       utils.alert('下载完成');

     }, function () {
       item.percent = item.current = item.total = null;
       utils.alert('下载失败,请检查网络');
     })
   };

    api.event('downloadzj',function (s,e) {
      var current = vm.projects && vm.projects.find(function (item) {
          return item.ProjectID==e.target.ProjectID;
        });
      if(current) {
        switch (e.event) {
          case 'progress':
            current.percent = parseInt(e.percent * 100) + ' %';
            current.current = e.current;
            current.total = e.total;
            break;
          case 'success':
          current.isOffline = true;
          break;
        }
      }
    },$scope);

    vm.downloadys = function (item) {
      var tasks = [].concat(globalTask)
        .concat(projectTask(item.ProjectID,item.Children,item.AcceptanceItemID))
        .concat(InspectionTask(item));
      //console.log(tasks);
      api.task(tasks,{
        event:'downloadys',
        target:item.InspectionId
      })(null, function () {
        item.percent = item.current = item.total = null;
        item.isOffline = true;
        utils.alert('下载完成');
      }, function () {
        utils.alert('下载失败,请检查网络');
        item.percent = item.current = item.total = null;
      },{timeout:300000})
    }

    api.event('downloadys',function (s,e) {
      var current = vm.Inspections && vm.Inspections.find(function (item) {
          return item.InspectionId==e.target;
        });
      if(current) {
        switch (e.event) {
          case 'progress':
            current.percent = parseInt(e.percent * 100) + ' %';
            current.current = e.current;
            current.total = e.total;
            break;
          case 'success':
            current.isOffline = true;
            break;
        }
      }
    },$scope);


    vm.downloadzg = function (item) {
      var tasks = [].concat(globalTask)
        .concat(projectTask(item.Children[0].AreaID.substring(0, 5), item.Children, item.AcceptanceItemID))
        .concat(InspectionTask(item))
        .concat(rectificationTask(item));

      api.task(tasks, {
        event: 'downloadzg',
        target: item.RectificationID
      })(null, function () {
        item.percent = item.current = item.total = null;
        item.isOffline = true;
        utils.alert('下载完成');
      }, function () {
        utils.alert('下载失败,请检查网络');
        item.percent = item.current = item.total = null;
      });
    }

    api.event('downloadzg',function (s,e) {
      var current = vm.zglist && vm.zglist.find(function (item) {
          return item.RectificationID==e.target;
        });
      if(current) {
        switch (e.event) {
          case 'progress':
            current.percent = parseInt(e.percent * 100) + ' %';
            current.current = e.current;
            current.total = e.total;
            break;
          case 'success':

            break;
        }
      }
    },$scope);

    vm.uploadInfo={}
    vm.upload =function () {
      vm.uploadInfo.uploading = true;
      api.upload(function (cfg,item) {
        if(cfg._id=='s_files' && item && item.Url.indexOf('base64')==-1){
          return false;
        }
        return true;
      },function (percent,current,total) {
        vm.uploadInfo.percent = parseInt(percent *100) +' %';
        vm.uploadInfo.current = current;
        vm.uploadInfo.total = total;
      },function () {
        vm.uploadInfo.uploaded = 1;
        api.uploadTask(function () {
          return true
        },null);
        utils.alert('上传完成');
        vm.uploadInfo.tasks = [];
        vm.uploadInfo.uploading= false;


      },function () {
        vm.uploadInfo.uploaded = 0;
        utils.alert('上传失败');
        vm.uploadInfo =false;
      },{
        uploaded:function (cfg,row,result) {
          cfg.db.delete(row._id);
        }
      });
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
      var tasks = [].concat(globalTask).concat(projectTask(item.ProjectID));
      api.task(tasks)(function (percent, current, total) {
        item.percent = parseInt(percent * 100) + ' %';
        item.current = current;
        item.total = total;
      }, function () {
        item.percent = item.current = item.total = null;
        item.isOffline = true;
        utils.alert('下载完成');
      }, function () {
        item.percent = item.current = item.total = null;
        utils.alert('下载失败,请检查网络');
      })

    };

    remote.Procedure.getInspections(31).then(function(r){
      vm.Inspections=[];
      r.data.forEach(function(o){
        if (o.Sign!=8){
          vm.Inspections.push(o);
        }
      });
      //vm.Inspections= r.data;
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
    vm.exportReport = function(item){
      $state.go('app.xhsc.gx.gxzgreport')
      //window.open(sxt.app.api+'/api/Office/ExportWord?inspectionId='+item.InspectionId);
      // window.open('app/main/xhsc/images/bg.png')
    }
    vm.Lookintoys = function(item){
      $state.go('app.xhsc.gx.gxzgreport',{InspectionId:item.InspectionId, q:item.AcceptanceItemID,acceptanceItemName:item.AcceptanceItemName,projectId:item.ProjectID});
    }
    vm.Lookinto = function(item){
      console.log(item)
      $state.go('app.xhsc.gx.gxzgdetail',{InspectionId:item.InspectionId,acceptanceItemID:item.AcceptanceItemID,acceptanceItemName:item.AcceptanceItemName,projectId:item.ProjectID});
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
