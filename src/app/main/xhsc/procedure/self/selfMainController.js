/**
 * Created by shaoshun on 2017/3/1.
 */
/**
 * Created by emma on 2016/7/1.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('selfMainController',selfMainController);

  /** @ngInject */
  function selfMainController($state,$rootScope,$scope,$mdDialog,$mdBottomSheet,$stateParams,remote,$q,utils,xhUtils,api,xhscService,sxt){
    var vm = this;
    vm.procedure=[];
    var globalTask = [
      function () {
        return remote.safe.getSecurityItem.cfgSet({
          offline: true
        })("cycle").then(function (r) {
          if (r.data && r.data.length) {
            r.data.forEach(function (k) {
              if (k.SpecialtyChildren.length) {
                k.SpecialtyChildren.forEach(function (m) {
                  if (m.WPAcceptanceList.length) {
                    vm.procedure = vm.procedure.concat(m.WPAcceptanceList);
                  }
                })
              }
            });
          }
          return r;
        });
      }
    ];

    function projectTask(regionIDs, acceptanceItemIDs,_filter) {
      var filter=_filter;
      if (!filter){
        var regions=regionIDs?regionIDs.split(','):[];
        var  areaID=regions[0].substr(0,10);
        var acceptanceItems=acceptanceItemIDs?acceptanceItemIDs.split(','):[];
        filter=  function filter(item) {
           return  regions.find(function (n) {
                return  item.RegionId.toString().indexOf(n)>-1
           })&& acceptanceItems.indexOf(item.AcceptanceItemID.toString())>-1
        }
      }
      var relates=remote.safe.getDrawingRelate.cfgSet({
        offline: true
      })("cycle",areaID)
      return [
        function (tasks) {
          return $q(function (resolve, reject) {
            return xhscService.downloadPics(areaID, null, filter,relates).then(function (t) {
              t.forEach(function (m) {
                tasks.push(m);
              })
              resolve();
            }).catch(function () {
              reject();
            });
          })
        }
      ]
    }

    function getbasinfo(item) {
      return [
        function (tasks) {
          return remote.self.getBaseInfo("Inspection",item.Id).then(function (r) {
            if (r && r.data) {
              var Checkpoints = r.data.Ponits; //插入点
              if (angular.isArray(Checkpoints)) {
                Checkpoints.forEach(function (t) {
                  t.isUpload=true;
                  tasks.push(function () {
                    return remote.self.zb.pointCreate(t)
                  });
                });
              }
              var ProblemRecords = r.data.ProblemRecords; //插入记录
              if (angular.isArray(ProblemRecords)) {
                ProblemRecords.forEach(function (t) {
                  t.isUpload=true;
                  tasks.push(function () {
                    return remote.self.zb.problemRecordCreate(t)
                  });
                });
              }
              var ProblemRecordFiles = r.data.ProblemRecordFile; //插入文件
              if (angular.isArray(ProblemRecordFiles)) {
                ProblemRecordFiles.forEach(function (t) {
                  t.isUpload=true;
                  tasks.push(function () {
                    return remote.self.fileQuery(t.FileID).then(function (r) {
                      t.FileContent=r.data.Base64;
                      return remote.self.zb.problemRecordFileCreate(t)
                    });
                  });
                });
              }
            }
          })
        }
      ]
    }

    vm.downloadys = function (item) {
      return api.setNetwork(0).then(function () {
        return $q(function (resolve, reject) {
          $mdDialog.show({
            controller: ['$scope', 'utils', '$mdDialog', function ($scope, utils, $mdDialog) {
              $scope.item = item;
              var tasks = [].concat(globalTask)
                .concat(projectTask(item.Extends.RegionID,item.Extends.AcceptanceItemID))
                .concat([function () {
                  return xhscService.getRegionTreeOffline("", 31, 1);
                }])
                .concat(getbasinfo(item))
                .concat(function () {
                  return remote.self.getSafePointGeo("Inspection",item.Id);
                })
                .concat(function () {
                  return remote.offline.create({Id: 'selfZb' + item.Id});
                })
              api.task(tasks, {
                event: 'selfZbys',
                target: item.Id
              })(null, function () {
                item.percent = item.current = item.total = null;
                item.isOffline = true;
                $mdDialog.hide();
                utils.alert('下载完成',null,function () {
                  resolve();
                }).catch(function () {
                  reject();
                });
              }, function () {
                $mdDialog.cancel();
                utils.alert('下载失败,请检查网络');
                item.percent = item.current = item.total = null;
                reject();
              }, {timeout: 300000})
            }],
            template: '<md-dialog aria-label="正在下载"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate" md-diameter="28"></md-progress-circular><p style="padding-left: 6px;">正在下载： {{item.AcceptanceItemName}} {{item.percent}}({{item.current}}/{{item.total}})</p></md-dialog-content></md-dialog>',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            fullscreen: false
          });
        })
      });
    }
    api.event('selfZbys', function (s, e) {
      var current = vm.Inspections && vm.Inspections.find(function (item) {
          return item.Id == e.target;
        });
      if (current) {
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
    }, $scope);


    function up() {
      this.uploadInfo={};
      this.uploadInfo.uploading=false;
      this.dbs=[];
    }

    up.prototype.doneUp=function () {
      var  self=this;
      api.setNetwork(0).then(function () {
        self.uploadInfo.uploading=true;
        self.uploadInfo.percent = '0%'
        $mdDialog.show({
          controller: ['$scope', 'utils', '$mdDialog', function ($scope, utils, $mdDialog){
            $scope.uploadInfo = self.uploadInfo;
            self._firstStepUp().then(function (task) {
              if(task&&task.length){
                api.task(task)(function (percent, current, total) {
                  self.progress(percent,current,total);
                }, function () {
                  self.success(function () {
                    self.clear();
                    $mdDialog.hide();
                  })
                }, function (timeout) {
                  self.fail(function () {
                    $mdDialog.hide();
                  })
                });
              }else {
                  utils.alert("没有要上传的数据!");
              }
            });
          }],
          template: '<md-dialog aria-label="正在上传"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate" md-diameter="28"></md-progress-circular><p style="padding-left: 6px;">正在上传：{{uploadInfo.percent}}({{uploadInfo.current}}/{{uploadInfo.total}})</p></md-dialog-content></md-dialog>',
          parent: angular.element(document.body),
          clickOutsideToClose: false,
          fullscreen: false
        });
      })
    }
    up.prototype._firstStepUp=function () {
      var tasks=[];
      var  self=this;
      return $q(function (resolve,reject) {
        self.getPostParams().then(function (params) {
          if (params.InspectionPoint){
            params.InspectionPoint.forEach(function (t) {
              if (t.geometry) {
                t.Geometry = t.geometry;
              }
              if (typeof t.Geometry === 'string') {
                t.Geometry = JSON.parse(t.Geometry);
              }
              tasks.push(function () {
                return remote.Procedure.InspectionPoint.create(t)
              });
            });
          }
          if(params.ProblemRecordFileInput){
            params.ProblemRecordFileInput.forEach(function (k) {
              tasks.push(function () {
                return remote.safe.inserFile({
                  FileName:k.FileID,
                  Base64:k.FileContent
                }).then(function (res) {
                  if(res&&res.data&&res.data.ID){
                    k.FileID=res.data.ID;
                  }
                  delete k.FileContent;
                })
              });
            });
          }
          delete params.InspectionPoint;
          var t= self._nextStepUp(tasks,params);
          resolve(t);
        }).catch(function () {
          resolve([]);
        });
      })
    }

    up.prototype._nextStepUp=function (tasks,params) {
        var data=this.buildData(params);
        var inspectionsIds=[];
        if (data&&data.length){
            data.forEach(function (k) {
              if (inspectionsIds.indexOf(k.InspectionID)==-1){
                inspectionsIds.push(k.InspectionID);
              }
              tasks.push(function () {
                  return remote.self.self_upload("Inspection",k);
              })
          });
        }
        inspectionsIds.forEach(function (o) {
          tasks.push(function () {
            return remote.self.updateStatus("Inspection",o);
          })
        })
        return tasks;
    }

    up.prototype.buildData=function (params) {
        var areas=[];
        var checkpointInput=params.CheckpointInput;
        if (checkpointInput&&checkpointInput.length){
          checkpointInput.forEach(function (q) {
              if (!areas.find(function (k) {
                  return q.RegionID==k.RegionID&&q.AcceptanceItemID==k.AcceptanceItemID&&k.InspectionID==q.InspectionID;
                })){
                areas.push({
                  Id:sxt.uuid(),
                  RegionID:q.RegionID,
                  AcceptanceItemID:q.AcceptanceItemID,
                  InspectionID:q.InspectionID,
                  SelfCheckType:"Inspection"
                })
              }
          });
          areas.forEach(function (k) {
            var Status=2;
            k.CheckPoint=checkpointInput.filter(function (q) {
              return q.RegionID==k.RegionID&&q.AcceptanceItemID==k.AcceptanceItemID&&k.InspectionID==q.InspectionID;
            })
            if (k.CheckPoint&&k.CheckPoint.length){
              k.CheckPoint.forEach(function (n) {
                if (n.Status==1){
                  Status=1;
                }
                n.ProblemRecordInput=params.ProblemRecordInput.filter(function (q) {
                   return  q.CheckpointID==n.CheckpointID
                })
                if (n.ProblemRecordInput&&n.ProblemRecordInput.length){
                  n.ProblemRecordInput.forEach(function (t) {
                      t.ProblemRecordFileInput=params.ProblemRecordFileInput.filter(function (q) {
                        return q.ProblemRecordID==t.ProblemRecordID;
                      })
                  })
                }
              })
            }
            k.Status=Status;
          })
          return areas;
        }
    }

    up.prototype.getPostParams=function () {
      var self=this;
      self.dbs=[];
      function convert(pa,ignore) {
        if (pa&&pa.vals&&pa.db){
          self.dbs.push(pa.db);
          if (!ignore){
            return  self.filterData(pa.vals);
          }
        }
        return pa.vals;
      }
      return $q(function (resolve,reject) {
        api.getUploadData(function (cfg) {
          return cfg.mark == "selfZbUp"||cfg.mark =="allUp";
        }).then(function (val) {
            var params={},t;
            if (val&&val.length){
              t=val.find(function (o) {
                return o.key == "InspectionPoint";
              });
              params.InspectionPoint=convert(t);
              t = val.find(function (o) {
                return o.key == "selfZbPoints";
              });
              params.CheckpointInput=convert(t,true);
              t = val.find(function (o) {
                return o.key == "selfZbProblemRecord";
              });
              params.ProblemRecordInput=convert(t);
              t = val.find(function (o) {
                return o.key == "selfZbInspectionProblemRecordFile";
              });
              params.ProblemRecordFileInput=convert(t);
            }
            resolve(params);
        }).catch(function () {
          resolve({});
        })
      })
    }

    up.prototype.filterData=function (arr) {
      if (angular.isArray(arr)){
        return arr.filter(function (t) {
          return !t.isUpload;
        })
      }
      return [];
    }

    up.prototype.clear=function () {
      var self=this;
      self.dbs.forEach(function (db) {
         db.destroy();
      })
    }
    up.prototype.progress=function (percent,current,total) {
      this.uploadInfo.percent = parseInt(percent * 100) + ' %';
      this.uploadInfo.current = current;
      this.uploadInfo.total = total;
    }

    up.prototype.success=function (callback) {
      var self=this;
      if (callback){
        callback();
      }
      utils.alert("上传成功!");
      load();
      remote.offline.query().then(function(m){
        if(angular.isArray(m.data)){
          m.data.forEach(function(n){
            if(n.Id&&(n.Id.indexOf("selfZb")>-1||n.Id.indexOf("selfZb")>-1)){
              remote.offline.delete({Id:n.Id});
            }
          });
        }
      });
      self.uploadInfo.uploading = false;
    }

    up.prototype.fail=function (callback) {
      if (callback){
        callback();
      }
      utils.alert('上传失败,请检查网络');
      this.uploadInfo.uploaded = 0;
      this.uploadInfo.uploading = false;
    }


    vm.upload = function () {
      api.setNetwork(0).then(function () {
        var post=new up();
        post.doneUp();
      })
    }

    function load() {
      return remote.self.getInspection.cfgSet({
        mode:2
      })("Inspection").then(function (r) {
        var  data=r.data
        vm.Inspections = [];
        if (data&&angular.isArray(data.data)) {
          var ys = [];
          data.data.forEach(function (o) {
            ys.push(o);
          });
          return remote.offline.query().then(function (r) {
            if (r&&angular.isArray(r.data)) {
              ys.forEach(function (k) {
                if (r.data.find(function (m) {
                    return m.Id == "selfZb" + k.Id;
                  })) {
                  k.isOffline = true;
                }
              })
            }
            vm.Inspections = ys;
            vm.isOver=true;
          })
        }
      });
    }

    api.setNetwork(0).then(function () {
      load();
    })

    vm.jlysAction = function (item) {
      if (!item.isOffline) {
        vm.downloadys(item).then(function () {
          api.setNetwork(1).then(function () {
            $state.go("app.xhsc.gx.selfPicture",{inspectionID:item.Id});
          });
        })
      } else {
        api.setNetwork(1).then(function () {
          $state.go("app.xhsc.gx.selfPicture",{inspectionID:item.Id});
        });
      }
    }
    vm.jlysbtnAction = function (item, evt) {
      $mdBottomSheet.show({
        templateUrl: 'app/main/xhsc/procedure/action.html',
        controller: function ($scope) {
          $scope.btns = [{
            title: '验 收',
            action: function () {
              $mdBottomSheet.hide();
              vm.jlysAction(item);
            }
          }, {
            title: '下 载',
            action: function () {
              $mdBottomSheet.hide();
              vm.downloadys(item);
            }
          }, {
            title: '取 消',
            action: function () {
              $mdBottomSheet.hide();
            }
          }]
        }
      });
      evt.stopPropagation();
    }

  }
})();
