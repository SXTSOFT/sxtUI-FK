/**
 * Created by shaoshun on 2016/11/28.
 */
/**
 * Created by lss on 2016/10/19.
 */
/**
 * Created by emma on 2016/7/1.
 */
(function () {
  'use strict';

  angular
    .module('app.xhsc')
    .controller('sfWeekMainController', sfWeekMainController);

  /** @ngInject */
  function sfWeekMainController(xhscService,$mdDialog,api,$scope,$q,remote,$state,sxt,utils,$mdBottomSheet) {
    var vm = this;
    vm.procedure = [];
    vm.create=function () {
      $mdDialog.show({
        controller: ['$scope', 'utils', '$mdDialog', function ($scope, utils, $mdDialog) {
          $scope.ok=function () {
            remote.safe.insertBatchWrap({
              InspectionID: sxt.uuid(),
              AreaID: $scope.currentArea.RegionID,
              Title: $scope.subject,
            },"WeekInspects").then(function (r) {
              $mdDialog.hide(r);
            }).catch(function () {
              $mdDialog.hide();
            })
          }
          $scope.cancel=function () {
            $mdDialog.cancel();
          }
          function getYearWeek(date){
            var date=date.getDate();
            var week= Math.ceil(date/7);
            return week;
          }
          function initTheme() {
            var projectName=$scope.currentProject?$scope.currentProject.RegionName:"";
            var area=$scope.currentArea?$scope.currentArea.RegionName:"";
            var date=new Date();
            var year=date.getFullYear();
            var month=date.getMonth()+1;
            var week=getYearWeek(date);
            if (!area||!projectName){
              $scope.subject="";
            }else {
              $scope.subject= projectName+area+ year+"年"+month+"月第"+week+"周"+"安全检查";
            }
          }
          xhscService.getRegionTreeOffline("",3,1).then(function (r) {
            $scope.projects=r;
            if(angular.isArray($scope.projects)&&$scope.projects.length){
              $scope.currentProject=$scope.projects[0];
              if ($scope.currentProject.Children.length){
                $scope.currentArea=$scope.currentProject.Children[0];
              }
            }
          })

          $scope.$watch("currentProject",function () {
            initTheme();
          })
          $scope.$watch("currentArea",function () {
            initTheme();
          })
        }],
        templateUrl: 'app/main/xhsc/safeCiviliz/safe_civiliz_createTemplate.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true,
        fullscreen: false
      }).then(function (r) {
        if (r&&r.status==200){
          loadInspection();
        }else{
          utils.alert("本周已经做过安全检查!");
        }
      });
    }
    xhscService.getProfile().then(function (profile) {
      vm.role = profile.role;
      vm.OUType = profile.ouType;
      load();
    });
    var globalTask = [
      function () {
        return remote.safe.getSecurityItem.cfgSet({
          offline: true
        })("WeekInspects").then(function (r) {
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
    function projectTask(regionID, areas, acceptanceItemID,_filter) {
      var projectId = regionID.substr(0, 5);
      var filter=_filter;
      if (!filter){
        filter=  function filter(item) {
          return(!areas || areas.find(function (a) {
              return a.AreaID == item.RegionId;
            })) && (item.Type==7|| item.Type==13)
        }
      }
      var relates=remote.safe.getDrawingRelate.cfgSet({
        offline: true
      })("WeekInspects",regionID)
      return [
        function (tasks) {
          return $q(function (resolve, reject) {
            return xhscService.downloadPics(regionID, null, filter,relates).then(function (t) {
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
    function rectificationTask(item) {
      return [
        function (tasks) {
          return remote.safe.getRecPackage(item.RectificationID,"WeekInspects").then(function (r) {
            if (r && r.data) {
              var Checkpoints = r.data.Checkpoint; //插入点
              if (angular.isArray(Checkpoints)) {
                Checkpoints.forEach(function (t) {
                  tasks.push(function () {
                    return remote.safe.weekPointCreate(t)
                  });
                });
              }
              var ProblemRecords = r.data.ProblemRecord; //插入记录
              if (angular.isArray(ProblemRecords)) {
                ProblemRecords.forEach(function (t) {
                  t.isUpload=true;
                  tasks.push(function () {
                    return remote.safe.weekproblemRecordCreate(t)
                  });
                });
              }
              var ProblemRecordFiles = r.data.ProblemRecordFile; //插入文件
              if (angular.isArray(ProblemRecordFiles)) {
                ProblemRecordFiles.forEach(function (t) {
                  tasks.push(function () {
                    return remote.safe.weekProblemRecordFileQuery(t.ProblemRecordFileID);
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
                .concat(projectTask(item.AreaID,null,null))
                .concat([function () {
                  return xhscService.getRegionTreeOffline("", 31, 1);
                }])
                .concat(function () {
                  return remote.offline.create({Id: 'safeWeek' + item.InspectionID});
                })

              api.task(tasks, {
                event: 'downloadyf',
                target: item.InspectionID
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
    api.event('downloadyf', function (s, e) {
      var current = vm.Inspections && vm.Inspections.find(function (item) {
          return item.InspectionID == e.target;
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

    vm.downloadzg = function (item) {
      return $q(function (resolve, reject) {
        api.setNetwork(0).then(function () {
          $mdDialog.show({
            controller: ['$scope', 'utils', '$mdDialog', function ($scope, utils, $mdDialog) {
              $scope.item = item;
              var t = [];
              item.Rectifications.forEach(function (k) {
                k.Children.forEach(function (o) {
                  t = t.concat(projectTask(o.AreaID, [o], o.AcceptanceItemID));
                });
              });
              function getRectificationTask() {
                var  task=[];
                var rectification=item.Rectifications;
                rectification.forEach(function (item) {
                  task=task.concat(rectificationTask(item)).concat([
                    function (tasks) {
                      return $q(function (v, m) {
                        item.Children.forEach(function (area) {
                          tasks.push(
                            function () {
                              return remote.safe.getSafePointGeo(item.InspectionID, item.AcceptanceItemID, area.AreaID)
                            }
                          );
                        })
                        v();
                      })
                    }
                  ]);
                })
                return task;
              }

              var tasks = [].concat(globalTask)
                .concat(t)
                .concat(getRectificationTask())
                .concat(function () {
                  return remote.offline.create({Id: 'weekZg' + item.InspectionExtendID});
                });
              api.task(tasks, {
                event: 'downloadzg',
                target: item.InspectionExtendID
              })(null, function () {
                item.percent = item.current = item.total = null;
                item.isOffline = true;
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
            template: '<md-dialog aria-label="正在下载"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate" md-diameter="28"></md-progress-circular><p style="padding-left: 6px;">正在下载：{{item.ProjectName}} {{item.percent}}({{item.current}}/{{item.total}})</p></md-dialog-content></md-dialog>',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            fullscreen: false
          });
        });
      })

    }
    api.event('downloadzg', function (s, e) {
      var current = vm.zglist && vm.zglist.find(function (item) {
          return item.InspectionExtendID == e.target;
        });
      if (current) {
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
    }, $scope);

    vm.uploadInfo = {}
    vm.uploadInfo.uploading = false;
    vm.upload = function () {
      api.setNetwork(0).then(function () {
        vm.uploadInfo.uploading = true;
        vm.uploadInfo.percent = '0%'
        $mdDialog.show({
          controller: ['$scope', 'utils', '$mdDialog', function ($scope, utils, $mdDialog) {
            $scope.uploadInfo = vm.uploadInfo;
            function buildTask() {
              function filterUpload(arr) {
                if (angular.isArray(arr)){
                  return arr.filter(function (t) {
                    return !t.isUpload;
                  })
                }
                return arr;
              }
              var tasks = [];
              return $q(function (resolve, reject) {
                api.getUploadData(function (cfg) {
                  return cfg.mark == "weekUp"||cfg.mark =="allUp";
                }).then(function (val) {
                  if (val && val.length) {
                    var points = val.find(function (o) {
                      return o.key == "InspectionPoint";
                    });
                    var ckpoints = val.find(function (o) {
                      return o.key == "weekPoints";
                    });
                    var ckpointsVal=ckpoints && ckpoints.vals ? ckpoints.vals : [];

                    var problemRecords = val.find(function (o) {
                      return o.key == "weekProblemRecord";
                    });
                    var problemRecordsVal=problemRecords && problemRecords.vals ? filterUpload(problemRecords.vals) : [];

                    var InspectionProblemRecordFiles = val.find(function (o) {
                      return o.key == "weekInspectionProblemRecordFile";
                    });
                    //文件单独上传
                    var InspectionProblemRecordFilesVal=InspectionProblemRecordFiles && InspectionProblemRecordFiles.vals ?
                      filterUpload(InspectionProblemRecordFiles.vals): [];
                    InspectionProblemRecordFilesVal.forEach(function (k) {
                      tasks.push(function () {
                        return remote.safe.inserFile({
                          FileName:k.FileID,
                          Base64:k.FileContent
                        }).then(function () {
                          delete k.FileContent
                        })
                      });
                    });
                    //几何位置单独上传
                    if (points && points.vals) {
                      points.vals.forEach(function (t) {
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

                    //业务单独上传
                    var post={
                      "CheckpointInput": ckpointsVal,
                      "ProblemRecordInput": problemRecordsVal,
                      "ProblemRecordFileInput": InspectionProblemRecordFilesVal
                    }

                    tasks.push(function () {
                      function clear(ckpoints,problemRecords,InspectionProblemRecordFiles,points) {
                        if (ckpoints && ckpoints.vals) {
                          ckpoints.vals.forEach(function (m) {
                            tasks.push(function () {
                              return  ckpoints.db.delete(m._id);
                            })
                          });
                        }
                        if (problemRecords && problemRecords.vals) {
                          problemRecords.vals.forEach(function (m) {
                            tasks.push(function () {
                              return  problemRecords.db.delete(m._id);
                            })
                          });
                        }
                        if (InspectionProblemRecordFiles && InspectionProblemRecordFiles.vals) {
                          InspectionProblemRecordFiles.vals.forEach(function (m) {
                            tasks.push(function () {
                              return  InspectionProblemRecordFiles.db.delete(m._id);
                            })
                          });
                        }
                        if (points && points.vals){
                          points.vals.forEach(function (t) {
                            tasks.push(function () {
                              return  points.db.delete(t._id)
                            })
                          })
                        }
                      }
                      return remote.safe.safeUp(post,"WeekInspects").then(function () {
                        clear(ckpoints,problemRecords,InspectionProblemRecordFiles,points);
                      });
                    });
                  }
                  resolve(tasks);
                })
              }).catch(function () {
                reject(tasks);
              })
            }
            buildTask().then(function (tasks) {
              api.task(tasks)(function (percent, current, total) {
                vm.uploadInfo.percent = parseInt(percent * 100) + ' %';
                vm.uploadInfo.current = current;
                vm.uploadInfo.total = total;
              }, function () {
                utils.alert("上传成功!");
                $mdDialog.hide();
                load();
                 remote.offline.query().then(function(m){
                    if(angular.isArray(m.data)){
                      m.data.forEach(function(n){
                        if(n.Id&&(n.Id.indexOf("safeWeek")>-1||n.Id.indexOf("weekZg")>-1)){
                          remote.offline.delete({Id:n.Id});
                        }
                      });
                    }
                });
                vm.uploadInfo.uploading = false;
              }, function (timeout) {
                var msg = timeout ? '超时,任务上次失败!' : '上传失败,请检查网络';
                $mdDialog.cancel();
                utils.alert(msg);
                vm.uploadInfo.uploaded = 0;
                vm.uploadInfo.uploading = false;
              });
            })
          }],
          template: '<md-dialog aria-label="正在上传"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate" md-diameter="28"></md-progress-circular><p style="padding-left: 6px;">正在上传：{{uploadInfo.percent}}({{uploadInfo.current}}/{{uploadInfo.total}})</p></md-dialog-content></md-dialog>',
          parent: angular.element(document.body),
          clickOutsideToClose: false,
          fullscreen: false
        });
      });
    }

    function loadInspection() {
     return remote.safe.getBatchWrap.cfgSet({
       mode:2
     })("WeekInspects").then(function (r) {
        vm.Inspections = [];
        if (angular.isArray(r.data)) {
          var ys = [];
          r.data.forEach(function (o) {
            ys.push(o);
          });
          return remote.offline.query().then(function (r) {
            if (angular.isArray(r.data)) {
              ys.forEach(function (k) {
                if (r.data.find(function (m) {
                    return m.Id == "safeWeek" + k.InspectionID;
                  })) {
                  k.isOffline = true;
                }
              })
            }
            vm.Inspections = ys;
          })
        }
      });
    }
    function loadZgLst() {
     return $q(function (resolve,reject) {
        if (vm.role||vm.role===0){
          ret(vm.role).then(function (r) {
            resolve(r);
          });
        }else {
          xhscService.getProfile().then(function (profile) {
            vm.role = profile.role;
            return ret(vm.role);
          }).then(function (r) {
            resolve(r)
          })
        }
      })
      function ret(role) {
        var params="";
        if (vm.role==2||vm.role=="2"){
           params="jl";
        }else {
          params="zb";
        }
        return remote.safe.getRectificationsWrap.cfgSet({
          mode:2
        })("WeekInspects",params).then(function (r) {
          vm.zglist = [];
          if (angular.isArray(r.data)) {
            var zg = [];
            r.data.forEach(function (o) {
              zg.push(o);
            });
            return remote.offline.query().then(function (r) {
              if (angular.isArray(r.data)) {
                zg.forEach(function (k) {
                  if (r.data.find(function (m) {
                      return m.Id == "weekZg" + k.InspectionExtendID;
                    })) {
                    k.isOffline = true;
                  }
                })
              }
              vm.zglist = zg;
            })
          }
        })
      }

    }
    function load() {
      $q.all([
        loadInspection(),
        loadZgLst()
      ]).then(function () {
        vm.isOver = true;
      });
    }

    api.setNetwork(0).then(function () {

    })

    vm.setModule = function (val) {
      $state.go('app.xhsc.week.sfWeekBase', {yw: val})
    }
    vm.zbzgbtnAction = function (item, evt) {
      $mdBottomSheet.show({
        templateUrl: 'app/main/xhsc/procedure/action.html',
        controller: function ($scope) {
          $scope.btns = [{
            title: '整 改',
            action: function () {
              $mdBottomSheet.hide();
              vm.zbzgAction(item);
            }
          }, {
            title: '下 载',
            action: function () {
              $mdBottomSheet.hide();
              vm.downloadzg(item)
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
    vm.zbzgAction = function (item) {
      if (!item.isOffline) {
        vm.downloadzg(item).then(function () {
          api.setNetwork(1).then(function () {
            $state.go('app.xhsc.week.sfWeekRectify', {
              Role: 'zb',
              InspectionID: item.InspectionExtendID
            });
          });
        })
      } else {
        api.setNetwork(1).then(function () {
          $state.go('app.xhsc.week.sfWeekRectify', {
            Role: 'zb',
            InspectionID: item.InspectionExtendID
          });
        });
      }
    }
    vm.jlfyAction = function (item) {
      if (!item.isOffline) {
        vm.downloadzg(item).then(function () {
          api.setNetwork(1).then(function () {
            $state.go('app.xhsc.week.sfWeekRectify', {
              Role: 'jl',
              InspectionID: item.InspectionExtendID
            })
          });
        })
      } else {
        api.setNetwork(1).then(function () {
          $state.go('app.xhsc.week.sfWeekRectify', {
            Role: 'jl',
            InspectionID: item.InspectionExtendID
          })
        });
      }
    }
    vm.jlfybtnAction = function (item, evt) {
      $mdBottomSheet.show({
        templateUrl: 'app/main/xhsc/procedure/action.html',
        controller: function ($scope) {
          $scope.btns = [{
            title: '复 验',
            action: function () {
              $mdBottomSheet.hide();
              vm.jlfyAction(item);
            }
          }, {
            title: '下 载',
            action: function () {
              $mdBottomSheet.hide();
              vm.downloadzg(item)
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
    vm.jlysAction = function (item) {
      if (!item.isOffline) {
        vm.downloadys(item).then(function () {
          api.setNetwork(1).then(function () {
            $state.go('app.xhsc.week.sfWeekAccept', {
              projectId: item.ProjectID,
              areaId: item.AreaID,
              InspectionId: item.InspectionID
            })
          });
        })
      } else {
        api.setNetwork(1).then(function () {
          $state.go('app.xhsc.week.sfWeekAccept', {
            projectId: item.ProjectID,
            areaId: item.AreaID,
            InspectionId: item.InspectionID
          })
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
