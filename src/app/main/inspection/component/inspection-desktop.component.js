/**
 * Created by emma on 2016/11/15.
 */
(function () {
  'use strict';

  angular
    .module('app.inspection')
    .component('inspectionDesktop', {
      templateUrl: 'app/main/inspection/component/inspection-desktop.html',
      controller: inspectionDesktopController,
      controllerAs: 'vm'
    });

  /**@ngInject*/
  function inspectionDesktopController($state, utils, $scope, api, $rootScope, $q, $mdDialog, $window, $stateParams, ys_file, $timeout, auth, inspectionServe) {
    var vm = this;
    vm.data = {};//数据源
    vm.selected = $stateParams.index ? $stateParams.index : 0;//tab 初始选项
    auth.getUser().then(function (r) {
      vm.loginname = r.Username

      vm.upload = function (item) {
        var task = [];
        var roomId = item.room.room_id;

        function setPic(record, id) {
          if (record && id) {
            var imgs;
            if (record.pictures) {
              imgs = record.pictures.split(",");
            } else {
              imgs = [];
            }
            imgs.push(id);
            return imgs.join(',');
          }
          return record.pictures;
        }

        function getImgs(record) {
          var imgs = []
          if (record.pictures) {
            imgs = record.pictures.split(",");
          }
          return imgs;
        }

        task.push(function post() {
          return api.inspection.estate.getRepair_tasks_off(roomId).then(function (r) {
            if (r && r.data) {
              var imgs
              r.data.forEach(function (k) { //所有记录
                imgs = getImgs(k);//记录的所有图片
                task.push(function () {
                  return $q(function (resolve, reject) {
                    var arr = [];
                    imgs.forEach(function (m) {
                      arr.push(api.inspection.estate.getImg(m))
                    });
                    $q.all(arr).then(function (res) {
                      if (angular.isArray(res)) {
                        arr = [];
                        var copy;
                        res.forEach(function (n) {
                          if (n && n.data && n.data.length) {
                            copy = angular.extend({}, n.data[0]);
                            delete copy.id;
                            delete copy.markid;
                            arr.push(api.inspection.estate.insertImg(copy).then(function (res) {
                              task.push(function () {
                                return api.inspection.estate.removeImg(n.data[0]);
                              })
                              return res;
                            }))
                          }
                        })
                        $q.all(arr).then(function (result) {
                          if (angular.isArray(result)) {
                            result.forEach(function (s) {
                              if (s && s.data && s.data.data) {
                                k.pictures = setPic(k, s.data.data.url);
                              }
                            });
                          }
                          resolve();
                        }).catch(function () {
                          reject();
                        })
                      }
                    }).catch(function () {
                      reject();
                    });
                  })
                })
                k.pictures = "";
                task.push(function () {
                  var copy = angular.extend({}, k)
                  delete copy.id;
                  return api.inspection.estate.insertrepair_tasks(copy).then(function () {
                    return api.inspection.estate.deleteRepair_tasks_off(k);
                  });
                })
              });
            }
          })
        });

        taskRun(task, function () {
          api.inspection.estate.putDelivery(item.delivery_id, {
            status: "inspection_completed"
          }).then(function () {
            utils.alert("验房成功");
            vm.selected = 2;
            vm.load();
          });
        }, function () {
          utils.alert("系统在上传数据的时候发生错误,上传失败");
        }, "正在上传数据")
      }

      utils.onCmd($scope, ['swap'], function (cmd, e) {
        if (e.arg.type) {
        } else {
          $state.go('app.statistics.problem')
        }
      })

      utils.onCmd($scope, ['tj'], function (cmd, e) {
        $state.go('app.statistics.taskpage');
      })


      vm.fh = function (item) {
        api.inspection.estate.putDelivery(item.delivery_id, {
          status: "unprocessed"
        })
      }


      vm.goChecked = function (item) {
        $state.go('app.inspection.check', {delivery_id: item.delivery_id, userId: "11100000000"})
      }


      function taskRun(tasks, sucess, fail, progressTitle) {
        var progress = {};
        progressTitle = progressTitle ? progressTitle : "正在下载离线数据";
        $mdDialog.show({
          controller: ['$scope', 'utils', '$mdDialog', function ($scope, utils, $mdDialog) {
            $scope.item = progress;
            progress.percent = 0;
            progress.total = tasks.length;
            api.task(tasks, {
              timeout: 30000
            })(function (percent, current, total) {
              progress.percent = parseInt(percent) * 100 + ' %';
              progress.current = current;
              progress.total = total;
            }, function () {
              $mdDialog.hide();
              $timeout(function () {
                sucess();
              })
            }, function (timeout) {
              $mdDialog.cancel();
              fail();
            })
          }],
          template: '<md-dialog aria-label=' + progressTitle + ' ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate" md-diameter="28"></md-progress-circular><p style="padding-left: 6px;">' + progressTitle + '：{{item.ProjectName}} {{item.percent}}({{item.current}}/{{item.total}})</p></md-dialog-content></md-dialog>',
          parent: angular.element(document.body),
          clickOutsideToClose: false,
          fullscreen: false
        });
      }

      vm.download = function (item) {
        var task = inspectionServe.downloadDeliveryTask(item);
        task = task.concat(function () {
          return api.inspection.estate.issues_tree({
            type: 'delivery',
            parent_id: '',
            enabled: true,
            page_size: 10000,
            page_number: 1
          });
        });
        taskRun(task, function () {
          $timeout(function () {
            api.inspection.estate.putDelivery(item.delivery_id, {
              status: "processing"
            }).then(function (r) {
              api.inspection.estate.addOrUpdateDelivery(item).then(function () {
                utils.confirm("抢单成功,是否继续?").then(function () {
                }).catch(function () {
                  vm.selected = 1;
                });
                vm.load();
              }).catch(function () {
                utils.alert("系统在抢单,刷新单据状态的时候发生错误");
              });
            })

          })
        }, function () {
          utils.alert("网络异常,离线数据下载失败!");
        });
      }

      //进行中状态中点击进去补充验房数据
      vm.repeatCheck = function (item) {
        if (item.status == 'processing')
          $state.go('app.inspection.check', {delivery_id: item.delivery_id})
      }


      vm.load = function () {
        return api.inspection.estate.getDeliverysList({
          loginname: '11100000000',
          page_size: 50,
          page_number: 1
        }).then(function (r) {
          vm.isEmpty = angular.isArray(r.data) && r.data.length ? false : true;
          return r.data;
        }).then(setSource).catch(setSource_offline)
      }


      function setSource(souce) {
        vm.show = true;
        vm.data.unprocessed = [];
        vm.data.inspection_completed = [];
        vm.data.processing = [];
        souce.forEach(function (k) {
          switch (k.status) {
            case "unprocessed":
              vm.data.unprocessed.push(k)
              break;
            case "processing":
              vm.data.processing.push(k);
              break;
            case "inspection_completed":
              vm.data.inspection_completed.push(k)
              break;
          }
        });
        var task = [
          function () {
            return api.inspection.estate.issues_tree({
              type: 'delivery',
              parent_id: '',
              enabled: true,
              page_size: 10000,
              page_number: 1
            });
          }
        ];
        return api.inspection.estate.getDeliverysOff().then(function (r) {
          var en;
          vm.data.processing.forEach(function (n) {
            if (r && r.data) {
              en = r.data.find(function (k) {
                return k.delivery_id == n.delivery_id;
              })
            }
            if (!en) {
              task = task.concat(inspectionServe.downloadDeliveryTask(n))
            }
          });
          if (task.length > 1) {
            taskRun(task, function () {
              $timeout(function () {
                utils.alert("数据刷新完成,您可以开始验房了", null);
              })
            }, function () {

            }, "正在刷新验房数据,请稍后...")

          }
        });
      }

      function setSource_offline() {
        vm.show = true;
        vm.data.unprocessed = vm.data.unprocessed ? vm.data.unprocessed : [];
        vm.data.inspection_completed = vm.data.inspection_completed ? vm.data.inspection_completed : [];
        vm.data.processing = vm.data.processing ? vm.data.processing : [];
        api.inspection.estate.getDeliverysOff().then(function (r) {
          vm.data.processing = vm.data.processing.concat(r.data);
        });
      }

      vm.load();

      $scope.$on('$destroy', $rootScope.$on('goBack', function (s, e) {
        e.cancel = true;
        $state.go("app.szgc.ys");
      }))
    });
  }

})();
