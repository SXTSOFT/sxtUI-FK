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
  function sc_standarController($rootScope,utils, xhUtils, $stateParams, $mdDialog, sxt, $timeout, $state, remote, $q) {
    var vm = this;
    vm.info = {
      acceptanceItemID: $stateParams.AcceptanceItemID,
      acceptanceIndexID: $stateParams.AcceptanceIndexID,
      drawing: $stateParams.DrawingID
    };
    var arr = [
      remote.Project.GetMeasureItemInfoByAreaID(),
      remote.Project.getDrawing(vm.info.drawing),
      remote.PQMeasureStandard.messageList(vm.info.drawing,vm.info.AcceptanceItemID)
    ]
    vm.selected = [];
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
        var tt=res[2];
        find.MeasureIndexList.forEach(function (item) {
          if (tt.data.find(function (w) {
              return w.AcceptanceIndexID==item.AcceptanceIndexID&&w.Status==1
            })){
            item.completed=true;
          }

          if (item.AcceptanceIndexID == vm.info.acceptanceIndexID) {
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
          }],
          template: '<md-dialog aria-label="正在提交"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate" md-diameter="28"></md-progress-circular><p style="padding-left: 6px;">正在下载提交，请稍后...</p></md-dialog-content></md-dialog>',
          parent: angular.element(document.body),
          clickOutsideToClose: false,
          fullscreen: false
        });

        var r=res[2];
        remote.PQMeasureStandard.messageList(vm.info.drawing,vm.info.AcceptanceItemID).then(function(r){
          vm.selected.forEach(function(k){
            k.num=0;
            r.data.forEach(function(m){
              if (m.AcceptanceIndexID== k.AcceptanceIndexID){
                k.num++;
              }
            });
          })
          var sub = $.map(vm.selected, function (r) {
            if (r.num){
              return r;
            }
          })
          if (!sub.length){
            utils.alert("您当前未选择任何的指标，并在图纸上描点！");
            return;
          }
          if (!vm.drawing||!vm.drawing.data||!vm.drawing.data.DrawingID){
            utils.alert("当前图纸不存在！");
            return;
          }

          var p=$.map(sub,function (r) {
            return r.IndexName
          })
          p= "当前已完成的指标标准化："+  p.join(',')+"你确认提交？";
          utils.confirm(p, null, '', '').then(function () {
            var arr=[];
            sub.forEach(function (item) {
              arr.push(remote.PQMeasureStandard.standarSubmit(item.AcceptanceIndexID,item.AcceptanceItemID, vm.drawing.data.DrawingID))
            })
            $q.all(arr).then(function () {
              utils.alert("已成功标准化");
              window.history.go(-1);
            }).catch(function () {
              $mdDialog.hide();
            })
          })

        }).catch(function () {
          $mdDialog.hide();
          utils.alert("由于网络或者后台服务异常，导致提交失败!");
        })
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
          clickOutsideToClose: vm.info.MeasureIndexes
        }).then(function (m) {
          vm.selected = $.map(m, function (r) {
            if (r.checked) {
              return r;
            }
          });

        })
      }
    }).catch(function (err) {
      console.log(err);
    });
  }
})();
