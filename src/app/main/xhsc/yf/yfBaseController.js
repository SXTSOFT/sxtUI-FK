/**
 * Created by emma on 2016/6/21.
 */
(function () {
  'use strict';

  angular
    .module('app.xhsc')
    .controller('yfBaseController', yfBaseController);

  function yfBaseController(remote, xhUtils, $rootScope, utils, api, $q, $state, $scope, $mdDialog,db, $mdBottomSheet, $stateParams, xhscService) {
    var vm = this;
    vm.procedure = [];
    vm.yw = $stateParams.yw;
    vm.isShowbg = false;
    //所有全局任务
    xhscService.getProfile().then(function (profile) {
      vm.role = profile.role;
      vm.OUType = profile.ouType;
    });

    var globalTask = [
      function () {
        return remote.safe.getSecurityItem.cfgSet({
          offline: true
        })("house").then(function (r) {
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
            })) && (item.Type==7|| item.Type==-3)
        }
      }
      var relates=remote.safe.getDrawingRelate.cfgSet({
        offline: true
      })("house",regionID)
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
          return remote.safe.getRecPackage(item.RectificationID,"house").then(function (r) {
            if (r && r.data) {
              var Checkpoints = r.data.Checkpoint; //插入点
              if (angular.isArray(Checkpoints)) {
                Checkpoints.forEach(function (t) {
                  tasks.push(function () {
                    return remote.yf.yfPointCreate(t)
                  });
                });
              }
              var ProblemRecords = r.data.ProblemRecord; //插入记录
              if (angular.isArray(ProblemRecords)) {
                ProblemRecords.forEach(function (t) {
                  t.isUpload=true;
                  tasks.push(function () {
                    return remote.yf.yfProblemRecordCreate(t)
                  });
                });
              }
              var ProblemRecordFiles = r.data.ProblemRecordFile; //插入文件
              if (angular.isArray(ProblemRecordFiles)) {
                ProblemRecordFiles.forEach(function (t) {
                  tasks.push(function () {
                    return remote.yf.yfProblemRecordFileQuery(t.ProblemRecordFileID);
                  });
                });
              }
            }
          })
        }
      ]
    }

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
                .concat(getRectificationTask())
                .concat(function () {
                  return remote.offline.create({Id: 'yfZg' + item.InspectionExtendID});
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

    function loadZgLst() {
      return $q(function (resolve,reject) {
        if (vm.role||vm.role===0){
          ret(vm.role).then(function (r) {
            resolve(r);
          });
        }else {
          xhscService.getProfile().then(function (profile) {
            vm.role = profile.role;
          }).then(function () {
            ret(vm.role).then(function (r) {
              resolve(r);
            });
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
        return remote.safe.getRectificationsWrap("house",params).then(function (r) {
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
                      return m.Id == "yfZg" + k.InspectionExtendID;
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
        loadZgLst()
      ]).then(function () {
        vm.f_isOver = true;
        if (!vm.zglist.length){
          vm.isShowbg=true;
        }

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
            $state.go('app.xhsc.yf.yfRectify', {
              Role: 'zb',
              InspectionID: item.InspectionExtendID
            });
          });
        })
      } else {
        api.setNetwork(1).then(function () {
          $state.go('app.xhsc.yf.yfRectify', {
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
            $state.go('app.xhsc.yf.yfRectify', {
              Role: 'jl',
              InspectionID: item.InspectionExtendID
            })
          });
        })
      } else {
        api.setNetwork(1).then(function () {
          $state.go('app.xhsc.yf.yfRectify', {
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
  }
})();
