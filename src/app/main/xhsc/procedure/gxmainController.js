/**
 * Created by emma on 2016/6/21.
 */
(function () {
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxmainController', gxmainController);

  /**@ngInject*/
  function gxmainController(remote, xhUtils, $rootScope, utils, api, $q, $state, $scope,xhscService, $mdDialog, db, $mdBottomSheet) {
    var vm = this;
    var dbpics = db('pics')
    vm.procedure = [];
    //所有全局任务
    var globalTask = [
      function () {
        return remote.Procedure.queryProcedure().then(function (r) {
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
        })
      }
    ];
    function projectTask(regionID, areas, acceptanceItemID) {
      var projectId = regionID.substr(0, 5);
      function  filter(item) {
        return (!acceptanceItemID || item.AcceptanceItemID == acceptanceItemID) &&
          (!areas || areas.find(function (a) {
            return a.AreaID == item.RegionId;
          })) && vm.procedure.find(function (k) {
            return k.AcceptanceItemID == item.AcceptanceItemID;
          })
      }
      return [
        function (tasks) {
          return $q(function (resolve, reject) {
            return xhscService.downloadPics(regionID,null,filter).then(function (t) {
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

    function InspectionTask(item) {
      var t = [function () {
        return remote.Project.getInspectionList(item.InspectionId);
      }];
      item.Children.forEach(function (area) {
        t.push(function (tasks, down) {
          return remote.Procedure.InspectionCheckpoint.query(item.AcceptanceItemID, area.AreaID, item.InspectionId).then(function (result) {
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
        t.push(function () {
          return remote.Procedure.InspectionIndexJoinApi.query(item.InspectionId)
        })
        t.push(function () {
          return remote.Procedure.InspectionPoint.query(item.InspectionId, item.AcceptanceItemID, area.AreaID)
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
                return remote.Procedure.getZGReginQues(area.AreaID, item.RectificationID);
              });
              tasks.push(function () {
                return remote.Procedure.getZGReginQuesPoint(area.AreaID, item.RectificationID);
              })
            })
          });
        },
        function () {
          return remote.Procedure.getRectification(item.RectificationID);
        }
      ]
    }


    vm.downloadys = function (item) {
      return api.setNetwork(0).then(function () {
        return $q(function (resolve, reject) {
          $mdDialog.show({
            controller: ['$scope', 'utils', '$mdDialog', function ($scope, utils, $mdDialog) {
              $scope.item = item;
              var projectId  =item.Children.length?item.Children[0].AreaID.substr(0,5):item.ProjectID;
              var t=[];
              if (!item.Children){
                t=t.concat(projectTask(item.ProjectID, item.Children, item.AcceptanceItemID)) ;
              }else {
                item.Children.forEach(function (o) {
                  t=t.concat(projectTask(o.AreaID, [o], o.AcceptanceItemID));
                });
              }
              var tasks = [].concat(globalTask)
                .concat(t)
                .concat(function () {
                  return remote.Project.queryAllBulidings(projectId);
                })
                .concat(InspectionTask(item))
                .concat(function () {
                  return remote.offline.create({Id: 'ys' + item.InspectionId});
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
            template: '<md-dialog aria-label="正在下载"  ng-cloak><md-dialog-content> <md-progress-circular md-diameter="28" md-mode="indeterminate"></md-progress-circular><p style="padding-left: 6px;">正在下载： {{item.AcceptanceItemName}} {{item.percent}}({{item.current}}/{{item.total}})</p></md-dialog-content></md-dialog>',
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
              var projectId  =item.Children.length?item.Children[0].AreaID.substr(0,5):item.ProjectID;
              var t=[];
              if (!item.Children){
                t=t.concat(projectTask(item.ProjectID, item.Children, item.AcceptanceItemID)) ;
              }else {
                item.Children.forEach(function (o) {
                  t=t.concat(projectTask(o.AreaID, [o], o.AcceptanceItemID));
                });
              }
              var tasks = [].concat(globalTask)
                .concat(t)
                .concat(function () {
                  return remote.Project.queryAllBulidings(projectId);
                })
                .concat(InspectionTask(item))
                .concat(rectificationTask(item))
                .concat(function () {
                  return remote.offline.create({Id: 'zg' + item.RectificationID});
                });
              api.task(tasks, {
                event: 'downloadzg',
                target: item.RectificationID
              })(null, function () {
                item.percent = item.current = item.total = null;
                item.isOffline = true;
                remote.offline.create({Id: 'zg' + item.RectificationID});
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
            template: '<md-dialog aria-label="正在下载"  ng-cloak><md-dialog-content> <md-progress-circular md-diameter="28" md-mode="indeterminate"></md-progress-circular><p style="padding-left: 6px;">正在下载：{{item.ProjectName}} {{item.percent}}({{item.current}}/{{item.total}})</p></md-dialog-content></md-dialog>',
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

            api.upload(function (cfg, item) {
              if (cfg._id == 's_files' && item && item.Url.indexOf('base64') == -1) {
                return false;
              }
              if (cfg._id == "s_offline") {
                return false;
              }
              return true;
            }, function (percent, current, total) {
              vm.uploadInfo.percent = parseInt(percent * 100) + ' %';
              vm.uploadInfo.current = current;
              vm.uploadInfo.total = total;
            }, function (tasks) {
              vm.uploadInfo.uploaded = 1;
              api.uploadTask(function () {
                return true
              }, null);
              $mdDialog.hide();
              //db("s_offline").destroy();
              utils.alert('上传成功');
              load();
              vm.uploadInfo.tasks = [];
              vm.uploadInfo.uploading = false;
            }, function (timeout) {
              $mdDialog.hide();
              var msg = '上传失败,请检查网络!'
              if (timeout) {
                msg = '请求超时,请检查网络!';
              }
              utils.alert(msg);
              vm.uploadInfo.uploaded = 0;
              vm.uploadInfo.uploading = false;
            }, {
              uploaded: function (cfg, row, result) {
                if (cfg.db && cfg.db.delete)
                  cfg.db.delete(row._id);
                else
                  cfg._db.delete(row._id);
              }
            });
          }],
          template: '<md-dialog aria-label="正在上传"  ng-cloak><md-dialog-content> <md-progress-circular md-diameter="28" md-mode="indeterminate"></md-progress-circular><p style="padding-left: 6px;">正在上传：{{uploadInfo.percent}}({{uploadInfo.current}}/{{uploadInfo.total}})</p></md-dialog-content></md-dialog>',
          parent: angular.element(document.body),
          clickOutsideToClose: false,
          fullscreen: false
        });
      });
    }



    xhscService.getProfile().then(function(profile){
      vm.role=profile.role;
      vm.OUType=profile.ouType;
    });


    function load() {
      $q.all([
        remote.Procedure.getZGlist(23).then(function (r) {
          return $q(function (resolve, reject) {
            vm.zglist = [];
            if (r.data&& angular.isArray(r.data.data)) {
              var zg = [];
              r.data.data.forEach(function (o) {
                zg.push(o);
              });
              remote.offline.query().then(function (r) {
                if (angular.isArray(r.data)) {
                  zg.forEach(function (k) {
                    if (r.data.find(function (m) {
                        return m.Id == "zg" + k.RectificationID;
                      })) {
                      k.isOffline = true;
                    }
                  })
                }
                vm.zglist = zg;
                // 值不存在提示
                resolve();
              }).catch(function () {
                resolve();
              });
            }
            else {
              resolve();
            }
          })

        }),
        remote.Procedure.getInspections(1).then(function (r) {
          $q(function (resolve, reject) {
            vm.Inspections = [];
            if (r.data&& angular.isArray(r.data.data)) {
              var ys = [];
              r.data.data.forEach(function (o) {
                ys.push(o);
              });
              remote.offline.query().then(function (r) {
                if (angular.isArray(r.data)) {
                  ys.forEach(function (k) {
                    if (r.data.find(function (m) {
                        return m.Id == "ys" + k.InspectionId;
                      })) {
                      k.isOffline = true;
                    }
                  })
                }
                vm.Inspections = ys;
                if (vm.yw == 16 && !vm.Inspections.length) {
                  utils.alert("暂时没有找到数据");
                }
                resolve();
              }).catch(function () {
                resolve();
              });
            } else {
              resolve();
            }
          });
        })
      ]).then(function () {
        vm.isOver = true;
      });
    }

    api.setNetwork(0).then(function () {
      load();
    })

    vm.setModule = function (val) {
      $state.go('app.xhsc.gx.yw', {yw: val})
    }

    vm.jlysAction = function (item) {
      if (!item.isOffline) {
        vm.downloadys(item).then(function () {
          api.setNetwork(1).then(function () {
            $state.go('app.xhsc.gx.gxtest', {
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
          $state.go('app.xhsc.gx.gxtest', {
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
    vm.zbzgAction = function (item) {
      if (!item.isOffline) {
        vm.downloadzg(item).then(function () {
          api.setNetwork(1).then(function () {
            $state.go('app.xhsc.gx.gxzg', {
              Role: 'zb',
              InspectionID: item.InspectionId,
              AcceptanceItemID: item.AcceptanceItemID,
              RectificationID: item.RectificationID,
              AcceptanceItemName: item.AcceptanceItemName
            });
          });
        })
      } else {
        api.setNetwork(1).then(function () {
          $state.go('app.xhsc.gx.gxzg', {
            Role: 'zb',
            InspectionID: item.InspectionId,
            AcceptanceItemID: item.AcceptanceItemID,
            RectificationID: item.RectificationID,
            AcceptanceItemName: item.AcceptanceItemName
          });
        });
      }
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
    vm.jlfyAction = function (item) {
      if (!item.isOffline) {
        vm.downloadzg(item).then(function () {
          api.setNetwork(1).then(function () {
            $state.go('app.xhsc.gx.gxzg', {
              Role: 'jl',
              InspectionID: item.InspectionId,
              AcceptanceItemID: item.AcceptanceItemID,
              RectificationID: item.RectificationID
            })
          });
        })
      } else {
        api.setNetwork(1).then(function () {
          $state.go('app.xhsc.gx.gxzg', {
            Role: 'jl',
            InspectionID: item.InspectionId,
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

  }
})();
