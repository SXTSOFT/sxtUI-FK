/**
 * Created by emma on 2016/6/21.
 */
(function () {
  'use strict';

  angular
    .module('app.xhsc')
    .controller('safe_civiliz_baseController', safe_civiliz_baseController);

  function safe_civiliz_baseController(remote, xhUtils, $rootScope, utils, api, $q, $state, $scope, $mdDialog,
    db, $mdBottomSheet, $stateParams, xhscService) {
    var vm = this;
    vm.procedure = [];
    vm.yw = $stateParams.yw;
    vm.isShowbg = false;
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

    xhscService.getProfile().then(function (profile) {
      vm.role = profile.role;
      vm.OUType = profile.ouType;
    });


    vm.by = function (r) {
      api.setNetwork(0).then(function () {
        $state.go('app.xhsc.sf.sfitem', {role: 'zb', projectId: r.RegionID});
      });
    }

    function load() {
      $q.all([
        remote.safe.getSafeInspections.cfgSet({
          model:2
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
                vm.y_isOver;
                if (vm.yw == 16 && !vm.Inspections.length) {
                  vm.isShowbg=true;
                }
                resolve();
              }).catch(function () {
                resolve();
              });
            } else {
              resolve();
            }
          });
        }),
        remote.safe.getRectifications().then(function (r) {
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
                if ((vm.yw==4||vm.yw==32)&&!vm.zglist.length){
                  vm.isShowbg=true;
                }
                vm.f_isOver = true;
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
        remote.Project.getAllRegionWithRight_no_db("", 3).then(function (n) {
          if (vm.yw == 2 || vm.yw == 0) {
            vm.z_isOver = true;
            if (!n || n.data.length == 0) {
              vm.isShowbg = true;
              return;
            }
            remote.offline.query().then(function (r) {
              vm.by_project = xhscService.buildMutilRegionTree(n.data, 1);
              vm.zj_project = $.extend([], vm.by_project, true);
              vm.zj_project.forEach(function (k) {
                k.stretch=true;
                if (k.Children) {
                  k.Children.forEach(function (n) {
                    if (r.data.find(function (m) {
                        return m.Id == 'zj' + n.RegionID;
                      })) {
                      n.isComplete = true;
                    }
                  })
                }
              });

            })
          }
        })
      ]).then(function () {
        vm.isOver = true;
      });
    }

    api.setNetwork(0).then(function () {
      load();
    })
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


    vm.click = function (item, evt) {
      if (item.isComplete) {
        api.setNetwork(1).then(function () {
          $state.go('app.xhsc.gx.gxlist', {role: '', projectId: item.RegionID});
        });
      }
      evt.stopPropagation();
    }
    vm.stretch = function (item) {
      item.stretch = !item.stretch;
    }

  }
})();
