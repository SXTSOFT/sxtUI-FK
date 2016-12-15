/**
 * Created by lss on 2016/9/22.
 */
/**
 * Created by emma on 2016/6/21.
 */
(function () {
  'use strict';

  angular
    .module('app.xhsc')
    .controller('ywController', ywController);

  /**@ngInject*/
  function ywController(remote, xhUtils, $rootScope, utils, api, $q, $state, $scope, $mdDialog, db, xhscService, $mdBottomSheet, $stateParams) {
    var vm = this;
    vm.procedure = [];
    vm.yw = $stateParams.yw;
    vm.isShowbg = false;
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
    //项目包
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


    function InspectionZjTask(t, AcceptanceItemID, AreaID, InspectionId) {
      t.push(function () {
        return remote.Procedure.InspectionPoint.query(InspectionId, AcceptanceItemID, AreaID, "InspectionPoint_zj")
      })
      t.push(function (tasks, down) {
        return remote.Procedure.InspectionCheckpoint.query(AcceptanceItemID, AreaID, InspectionId, "InspectionCheckpoint_zj").then(function (result) {
          result.data.forEach(function (p) {
            tasks.push(function () {
              return remote.Procedure.InspectionProblemRecord.query(p.CheckpointID, "InspectionProblemRecord_zj").then(function (result) {
                result.data.forEach(function (r) {
                  tasks.push(function () {
                    return remote.Procedure.InspectionProblemRecordFile.query(r.ProblemRecordID, "", "InspectionProblemRecordFile_zj").then(function (result) {
                    })
                  })
                })
              })
            });
          });
        })
      });
    }

    vm.downloadzj = function (item, evt) {
      if (evt) {
        evt.stopPropagation();
      }
      return api.setNetwork(0).then(function () {
        return $q(function (resolve, reject) {
          $mdDialog.show({
            controller: ['$scope', 'utils', '$mdDialog', function ($scope, utils, $mdDialog) {
              $scope.item = item;
              var tasks = [].concat(globalTask)
                .concat(item.isOffline ? [] : projectTask(item.RegionID))
                .concat(function () {
                    return remote.Project.queryAllBulidings(item.RegionID.substr(0,5));
                  })
                .concat([
                  function (tasks) {
                    var group = [];
                    var inspections = [];
                    return remote.Procedure.getRegionStatusEx(item.ProjectID, "8", null, "project_status_zj").then(function (result) {
                      result.data.forEach(function (item) {
                        if (item.AcceptanceItemID && item.AreaId && item.InspectionId && !group.find(function (k) {
                            return k.AcceptanceItemID == item.AcceptanceItemID && k.AreaId == item.AreaId && k.InspectionId == item.InspectionId
                          })) {
                          group.push([item.AcceptanceItemID, item.AreaId, item.InspectionId]);
                        }
                        if (item.AcceptanceItemID && item.AreaId && item.InspectionId && !inspections.find(function (k) {
                            return k.InspectionId == item.InspectionId;
                          })) {
                          inspections.push(item.InspectionId);
                        }
                      })
                      inspections.forEach(function (id) {
                        tasks.push(function () {
                          return remote.Project.getInspectionList(id, "Inspection_zj");
                        });
                      });
                      group.forEach(function (data) {
                        InspectionZjTask(tasks, data[0], data[1], data[2]);
                      })
                    })
                  }
                ])
              api.task(tasks, {
                event: 'downloadzj',
                target: item
              })(null, function () {
                item.percent = item.current = item.total = null;
                item.isOffline = true;
                $mdDialog.hide();
                utils.alert('下载完成');
                item.isComplete = true;
                return remote.offline.create({Id: 'zj' + item.RegionID});
                resolve();
              }, function () {
                item.percent = item.current = item.total = null;
                $mdDialog.cancel();
                utils.alert('下载失败,请检查网络');
                reject()
              })
            }],
            template: '<md-dialog aria-label="正在下载基础数据"  ng-cloak><md-dialog-content> <md-progress-circular md-diameter="28" md-mode="indeterminate"></md-progress-circular><p style="padding-left: 6px;">正在下载：{{item.ProjectName}} {{item.percent}}({{item.current}}/{{item.total}})</p></md-dialog-content></md-dialog>',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            fullscreen: false
          });
        })
      })
    };

    api.event('downloadzj', function (s, e) {
      var project = vm.zj_project && vm.zj_project.find(function (item) {
          return e.target.RegionID.indexOf(item.RegionID) > -1;
        });
      var current = project && project.Children && project.Children.find(function (item) {
          return e.target.RegionID == item.RegionID;
        })
      if (current) {
        switch (e.event) {
          case 'progress':
            current.percent = parseInt(e.percent * 100) + ' %';
            current.current = e.current;
            current.total = e.total;
            break;
          case 'success':
        }
      }
    }, $scope);

    vm.downloadys = function (item) {
      return api.setNetwork(0).then(function () {
        return $q(function (resolve, reject) {
          $mdDialog.show({
            controller: ['$scope', 'utils', '$mdDialog', function ($scope, utils, $mdDialog) {
              $scope.item = item;
              var projectId = item.Children.length ? item.Children[0].AreaID.substr(0, 5) : item.ProjectID;
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
              var projectId = item.Children.length ? item.Children[0].AreaID.substr(0, 5) : item.ProjectID;
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

    vm.by = function (r) {
      api.setNetwork(0).then(function () {
        $state.go('app.xhsc.gx.gxlist', {role: 'zb', projectId: r.RegionID});
      });
    }


    function load() {
      remote.Procedure.getZGlist(23).then(function (r) {
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
                    return m.Id == "zg" + k.RectificationID;
                  })) {
                  k.isOffline = true;
                }
              })
            }
            vm.zglist = zg;
            var alert = false;
            switch (vm.yw) {
              case "4":
                var t = vm.zglist.find(function (k) {
                  return k.Status == 4;
                });
                alert = t ? false : true;
                break;
              case "32":
                var t = vm.zglist.find(function (k) {
                  return k.Status == 16;
                });
                alert = t ? false : true;
                break;
            }
            if (alert) {
              vm.isShowbg = true;
            }
            vm.f_isOver = true;

          });
        }
      });
      remote.Procedure.getInspections(1).then(function (r) {
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
                    return m.Id == "ys" + k.InspectionId;
                  })) {
                  k.isOffline = true;
                }
              })
            }
            vm.Inspections = ys;
            if (vm.yw == 16 && !vm.Inspections.length) {
              vm.isShowbg = true;
            }
            vm.y_isOver = true;
          });
        }
      });
      remote.Project.getAllRegionWithRight("", 3).then(function (n) {
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
              if (k.Children) {
                k.stretch=true;
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
      }).catch(function () {
        vm.z_isOver = true;
        vm.isShowbg = true;
      });

    }

    api.setNetwork(0).then(function () {
      load();
    })

    vm.setModule = function (val) {
      vm.bodyFlag = val;
    }
    vm.zbzjAction = function (item) {
      if (!item.isOffline) {
        vm.downloadzj(item).then(function () {
          api.setNetwork(1).then(function () {
            $state.go('app.xhsc.gx.gxlist', {role: '', projectId: item.RegionID});
          });
        })
      } else {
        api.setNetwork(1).then(function () {
          $state.go('app.xhsc.gx.gxlist', {role: '', projectId: item.RegionID});
        });
      }
    }

    vm.zbzjbtnAction = function (item, evt) {
      $mdBottomSheet.show({
        templateUrl: 'app/main/xhsc/procedure/action.html',
        controller: function ($scope) {
          $scope.btns = [{
            title: '自 检',
            action: function () {
              $mdBottomSheet.hide();
              vm.zbzjAction(item);
            }
          }, {
            title: '下 载',
            action: function () {
              $mdBottomSheet.hide();
              vm.downloadzj(item);
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

    vm.stretch = function (item) {
      item.stretch = !item.stretch;
    }
  }
})();
