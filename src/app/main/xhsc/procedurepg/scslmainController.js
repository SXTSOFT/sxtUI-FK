/**
 * Created by emma on 2016/6/21.
 */
(function () {
  'use strict';
  angular
    .module('app.xhsc')
    .controller('scslmainController', scslmainController);
  function scslmainController($mdDialog, db, scRemote, xhscService, sxtlocaStorage,$rootScope, $scope, scPack, utils, $q, api, $state, $mdBottomSheet) {
    var vm = this;
    var remote = scRemote;
    var pack = scPack;
    var xcpk = db('scxcpk');
    var itemDownLoad=sxtlocaStorage.getArr("itemDownLoad");
      xhscService.getProfile().then(function (profile) {
        vm.role=profile.role;
        queryOnline();
      });
    function queryOnline() {
      vm.offlines = [];
      xhscService.getRegionTreeOffline("", 3,1,"scRigthRegions").then(function (result) {
        if (!result){
          vm.isOver = true;
          return;
        }
        result.forEach(function (m) {
          m.AssessmentID = 'scsl' + m.RegionID + '_' + vm.role;
          m.Children.forEach(function (n) {
            var f;
            n.AssessmentID = m.AssessmentID;
            n.ProjectID = m.RegionID;
            f = itemDownLoad.find(function (e) {
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
              m.stretch=true;
              vm.offlines.push(m);
            });
          });
        });
      }).catch(function () { //在没有网络的时候
        xcpk.findAll().then(function (s) {
          vm.offlines.push(s.rows);
          vm.isOver = true;
        }).catch(function () {
          vm.isOver = true;
        })
      });
    }



    function projectTask(regionID) {
      var projectId = regionID.substr(0, 5);
      function  filter(item) {
         return vm.sc.find(function (k) {
           return k.AcceptanceItemID == item.AcceptanceItemID;
         })
      }
      return [
        function (tasks) {
          return $q(function (resolve, reject) {
            return xhscService.downloadPics(regionID,"scDrawingRelation",filter).then(function (t) {
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
          var loaded=[];
          data.Children.forEach(function (m) {
            if (m.RegionID == item.RegionID) {
              m.isComplete = item.isComplete;
              loaded.push({
                _id: m.RegionID,
                data: m
              });
            }
          });
          sxtlocaStorage.setArr2("itemDownLoad",loaded,function (_old,_new) {
            return _new.filter(function (k) {
                return !_old.some(function (t) {
                  return t._id==k._id;
                })
            });
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
            return remote.PQMeasureStandard.GetListByExtend(projectId,"standard");
          });
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
        template: '<md-dialog aria-label="正在下载"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate" md-diameter="28"></md-progress-circular><p style="padding-left: 6px;">正在下载：{{item.ProjectName}} {{item.percent}}({{item.current}}/{{item.total}})</p></md-dialog-content></md-dialog>',
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
              $scope.loading=false;
              var pk = pack.sc.up(item.AssessmentID);
              pk.upload(function (proc, curent, total) {
                if (proc != -1) {
                  item.percent = proc;
                  item.current = curent;
                  item.total = total;
                } else {
                  item.current = item.total = null;
                  item.completed = pk.completed;
                  if (item.completed)
                    $q(function(resolve,reject){
                      $scope.loading=true;
                      remote.Assessment.sumReportTotal(item.AssessmentID).then(function () {
                        pack.sc.removeSc(item.AssessmentID, function () {
                          $q.all([
                            // remote.Assessment.GetMeasurePointAll(item.RegionID),
                            remote.Assessment.GetRegionTreeInfo(item.ProjectID, "pack" + item.AssessmentID)
                          ]).then(function(){
                            resolve()
                          }).catch(function(){
                            reject();
                          })
                          ;//刷新状态
                        });
                      }).catch(function(){
                        reject();
                      })
                    }).then(function(){
                      $mdDialog.hide();
                      utils.alert('同步完成');
                    }).catch(function(){
                      $mdDialog.hide();
                      utils.alert('在刷新数据的时候发生了错误');
                    })
                  else {
                    utils.alert('同步发生错误,未完成!');
                    $mdDialog.hide();
                  }
                }
              });
            }],
            template: '<md-dialog aria-label="正在上传..."  ng-cloak><md-dialog-content> <md-progress-circular md-diameter="28" md-mode="indeterminate"></md-progress-circular><p ng-if="!loading" style="padding-left: 6px;">正在上传：{{item.ProjectName}} {{item.percent}}({{item.current}}/{{item.total}})</p><p ng-if="loading" style="padding-left: 6px;">正在刷新数据,请稍后....</p></md-dialog-content></md-dialog>',
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
                      sxtlocaStorage.removeArrItem("itemDownLoad",function (t) {
                         return t._id==item.RegionID
                      });
                      item.isComplete=false;
                    })
                  }],
                  template: '<md-dialog aria-label="正在删除"  ng-cloak><md-dialog-content> <md-progress-circular  md-diameter="28" md-mode="indeterminate"></md-progress-circular><p style="padding-left: 6px;">正在删除,请稍后...</p></md-dialog-content></md-dialog>',
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

  }
})();
