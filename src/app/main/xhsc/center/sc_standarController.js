/**
 * Created by lss on 2016/10/30.
 */
/**
 * Created by lss on 2016/7/25.
 */
/**
 * Created by jiuyuong on 2016-5-3.
 */
(function () {
  'use strict';

  angular
    .module('app.xhsc')
    .controller('sc_standarController', sc_standarController)
  /** @ngInject */
  function sc_standarController($rootScope,$scope, utils, xhUtils, $stateParams, $mdDialog, sxt, $timeout, $state, remote, $q) {
    var vm = this;
    vm.info = {
      acceptanceItemID: $stateParams.AcceptanceItemID,
      acceptanceIndexID: $stateParams.AcceptanceIndexID,
      drawing: $stateParams.DrawingID,
      projectId:$stateParams.projectID
    };
    var arr = [
      remote.Project.GetMeasureItemInfoByAreaID(),
      remote.Project.getDrawing(vm.info.drawing),
      remote.PQMeasureStandard.messageList(vm.info.drawing, vm.info.AcceptanceItemID)
    ]
    vm.selected = [];
    var mobileDetect = new MobileDetect(window.navigator.userAgent);
    vm.show=mobileDetect.mobile();
    $q.all(arr).then(function (res) {
      var r = res[0];
      vm.drawing = res[1];
      vm.scroll = true;
      var find = r.data.find(function (it) {
        return it.AcceptanceItemID == vm.info.acceptanceItemID;
      });
      if (find) {
        vm.title = $rootScope.title = find.MeasureItemName;
        var m = [];
        var tt = res[2];
        find.MeasureIndexList.forEach(function (item) {
          if (tt.data.find(function (w) {
              return w.AcceptanceIndexID == item.AcceptanceIndexID && w.Status == 1
            })) {
            item.completed = true;
          }

          if (item.AcceptanceIndexID == vm.info.acceptanceIndexID && !item.completed) {
            item.checked = true;
          }
          m.push(item);
        });

        vm.selected = $.map(m, function (r) {
          if (r.checked) {
            return r;
          }
        });


        vm.MeasureIndexes = m;
        $timeout(function () {
          if (!vm.info.acceptanceIndexID) {
            vm.scChoose();
          }
        }, 500);
      }
      vm.submit = function () {

        $mdDialog.show({
          controller: ['$scope', 'utils', '$mdDialog', function ($scope, utils, $mdDialog) {
            function reflash() {
              return remote.PQMeasureStandard.messageList(vm.info.drawing, vm.info.AcceptanceItemID).then(function (r) {
                vm.MeasureIndexes.forEach(function (k) {
                  k.num = 0;
                  r.data.forEach(function (m) {
                    if (m.AcceptanceIndexID == k.AcceptanceIndexID) {
                      k.num++;
                      k.completed = m.Status == 1 ? true : k.completed;
                      k.checked=k.checked&&k.completed?false:k.checked;
                    }
                  });
                })
                vm.selected = $.map(m, function (r) {
                  if (r.checked) {
                    return r;
                  }
                });
                return r;
              })
            }

            function valid() {
              return $q(function (resolve, reject) {
                reflash().then(function (r) {
                  vm.selected.forEach(function (k) {
                    k.num = 0;
                    r.data.forEach(function (m) {
                      if (m.AcceptanceIndexID == k.AcceptanceIndexID) {
                        k.num++;
                        k.completed = m.Status == 1 ? true : k.completed;
                      }
                    });
                  })
                  var sub = $.map(vm.selected, function (o) {
                    if (o.completed)
                      return o.IndexName;
                  });
                  if (sub.length) {
                    reject("指标:" + sub.join(",") + "重复提交！");
                    return;
                  }
                  var sub = vm.selected.filter(function (o) {
                    return !!o.num && !o.completed;
                  });
                  if (!sub.length) {
                    reject("您当前未选择任何的指标，并在图纸上描点！");
                    return;
                  }
                  resolve(sub);
                }).catch(function () {
                  reject("由于网络或者后台服务异常，导致提交失败!");
                });
              })
            }

            valid().then(function (sub) {
              var  sub=sub;
              return $q(function (resolve, reject) {
                var msg = $.map(sub, function (r) {
                  return r.IndexName
                })
                msg ="指标："+ msg.join(",")+"已经完毕，确认提交？";
                $mdDialog.hide().then(function () {
                  utils.confirm(msg, null, '', '').then(function () {
                    var arr = [];
                    sub.forEach(function (item) {
                      arr.push(remote.PQMeasureStandard.standarSubmit(item.AcceptanceIndexID, item.AcceptanceItemID, vm.drawing.data.DrawingID))
                    })
                    $q.all(arr).then(function () {
                      resolve();
                    }).catch(function () {
                      reject("由于网络或者后台服务异常，导致提交失败!");
                    })
                  })
                });
              })
            }).then(function () {
              reflash().then(function () {
                $timeout(function () {
                  vm.scChoose();
                },300)
              });
            }).catch(function (msg) {
              $mdDialog.cancel(msg);
            })
          }],
          template: '<md-dialog aria-label="正在提交"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate" md-diameter="28"></md-progress-circular><p style="padding-left: 6px;">正在下载提交，请稍后...</p></md-dialog-content></md-dialog>',
          parent: angular.element(document.body),
          clickOutsideToClose: false,
          fullscreen: false
        }).catch(function (r) {
            utils.alert(r).then(function () {
              $timeout(function () {
                vm.scChoose();
              },300)
            });
        });
      }
      vm.scChoose = function ($event) {
        $mdDialog.show({
          controller: ['$scope', '$mdDialog', function ($scope, $mdDialog) {
            $scope.checkSc = function (sc) {
              vm.MeasureIndexes.forEach(function (it) {
                it.checked = false;
              })
              sc.checked = true;
              $scope.answer([sc]);
            };
            $scope.scList = vm.MeasureIndexes;
            $scope.getIsChecked = function () {
              return !$scope.scList.find(function (r) {
                return r.checked;
              })
            }
            $scope.hide = function () {
              $mdDialog.hide();
            };
            $scope.cancel = function () {
              $mdDialog.cancel();
            };
            $scope.answer = function (answer) {
              $mdDialog.hide(answer);
            };
          }],
          targetEvent: $event,
          templateUrl: 'app/main/xhsc/ys/scChoose.html',
          parent: angular.element('#content'),
          clickOutsideToClose: false
        }).then(function (m) {
          vm.selected = $.map(m, function (r) {
            if (r.checked) {
              return r;
            }
          });

        })
      }
      var sendgxResult= $rootScope.$on("sendGxResult",function () {
        vm.submit();
      })
      $scope.$on("$destroy",function(){
        sendgxResult();
        sendgxResult=null;
      });
    }).catch(function (err) {
    });
  }
})();
