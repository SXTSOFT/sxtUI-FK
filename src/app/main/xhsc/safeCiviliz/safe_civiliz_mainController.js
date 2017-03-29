/**db
 * Created by lss on 2016/10/18.
 */
/**
 * Created by emma on 2016/6/21.
 */
(function () {
  'use strict';

  angular
    .module('app.xhsc')
    .controller('safe_civiliz_mainController', safe_civiliz_mainController);

  /**@ngInject*/
  function safe_civiliz_mainController(remote, xhUtils, $rootScope, utils, api, $q, $state, $scope, $mdDialog, db, $mdBottomSheet, xhscService) {
    var vm = this;
    vm.procedure = [];
    //所有全局任务
    var globalTask = [
      function () {
        return remote.safe.getSecurityItem.cfgSet({
          offline: true
        })().then(function (r) {
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
    //项目包
    function projectTask(regionID, areas, acceptanceItemID) {
      var projectId = regionID.substr(0, 5);

      function filter(item) {
        return (!acceptanceItemID || item.AcceptanceItemID == acceptanceItemID) &&
          (!areas || areas.find(function (a) {
            return a.AreaID == item.RegionId;
          })) && vm.procedure.find(function (k) {
            return k.AcceptanceItemID == item.AcceptanceItemID;
          })
      }
      var  relates= remote.safe.getDrawingRelate.cfgSet({
        offline: true
      })("Acceptances",regionID)

      return [
        function (tasks) {
          return $q(function (resolve, reject) {
            return xhscService.downloadPics(regionID, null,filter ,relates).then(function (t) {
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
          return remote.safe.getRecPackage(item.RectificationID).then(function (r) {
            if (r && r.data) {
              var Checkpoints = r.data.Checkpoint; //插入点
              if (angular.isArray(Checkpoints)) {
                Checkpoints.forEach(function (t) {
                  tasks.push(function () {
                    return remote.safe.ckPointCreate(t)
                  });
                });
              }
              var ProblemRecords = r.data.ProblemRecord; //插入记录
              if (angular.isArray(ProblemRecords)) {
                ProblemRecords.forEach(function (t) {
                  t.isUpload=true;
                  tasks.push(function () {
                    return remote.safe.problemRecordCreate(t)
                  });
                });
              }
              var ProblemRecordFiles = r.data.ProblemRecordFile; //插入文件
              if (angular.isArray(ProblemRecordFiles)) {
                ProblemRecordFiles.forEach(function (t) {
                  tasks.push(function () {
                    return remote.safe.ProblemRecordFileQuery(t.ProblemRecordFileID);
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
              var t = [];
              if (!item.Children) {
                t = t.concat(projectTask(item.ProjectID, item.Children, item.AcceptanceItemID));
              } else {
                item.Children.forEach(function (o) {
                  t = t.concat(projectTask(o.AreaID, [o], o.AcceptanceItemID));
                });
              }
              var tasks = [].concat(globalTask)
                .concat(t)
                .concat([function () {
                  return remote.safe.getSafeInspectionSingle(item.InspectionId);
                }])
                .concat(function () {
                  return remote.offline.create({Id: 'safeYs' + item.InspectionId});
                })
              api.task(tasks, {
                event: 'downloadys',
                target: item.InspectionId
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

    api.event('downloadys', function (s, e) {
      var current = vm.Inspections && vm.Inspections.find(function (item) {
          return item.InspectionId == e.target;
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
              if (!item.Children) {
                t = t.concat(projectTask(item.ProjectID, item.Children, item.AcceptanceItemID));
              } else {
                item.Children.forEach(function (o) {
                  t = t.concat(projectTask(o.AreaID, [o], o.AcceptanceItemID));
                });
              }
              var tasks = [].concat(globalTask)
                .concat(t)
                .concat(rectificationTask(item))
                .concat(function (tasks) {
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
                })
                .concat(function () {
                  return remote.offline.create({Id: 'safeZg' + item.RectificationID});
                });
              api.task(tasks, {
                event: 'downloadzg',
                target: item.RectificationID
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
          return item.RectificationID == e.target;
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
            $scope.uploadInfo.current=0;
            $scope.uploadInfo.total=0;
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
                  return cfg.mark == "up"||cfg.mark=="allUp";
                }).then(function (val) {
                  if (val && val.length) {
                    var points = val.find(function (o) {
                      return o.key == "InspectionPoint";
                    });

                    var ckpoints = val.find(function (o) {
                      return o.key == "ckPoints";
                    });
                    var ckpointsVal=ckpoints && ckpoints.vals ? ckpoints.vals : [];

                    var problemRecords = val.find(function (o) {
                      return o.key == "problemRecord";
                    });

                    var problemRecordsVal=problemRecords && problemRecords.vals ? filterUpload(problemRecords.vals) : [];

                    var InspectionProblemRecordFiles = val.find(function (o) {
                      return o.key == "InspectionProblemRecordFile";
                    });
                    var InspectionProblemRecordFilesVal=InspectionProblemRecordFiles && InspectionProblemRecordFiles.vals ?
                      filterUpload(InspectionProblemRecordFiles.vals): [];
                    InspectionProblemRecordFilesVal.forEach(function (k) {
                      tasks.push(function () {
                        return remote.safe.inserFile({
                          FileName:k.FileID,
                          Base64:k.FileContent
                        }).then(function (res) {
                          if(res&&res.data&&res.data.ID){
                            k.FileID=res.data.ID;
                          }
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


                    var post={
                      "CheckpointInput": ckpointsVal,
                      "ProblemRecordInput": problemRecordsVal,
                      "ProblemRecordFileInput": InspectionProblemRecordFilesVal
                    }

                    tasks.push(function () {
                      function clear(ckpoints,problemRecords,InspectionProblemRecordFiles,points) {
                        if (ckpoints&&ckpoints.db){
                          tasks.push(function () {
                            return  ckpoints.db.destroy()
                          })
                        }

                        if (problemRecords&&problemRecords.db){
                          tasks.push(function () {
                            return  problemRecords.db.destroy()
                          })
                        }
                        if (InspectionProblemRecordFiles&&InspectionProblemRecordFiles.db){
                          tasks.push(function () {
                            return  InspectionProblemRecordFiles.db.destroy()
                          })
                        }
                        if (points&&points.db){
                          tasks.push(function () {
                            return  points.db.destroy()
                          })
                        }
                      }
                      return remote.safe.safeUp(post).then(function () {
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
                var percent=percent?parseInt(percent * 100):0;
                vm.uploadInfo.percent = percent + ' %';
                vm.uploadInfo.current = current;
                vm.uploadInfo.total = total;
              }, function () {
                utils.alert("上传成功!");
                $mdDialog.hide();
                load();
                vm.uploadInfo.uploading = false;
                remote.offline.query().then(function(m){
                    if(angular.isArray(m.data)){
                      m.data.forEach(function(n){
                        if(n.Id&&(n.Id.indexOf("safeYs")>-1||n.Id.indexOf("safeZg")>-1)){
                          remote.offline.delete({Id:n.Id});
                        }
                      });
                    }
                });
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

    xhscService.getProfile().then(function (profile) {
      vm.role = profile.role;
      vm.OUType = profile.ouType;
    });

    function load() {
      $q.all([
        remote.safe.getSafeInspections.cfgSet({
          mode:2
        })().then(function (r) {
          $q(function (resolve, reject) {
            vm.Inspections = [];
            if (angular.isArray(r.data)) {
              var ys = [];
              r.data.forEach(function (o) {
                ys.push(o);
              });
              remote.offline.query().then(function (r) {
                if (angular.isArray(r.data)) {
                  ys.forEach(function (k) {
                    if (r.data.find(function (m) {
                        return m.Id == "safeYs" + k.InspectionId;
                      })) {
                      k.isOffline = true;
                    }
                  })
                }
                vm.Inspections = ys;
                resolve();
              }).catch(function () {
                resolve();
              });
            } else {
              resolve();
            }
          });
        }),
        remote.safe.getAcceptancesRec.cfgSet({
          mode:2
        })().then(function (r) {
          return $q(function (resolve, reject) {
            vm.zglist = [];
            if (angular.isArray(r.data)) {
              var zg = [];
              r.data.forEach(function (o) {
                zg.push(o);
              });
              remote.offline.query().then(function (r) {
                if (angular.isArray(r.data)) {
                  zg.forEach(function (k) {
                    if (r.data.find(function (m) {
                        return m.Id == "safeZg" + k.RectificationID;
                      })) {
                      k.isOffline = true;
                    }
                  })
                }
                vm.zglist = zg;
                resolve();
              }).catch(function () {
                resolve();
              });
            }
            else {
              resolve();
            }
          })

        })
      ]).then(function () {
        vm.isOver = true;
      });
    }

    api.setNetwork(0).then(function () {
      load();
    })

    vm.setModule = function (val) {
      $state.go('app.xhsc.sf.sfbase', {yw: val})
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
            $state.go('app.xhsc.sf.rectify', {
              Role: 'zb',
              InspectionID: item.InspectionID,
              AcceptanceItemID: item.AcceptanceItemID,
              RectificationID: item.RectificationID,
              AcceptanceItemName: item.AcceptanceItemName
            });
          });
        })
      } else {
        api.setNetwork(1).then(function () {
          $state.go('app.xhsc.sf.rectify', {
            Role: 'zb',
            InspectionID: item.InspectionID,
            AcceptanceItemID: item.AcceptanceItemID,
            RectificationID: item.RectificationID,
            AcceptanceItemName: item.AcceptanceItemName
          });
        });
      }
    }
    vm.jlfyAction = function (item) {
      if (!item.isOffline) {
        vm.downloadzg(item).then(function () {
          api.setNetwork(1).then(function () {
            $state.go('app.xhsc.sf.rectify', {
              Role: 'jl',
              InspectionID: item.InspectionID,
              AcceptanceItemID: item.AcceptanceItemID,
              RectificationID: item.RectificationID
            })
          });
        })
      } else {
        api.setNetwork(1).then(function () {
          $state.go('app.xhsc.sf.rectify', {
            Role: 'jl',
            InspectionID: item.InspectionID,
            AcceptanceItemID: item.AcceptanceItemID,
            RectificationID: item.RectificationID
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
            $state.go('app.xhsc.sf.sfaccept', {
              acceptanceItemID: item.AcceptanceItemID,
              acceptanceItemName: item.AcceptanceItemName,
              name: item.Children[0].newName,
              projectId: item.ProjectID,
              areaId: item.Children[0].AreaID,
              InspectionId: item.InspectionId
            })
          });
        })
      } else {
        api.setNetwork(1).then(function () {
          $state.go('app.xhsc.sf.sfaccept', {
            acceptanceItemID: item.AcceptanceItemID,
            acceptanceItemName: item.AcceptanceItemName,
            name: item.Children[0].newName,
            projectId: item.ProjectID,
            areaId: item.Children[0].AreaID,
            InspectionId: item.InspectionId
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
