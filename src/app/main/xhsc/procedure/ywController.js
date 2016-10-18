/**
 * Created by lss on 2016/9/22.
 */
/**
 * Created by emma on 2016/6/21.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('ywController',ywController);

  /**@ngInject*/
  function ywController(remote,xhUtils,$rootScope,utils,api,$q,$state,$scope,$mdDialog,db,$mdBottomSheet,$stateParams){
    var vm = this;
    var  dbpics=db('pics')
    vm.procedure=[];
    vm.yw=$stateParams.yw;
    vm.isShowbg=false;
    //所有全局任务
    var globalTask = [
      function () {
        return remote.Procedure.queryProcedure().then(function(r){
          if (r.data&& r.data.length){
            r.data.forEach(function(k){
              if (k.SpecialtyChildren.length){
                k.SpecialtyChildren.forEach(function(m){
                  if (m.WPAcceptanceList.length){
                    vm.procedure=vm.procedure.concat(m.WPAcceptanceList);
                  }
                })
              }
            });
          }
          return r;
        })
      }
    ];
    //项目包
    function projectTask(projectId,areas,acceptanceItemID) {
      return [
        function (tasks) {
          return $q(function(resolve) {
            var arr=[
              remote.Project.getDrawingRelations(projectId),
              dbpics.findAll()
            ];
            $q.all(arr).then(function(res){
              var result=res[0],offPics=res[1].rows;
              var pics = [];
              result.data.forEach(function (item) {
                if ((!acceptanceItemID || item.AcceptanceItemID == acceptanceItemID) &&
                  (!areas || areas.find(function (a) {
                    return a.AreaID==item.RegionId;
                  }))&&
                  pics.indexOf(item.DrawingID) == -1&&!offPics.find(function(r){
                    return r._id==item.DrawingID;
                  })&&vm.procedure.find(function(k){
                    return k.AcceptanceItemID==item.AcceptanceItemID;
                  })) {
                  pics.push(item.DrawingID);
                }
              });
              pics.forEach(function (drawingID) {
                tasks.push(function () {
                  return remote.Project.getDrawing(drawingID).then(function(){
                    dbpics.addOrUpdate({
                      _id:drawingID
                    })
                  });
                })
              });
              resolve(result);
            });
          })
        },
        function () {
          return remote.Project.queryAllBulidings(projectId);
        }
      ]
    }

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
          return remote.Procedure.InspectionPoint.query(item.InspectionId,item.AcceptanceItemID,area.AreaID)
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


    function InspectionZjTask(t,AcceptanceItemID,AreaID,InspectionId) {
      t.push(function () {
        return remote.Procedure.InspectionPoint.query(InspectionId,AcceptanceItemID,AreaID,"InspectionPoint_zj")
      })
      t.push(function (tasks,down) {
        return remote.Procedure.InspectionCheckpoint.query(AcceptanceItemID,AreaID,InspectionId,"InspectionCheckpoint_zj").then(function (result) {
          result.data.forEach(function (p) {
            tasks.push(function () {
              return remote.Procedure.InspectionProblemRecord.query(p.CheckpointID,"InspectionProblemRecord_zj").then(function (result) {
                result.data.forEach(function (r) {
                  tasks.push(function () {
                    return remote.Procedure.InspectionProblemRecordFile.query(r.ProblemRecordID,"","InspectionProblemRecordFile_zj").then(function (result) {
                    })
                  })
                })
              })
            });
          });
        })
      });
    }

     vm.downloadzj = function (item) {
       return api.setNetwork(0).then(function(){
          return $q(function(resolve,reject){
          $mdDialog.show({
            controller: ['$scope','utils','$mdDialog',function ($scope,utils,$mdDialog) {
              $scope.item=item;
              var tasks = [].concat(globalTask)
                .concat(item.isOffline?[]:projectTask(item.ProjectID))
                .concat([
                  function (tasks) {
                    var group=[];
                    var inspections=[];
                    return remote.Procedure.getRegionStatusEx(item.ProjectID,"8",null,"project_status_zj").then(function (result) {
                      result.data.forEach(function (item) {
                        if(item.AcceptanceItemID && item.AreaId && item.InspectionId&&!group.find(function(k){
                            return k.AcceptanceItemID==item.AcceptanceItemID&& k.AreaId==item.AreaId&&k.InspectionId==item.InspectionId
                          })) {
                          group.push([item.AcceptanceItemID,item.AreaId,item.InspectionId]);
                        }
                        if(item.AcceptanceItemID && item.AreaId && item.InspectionId&&!inspections.find(function(k){
                            return k.InspectionId==item.InspectionId;
                          })){
                          inspections.push(item.InspectionId);
                        }
                      })
                      inspections.forEach(function(id){
                        tasks.push(function(){
                          return remote.Project.getInspectionList(id,"Inspection_zj");
                        });
                        //tasks.push(function(){
                        //  return remote.Procedure.InspectionIndexJoinApi.query(id)
                        //});
                      });
                      group.forEach(function(data){
                        InspectionZjTask(tasks,data[0],data[1],data[2]);
                      })
                    })
                  }
                ])
              api.task(tasks,{
                event:'downloadzj',
                target:item
              })(null, function () {
                item.percent = item.current = item.total = null;
                item.isOffline = true;
                $mdDialog.hide();
                utils.alert('下载完成');
                return remote.offline.create({Id:'zj'+item.ProjectID});
                resolve();
              }, function () {
                item.percent = item.current = item.total = null;
                $mdDialog.cancel();
                utils.alert('下载失败,请检查网络');
                reject()
              })
            }],
            template: '<md-dialog aria-label="正在下载基础数据"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate"></md-progress-circular><p style="padding-left: 6px;">正在下载：{{item.ProjectName}} {{item.percent}}({{item.current}}/{{item.total}})</p></md-dialog-content></md-dialog>',
            parent: angular.element(document.body),
            clickOutsideToClose:false,
            fullscreen: false
          });
         })
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
         }
       }
     },$scope);

    vm.downloadys = function (item) {
      return api.setNetwork(0).then(function(){
        return $q(function(resolve,reject){
          $mdDialog.show({
            controller: ['$scope','utils','$mdDialog',function ($scope,utils,$mdDialog) {
              $scope.item=item;
              var tasks = [].concat(globalTask)
                .concat(projectTask(item.ProjectID,item.Children,item.AcceptanceItemID))
                .concat(InspectionTask(item))
                .concat(function(){
                  return remote.offline.create({Id:'ys'+item.InspectionId});
                })
              api.task(tasks,{
                event:'downloadys',
                target:item.InspectionId
              })(null, function () {
                item.percent = item.current = item.total = null;
                item.isOffline = true;
                $mdDialog.hide();
                utils.alert('下载完成');
                resolve();
              }, function () {
                $mdDialog.cancel();
                utils.alert('下载失败,请检查网络');
                item.percent = item.current = item.total = null;
                reject();
              },{timeout:300000})
            }],
            template: '<md-dialog aria-label="正在下载"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate"></md-progress-circular><p style="padding-left: 6px;">正在下载： {{item.AcceptanceItemName}} {{item.percent}}({{item.current}}/{{item.total}})</p></md-dialog-content></md-dialog>',
            parent: angular.element(document.body),
            clickOutsideToClose:false,
            fullscreen: false
          });
        })
      });
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
      return $q(function(resolve,reject){
        api.setNetwork(0).then(function(){
          $mdDialog.show({
            controller: ['$scope','utils','$mdDialog',function ($scope,utils,$mdDialog) {
              $scope.item=item;
              var tasks = [].concat(globalTask)
                .concat(projectTask(item.Children[0].AreaID.substring(0, 5), item.Children, item.AcceptanceItemID))
                .concat(InspectionTask(item))
                .concat(rectificationTask(item))
                .concat(function(){
                  return remote.offline.create({Id:'zg'+item.RectificationID});
                });
              api.task(tasks, {
                event: 'downloadzg',
                target: item.RectificationID
              })(null, function () {
                item.percent = item.current = item.total = null;
                item.isOffline = true;
                remote.offline.create({Id:'zg'+item.RectificationID});
                //RectificationID
                $mdDialog.hide();
                utils.alert('下载完成');
                resolve();
              }, function () {
                $mdDialog.cancel();
                utils.alert('下载失败,请检查网络');
                reject();
                item.percent = item.current = item.total = null;
              });
            }],
            template: '<md-dialog aria-label="正在下载"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate"></md-progress-circular><p style="padding-left: 6px;">正在下载：{{item.ProjectName}} {{item.percent}}({{item.current}}/{{item.total}})</p></md-dialog-content></md-dialog>',
            parent: angular.element(document.body),
            clickOutsideToClose:false,
            fullscreen: false
          });
        });
      })

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

    vm.MemberType = [];
    vm.by=function(r){
      api.setNetwork(0).then(function(){
        $state.go('app.xhsc.gx.gxlist', {role:'zb',projectId:r.ProjectID});
      });
    }
    api.setNetwork(0).then(function(){
      remote.profile().then(function(r){
        if (r.data&& r.data.Role){
          vm.role= r.data.Role.MemberType===0|| r.data.Role.MemberType?r.data.Role.MemberType:-100;
          vm.OUType=r.data.Role.OUType===0||r.data.Role.OUType?r.data.Role.OUType:-100;
          vm.MemberType.push(vm.role);
          vm.bodyFlag=vm.role;
        }
      });
    })

    function load(){
      remote.Project.getMap().then(function(result){
        remote.offline.query().then(function (r) {
          if (r&& r.data&& r.data.length){
            result.data.forEach(function (item) {
              item.isOffline =true;
            });
          }
          vm.projects = result.data;
          vm.z_isOver=true;
        }).catch(function(){
          vm.projects = result.data;
          switch (vm.yw){
            case 0:
            case 2:
              if (!vm.projects.length){
                vm.isShowbg=true;
              }
              break;
          }
        });
      });

      remote.Procedure.getZGlist(23).then(function (r) {
        vm.zglist = [];
        if (angular.isArray(r.data)){
          var zg=[];
          r.data.forEach(function(o){
            zg.push(o);
          });
          remote.offline.query().then(function(r){
            if (angular.isArray(r.data)){
              zg.forEach(function(k){
                if (r.data.find(function(m){
                    return m.Id=="zg"+k.RectificationID;
                  })){
                  k.isOffline=true;
                }
              })
            }
            vm.zglist=zg;
            var alert=false;
            switch (vm.yw){
              case "4":
                var  t=vm.zglist.find(function(k){
                  return k.Status==4;
                });
                alert=t?false:true;
                break;
              case "32":
                var  t=vm.zglist.find(function(k){
                  return k.Status==16;
                });
                alert=t?false:true;
                break;
            }
            if (alert){
              vm.isShowbg=true;
            }
            vm.f_isOver=true;


          });
        }
      });
      remote.Procedure.getInspections(1).then(function(r){
        vm.Inspections=[];
        if (angular.isArray(r.data)){
          var ys=[];
          r.data.forEach(function(o){
            ys.push(o);
          });
          remote.offline.query().then(function(r){
            if (angular.isArray(r.data)){
              ys.forEach(function(k){
                if (r.data.find(function(m){
                    return m.Id=="ys"+k.InspectionId;
                  })){
                  k.isOffline=true;
                }
              })
            }
            vm.Inspections=ys;
            if (vm.yw==16&&!vm.Inspections.length){
              vm.isShowbg=true;
            }
            vm.y_isOver=true;
          });
        }
      });
    }
    api.setNetwork(0).then(function(){
      load();
    })

    vm.setModule=function(val){
      vm.bodyFlag=val;
    }
    vm.zbzjAction=function(item){
      if (!item.isOffline){
        vm.downloadzj(item).then(function(){
          api.setNetwork(1).then(function(){
            $state.go('app.xhsc.gx.gxlist', {role:'',projectId:item.ProjectID});
          });
        })
      }else {
        api.setNetwork(1).then(function(){
          $state.go('app.xhsc.gx.gxlist', {role:'',projectId:item.ProjectID});
        });
      }
    }

    vm.zbzjbtnAction=function(item,evt){
      $mdBottomSheet.show({
        templateUrl: 'app/main/xhsc/procedure/action.html',
        controller:function($scope){
          $scope.btns=[{
              title:'自 检',
              action:function(){
                $mdBottomSheet.hide();
                vm.zbzjAction(item);
              }
            },{
            title:'下 载',
            action:function(){
              $mdBottomSheet.hide();
              vm.downloadzj(item);
            }
          },{
            title:'取 消',
            action:function(){
              $mdBottomSheet.hide();
            }
          }]
        }
      });
      evt.stopPropagation();
    }

    vm.jlysAction=function(item){
      if (!item.isOffline){
        vm.downloadys(item).then(function(){
          api.setNetwork(1).then(function(){
            $state.go('app.xhsc.gx.gxtest',{acceptanceItemID:item.AcceptanceItemID,acceptanceItemName:item.AcceptanceItemName,name:item.Children[0].newName,
              projectId:item.ProjectID,areaId:item.Children[0].AreaID,InspectionId:item.InspectionId})
          });
        })
      }else {
        api.setNetwork(1).then(function(){
          $state.go('app.xhsc.gx.gxtest',{acceptanceItemID:item.AcceptanceItemID,acceptanceItemName:item.AcceptanceItemName,name:item.Children[0].newName,
            projectId:item.ProjectID,areaId:item.Children[0].AreaID,InspectionId:item.InspectionId})
        });
      }
    }
    vm.jlysbtnAction=function(item,evt){
      $mdBottomSheet.show({
        templateUrl: 'app/main/xhsc/procedure/action.html',
        controller:function($scope){
          $scope.btns=[{
            title:'验 收',
            action:function(){
              $mdBottomSheet.hide();
              vm.jlysAction(item);
            }
          },{
            title:'下 载',
            action:function(){
              $mdBottomSheet.hide();
              vm.downloadys(item);
            }
          },{
            title:'取 消',
            action:function(){
              $mdBottomSheet.hide();
            }
          }]
        }
      });
      evt.stopPropagation();
    }
    vm.zbzgAction=function(item){
      if (!item.isOffline){
        vm.downloadzg(item).then(function(){
          api.setNetwork(1).then(function(){
            $state.go('app.xhsc.gx.gxzg',{Role:'zb',InspectionID: item.InspectionId,AcceptanceItemID: item.AcceptanceItemID,RectificationID: item.RectificationID,AcceptanceItemName: item.AcceptanceItemName});
          });
        })
      }else {
        api.setNetwork(1).then(function(){
          $state.go('app.xhsc.gx.gxzg',{Role:'zb',InspectionID: item.InspectionId,AcceptanceItemID: item.AcceptanceItemID,RectificationID: item.RectificationID,AcceptanceItemName: item.AcceptanceItemName});
        });
      }
    }

    vm.zbzgbtnAction=function(item,evt){
      $mdBottomSheet.show({
        templateUrl: 'app/main/xhsc/procedure/action.html',
        controller:function($scope){
          $scope.btns=[{
            title:'整 改',
            action:function(){
              $mdBottomSheet.hide();
              vm.zbzgAction(item);
            }
          },{
            title:'下 载',
            action:function(){
              $mdBottomSheet.hide();
              vm.downloadzg(item)
            }
          },{
            title:'取 消',
            action:function(){
              $mdBottomSheet.hide();
            }
          }]
        }
      });
      evt.stopPropagation();
    }

    vm.jlfyAction=function(item){
      if (!item.isOffline){
        vm.downloadzg(item).then(function(){
          api.setNetwork(1).then(function(){
            $state.go('app.xhsc.gx.gxzg',{Role:'jl',InspectionID: item.InspectionId,AcceptanceItemID: item.AcceptanceItemID,RectificationID: item.RectificationID})
          });
        })
      }else {
        api.setNetwork(1).then(function(){
          $state.go('app.xhsc.gx.gxzg',{Role:'jl',InspectionID: item.InspectionId,AcceptanceItemID: item.AcceptanceItemID,RectificationID: item.RectificationID})
        });
      }
    }

    vm.jlfybtnAction=function(item,evt){
      $mdBottomSheet.show({
        templateUrl: 'app/main/xhsc/procedure/action.html',
        controller:function($scope){
          $scope.btns=[{
            title:'复 验',
            action:function(){
              $mdBottomSheet.hide();
              vm.jlfyAction(item);
            }
          },{
            title:'下 载',
            action:function(){
              $mdBottomSheet.hide();
              vm.downloadzg(item)
            }
          },{
            title:'取 消',
            action:function(){
              $mdBottomSheet.hide();
            }
          }]
        }
      });
      evt.stopPropagation();
    }
  }
})();
