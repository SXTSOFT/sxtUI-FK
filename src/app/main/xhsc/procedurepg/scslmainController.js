/**
 * Created by emma on 2016/6/21.
 */
(function () {
  'use strict';
  angular
    .module('app.xhsc')
    .controller('scslmainController', scslmainController);
  function scslmainController($mdDialog, db, scRemote, xhscService, $rootScope, $scope, scPack, utils, $q, api, $state, $mdBottomSheet) {
    var vm = this;
    var remote = scRemote;
    var pack = scPack;
    var xcpk = db('scxcpk'), dbpics = db('pics'), itemDownLoad = db('itemDownLoad');

    api.setNetwork(0).then(function () {
      remote.Procedure.authorityByUserId().then(function (res) {
        if (res && res.data && res.data.length) {
          vm.role = res.data[0].MemberType;
        } else {
          vm.role = 0;
        }
        $rootScope.role = vm.role;
        queryOnline();
        //业务数据包
      }).catch(function (r) {
      });


      function queryOnline() {
        vm.offlines = [];
        remote.Project.getAllRegionWithRight("", 3).then(function (r) {
          if (!r || r.data.length == 0) {
            utils.alert('暂无项目！');
            vm.isOver = true;
            return;
          }
          var result = xhscService.buildMutilRegionTree(r.data, 1);
          itemDownLoad.findAll().then(function (u) {
            var rows = u.rows;
            result.forEach(function (m) {
              m.AssessmentID = 'scsl' + m.RegionID + '_' + vm.role;
              m.Children.forEach(function (n) {
                var f;
                n.AssessmentID = m.AssessmentID;
                n.ProjectID = m.RegionID;
                f = rows.find(function (e) {
                  return e._id == n.RegionID;
                });
                if (f) {
                  n.isComplete = true;
                }
                xcpk.addOrUpdate({
                  _id: m.RegionID,
                  data: m
                }).then(function () {
                  vm.isOver = true;
                  vm.offlines.push(m);
                });
              });
            });
          })

        }).catch(function () {
          xcpk.findAll().then(function (s) {
            vm.offlines.push(s.rows);
            vm.isOver = true;
          }).catch(function () {
            vm.isOver = true;
          })
        });
      }

      //项目包
      function projectTask(regionID) {
        var projectId = regionID.substr(0, 5);
        return [
          function (tasks) {
            return $q(function (resolve, reject) {
              var arr = [
                remote.Project.getDrawingRelations(projectId,'scDrawingRelation'),
                dbpics.findAll()
              ];
              $q.all(arr).then(function (res) {
                var result = res[0], offPics = res[1].rows;
                var pics = [];
                result.data.forEach(function (item) {
                  if (pics.indexOf(item.DrawingID) == -1 && !offPics.find(function (r) {
                      return r._id == item.DrawingID;
                    }) && vm.sc.find(function (k) {
                      return k.AcceptanceItemID == item.AcceptanceItemID;
                    }) && item.RegionId.indexOf(regionID) > -1) {
                    pics.push(item.DrawingID);
                  }
                });
                pics.forEach(function (drawingID) {
                  tasks.push(function () {
                    return remote.Project.getDrawing(drawingID).then(function () {
                      dbpics.addOrUpdate({
                        _id: drawingID
                      })
                    });
                  })
                });
                resolve(result);
              }).catch(function () {
                reject();
              });
            })
          }
          //function () {
          //  return remote.Project.queryAllBulidings(projectId);
          //}
        ]
      }

      vm.download = function (item, isReflsh, evt) {
        if (api.getNetwork() == 1) {
          utils.alert('请打开网络!');
          return;
        }
        vm.current = item;
        //下载成功回掉
        function callBack() {
          var project = item.RegionID.substr(0, 5);
          item.isComplete = true;
          xcpk.get(project).then(function (k) {
            var data = k.data;
            data.Children.forEach(function (m) {
              if (m.RegionID == item.RegionID) {
                m.isComplete = item.isComplete;
                itemDownLoad.addOrUpdate({
                  _id: m.RegionID,
                  data: m
                })
              }
            });
          }).then(function () {
            utils.alert('下载完成');
          })
        }

        vm.sc = [];
        $mdDialog.show({
          controller: ['$scope', 'utils', '$mdDialog', function ($scope, utils, $mdDialog) {
            $scope.item = item;
            var tasks = [];
            var projectId = item.RegionID.substr(0, 5);
            tasks.push(function () {
              return remote.Assessment.GetMeasurePointAll(item.RegionID);
            });
            tasks.push(function () {
              return remote.Assessment.GetMeasurePointByRole(item.RegionID, vm.role);
            });
            tasks.push(function () {
              return remote.Assessment.GetMeasurePointGeometry(item.RegionID);
            });
            tasks.push(function () {
              return remote.Assessment.getAllMeasureReportData({RegionID: projectId, RecordType: 1})
            })
            tasks.push(function () {
              return remote.Assessment.getAllMeasureReportData({RegionID: projectId, RecordType: 1})
            })
            tasks.push(function () {
              return remote.Assessment.GetMeasureItemInfoByAreaID(projectId, "pack" + item.AssessmentID);
            });
            tasks.push(function () {
              return remote.Assessment.GetRegionTreeInfo(projectId, "pack" + item.AssessmentID);
            });
            tasks.push(function () {
              return remote.Assessment.GetBaseMeasure("pack" + item.AssessmentID).then(function (r) {
                var d = r.data && r.data.data ? r.data.data : [];
                d.forEach(function (k) {
                  if (k.WPAcceptanceList.length) {
                    vm.sc = vm.sc.concat(k.WPAcceptanceList);
                  }
                  if (k.SpecialtyChildren && k.SpecialtyChildren.length) {
                    k.SpecialtyChildren.forEach(function (n) {
                      if (n.WPAcceptanceList && n.WPAcceptanceList.length) {
                        vm.sc = vm.sc.concat(n.WPAcceptanceList);
                      }
                    });
                  }
                })
                return r;
              })
            })
            tasks = tasks.concat(projectTask(item.RegionID));
            item.percent = item.current = 0;
            item.total = tasks.length;
            api.task(tasks, {
              event: 'downloadsc',
              target: item
            })(null, function () {
              if (!isReflsh) {
                callBack();
              } else {
                utils.alert("刷新成功!");
              }
            }, function (timeout) {
              item.percent = item.current = item.total = null;
              var msg = timeout ? '请求超时,任务下载失败!' : '下载失败,请检查网络';
              $mdDialog.cancel();
              utils.alert(msg);
            })
          }],
          template: '<md-dialog aria-label="正在下载"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate"></md-progress-circular><p style="padding-left: 6px;">正在下载：{{item.ProjectName}} {{item.percent}}({{item.current}}/{{item.total}})</p></md-dialog-content></md-dialog>',
          parent: angular.element(document.body),
          clickOutsideToClose: false,
          fullscreen: false
        });
        evt && evt.stopPropagation();
      }

      api.event('downloadsc', function (s, e) {
        var current = vm.current;
        if (current) {
          switch (e.event) {
            case 'progress':
              current.percent = parseInt(e.percent * 100) + ' %';
              current.current = e.current;
              current.total = e.total;
              break;
          }
        }
      }, $scope);

      vm.upload = function (item) {
        item.progress = 0;
        remote.Project.getMap(item.ProjectID).then(function (result) {
          if (result.data && result.data.length) {
            $mdDialog.show({
              controller: ['$scope', 'utils', '$mdDialog', function ($scope, utils, $mdDialog) {
                $scope.item = item;
                var pk = pack.sc.up(item.AssessmentID);
                pk.upload(function (proc, curent, total) {
                  if (proc != -1) {
                    item.percent = proc;
                    item.current = curent;
                    item.total = total;
                  } else {
                    $mdDialog.hide();
                    item.current = item.total = null;
                    item.completed = pk.completed;
                    if (item.completed)
                      remote.Assessment.sumReportTotal(item.AssessmentID).then(function () {
                        //xcpk.addOrUpdate(vm.data);
                        utils.alert('同步完成');
                        pack.sc.removeSc(item.AssessmentID, function () {
                        });
                      })
                    else {
                      utils.alert('同步发生错误,未完成!');
                      $mdDialog.hide();
                    }
                  }
                });
              }],
              template: '<md-dialog aria-label="正在上传..."  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate"></md-progress-circular><p style="padding-left: 6px;">正在下载：{{item.ProjectName}} {{item.percent}}({{item.current}}/{{item.total}})</p></md-dialog-content></md-dialog>',
              parent: angular.element(document.body),
              clickOutsideToClose: false,
              fullscreen: false
            });
          }
          else {
            utils.alert(result.data.ErrorMessage);
          }
        }).catch(function () {
          utils.alert('网络出现异常')
        })

      }

      vm.go = function (item) {
        var routeData = {
          projectId: item.RegionID,
          assessmentID: item.AssessmentID,
          role: vm.role
        };
        api.setNetwork(1).then(function () {
          $rootScope.sc_Area = item.RegionID;
          $state.go("app.xhsc.scsl.sclist", routeData)
        })
      }

      vm.action = function (item, evt) {
        $mdBottomSheet.show({
          templateUrl: 'app/main/xhsc/procedure/action.html',
          controller: function ($scope) {
            $scope.btns = [{
              title: '实 测',
              action: function () {
                $mdBottomSheet.hide();
                vm.go(item);
              }
            }, {
              title: '刷 新',
              action: function (evt) {
                $mdBottomSheet.hide();
                vm.download(item, true, evt);
              }
            }, {
              title: '上 传',
              action: function () {
                vm.upload(item);
                $mdBottomSheet.hide();
              }
            }, {
              title: '删 除',
              action: function () {
                $mdBottomSheet.hide();
                utils.confirm('确认删除?', evt, '', '').then(function () {
                  $mdDialog.show({
                    controller: ['$scope', 'utils', '$mdDialog', function ($scope, utils, $mdDialog) {
                      pack.sc.remove(item.AssessmentID, function () {
                        $mdDialog.hide();
                        itemDownLoad.delete(item.RegionID).then(function(r){
                          item.isComplete=false;
                        });
                      })
                    }],
                    template: '<md-dialog aria-label="正在删除"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate"></md-progress-circular><p style="padding-left: 6px;">正在删除,请稍后...</p></md-dialog-content></md-dialog>',
                    parent: angular.element(document.body),
                    clickOutsideToClose: false,
                    fullscreen: false
                  });
                })
              }
            }]
          }
        });
        evt.stopPropagation();
      }
      vm.stretch = function (item) {
        item.stretch = !item.stretch;
      }

      vm.click = function (item, evt) {
        if (item.isComplete) {
          vm.go(item);
        }
        evt.stopPropagation();
      }
    });
  }
})();
