/**
 * Created by emma on 2016/6/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('pcenterController',pcenterController);

  /**@ngInject*/
  function pcenterController($scope,$mdDialog,db,auth,$rootScope,api,utils,$q,remote,versionUpdate,$state,$timeout,$mdBottomSheet){
    var vm = this;

    vm.serverAppVersion = versionUpdate.version;
    var pro=[
      remote.profile()
    ];
    $q.all(pro).then(function(r){
      var role=r[0];
      vm.user={};
      vm.u={};
      if (role&&role.data&&role.data){
          vm.user.name= role.data.Name,
          vm.user.userName= role.data.UserName
          switch (role.data.Role.MemberType){
            case 0:
              vm.user.role='总包';
                  break
            case 2:
              vm.user.role='监理';
                  break;
            case 4:
              vm.user.role="项目部";
          }
      }
    });

    vm.goMsg=function(){
      $state.go("app.xhsc.mcenter");
    }

    $rootScope.$on('sxt:online', function(event, state){
      vm.networkState = api.getNetwork();
    });
    $rootScope.$on('sxt:offline', function(event, state){
      vm.networkState = api.getNetwork();
    });
    vm.networkState = api.getNetwork();
    $scope.$watch(function () {
      return vm.networkState
    },function () {
      api.setNetwork(vm.networkState);
    });

    vm.clearCache=function(){
      utils.confirm('确定清除所有缓存数据吗?').then(function (result) {
        vm.trueClear = function (exclude) {
          $mdDialog.show({
              controller: ['$scope','utils','$mdDialog',function ($scope,utils,$mdDialog) {
                api.clearDb(function (persent) {
                  $scope.cacheInfo = parseInt(persent * 100) + '%';
                }, function () {
                  $scope.cacheInfo = null;
                  //$rootScope.$emit('clearDbSuccess');
                  $mdDialog.hide();
                  //utils.alert('清除成功');
                }, function () {
                  $scope.cacheInfo = null;
                  $mdDialog.cancel();
                  utils.alert('清除失败');

                }, {
                  exclude: exclude,
                  timeout: 3000
                })
              }],
              template: '<md-dialog aria-label="正在清除"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate"></md-progress-circular> 正在清除数据，请稍候……({{cacheInfo}})</md-dialog-content></md-dialog>',
              parent: angular.element(document.body),
              clickOutsideToClose:false,
              fullscreen: false
            })
            .then(function(answer) {
            }, function() {
              utils.alert('清除成功');
            });
          return;
        }
        vm.trueClear(['v_profile']);
      });
    }
    vm.logout = function(){
      utils.confirm('确定清除所有缓存数据吗?').then(function (result) {
        vm.trueClear = function (exclude) {
          $mdDialog.show({
              controller: ['$scope','utils','$mdDialog',function ($scope,utils,$mdDialog) {
                api.clearDb(function (persent) {
                  $scope.cacheInfo = parseInt(persent * 100) + '%';
                }, function () {
                  $scope.cacheInfo = null;
                  //$rootScope.$emit('clearDbSuccess');
                  $mdDialog.hide();
                  //utils.alert('清除成功');
                }, function () {
                  $scope.cacheInfo = null;
                  $mdDialog.cancel();
                  utils.alert('清除失败');

                }, {
                  exclude: exclude,
                  timeout: 3000
                })
              }],
              template: '<md-dialog aria-label="正在清除"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate"></md-progress-circular> 正在清除数据，请稍候……({{cacheInfo}})</md-dialog-content></md-dialog>',
              parent: angular.element(document.body),
              clickOutsideToClose:false,
              fullscreen: false
            })
            .then(function(answer) {
              auth.logout();
            }, function() {

            });
          return;
        }
        vm.trueClear(['v_profile']);
      });
    }
    //消息中心
    function reloadMessage() {
     return  remote.message.messageList(0, 0).then(function (result) {
        vm.messages = [];
        result.data.Items.forEach(function (item) {
          var name="系统提示";
          item.style={
            background:"#f00"
          }
          if (item.ExtrasContent&&item.ExtrasContent.Status&&item.ExtrasContent.Status<4){
            switch (item.ExtrasContent.Status){
              case 1:
                name="工序验收";
                break;
              case 2:
                name="工序整改";
                break;
              case 3:
               name="工序复验";
                break;
              case 4:
            }
            item.style.background="#ff6d1f"
          }
          vm.messages.push({
            id: item.Id,
            name:name,
            time: item.SendTime,
            title: item.Title,
            description: item.Content,
            ExtrasContent:item.ExtrasContent,
            style:item.style
          });
        })

        function DynamicItems() {
          /**
           * @type {!Object<?Array>} Data pages, keyed by page number (0-index).
           */
          this.loadedPages = {};

          /** @type {number} Total number of items. */
          this.numItems = 0;

          /** @const {number} Number of items to fetch per request. */
          this.PAGE_SIZE = 50;

          this.fetchNumItems_();
        };
        // Required.
        DynamicItems.prototype.getItemAtIndex = function(index) {
          var pageNumber = Math.floor(index / this.PAGE_SIZE);
          var page = this.loadedPages[pageNumber];

          if (page) {
            return page[index % this.PAGE_SIZE];
          } else if (page !== null) {
            this.fetchPage_(pageNumber);
          }
        };
        // Required.
        DynamicItems.prototype.getLength = function() {
          return this.numItems;
        };

        DynamicItems.prototype.fetchPage_ = function(pageNumber) {
          // Set the page to null so we know it is already being fetched.
          this.loadedPages[pageNumber] = null;

          // For demo purposes, we simulate loading more items with a timed
          // promise. In real code, this function would likely contain an
          // $http request.
          $timeout(angular.noop, 0).then(angular.bind(this, function() {
            this.loadedPages[pageNumber] = [];
            var pageOffset = pageNumber * this.PAGE_SIZE;
            for (var i = pageOffset; i < pageOffset + this.PAGE_SIZE; i++) {
              if (vm.messages[i]){
                this.loadedPages[pageNumber].push(vm.messages[i]);
              }
            }
          }));
        };

        DynamicItems.prototype.fetchNumItems_ = function() {
          $timeout(angular.noop, 0).then(angular.bind(this, function() {
            this.numItems = vm.messages.length;
          }));
        };
        vm.dynamicItems = new DynamicItems();

      })
    }
    reloadMessage();
    var onMessage = $rootScope.$on('receiveMessage',function(){
      reloadMessage();
    })
    $scope.$on('destroy',function(){
      onMessage();
    })
    vm.messages&&vm.messages.forEach(function(t){
      t.checked = false;
    })
    $scope.$watch('vm.msgList',function(){
      var i=0;
      vm.messages&&vm.messages.forEach(function(t){
        console.log(t.checked)
        if(t.checked){
          i++;
        }
      })
      if(i){
        vm.showSend = true;
      }else{
        vm.showSend  = false;
      }
    },true)
    function operateMsg(ev){
      utils.confirm('确认全部删除?',ev,'','').then(function(){
        remote.message.deleteAllMessage().then(function () {
          reloadMessage();
        })
      })
    }
    var event=   $rootScope.$on('operateMsg',operateMsg);
    vm.action=function(item,evt){
      if (!(item.ExtrasContent&&item.ExtrasContent.Status&&item.ExtrasContent.Status<4)){
        return;
      }
      $mdBottomSheet.show({
        templateUrl: 'app/main/xhsc/procedure/action.html',
        controller: function ($scope) {
          $scope.btns = [{
            title: '处 理',
            action: function () {
              $mdBottomSheet.hide();
              if (item.ExtrasContent&&item.ExtrasContent.Status){
                item.ExtrasContent.id=item.id;
                switch (item.ExtrasContent.Status){
                  case 1:
                   vm.jlysAction(item.ExtrasContent);
                        break;
                  case 2:
                    vm.zbzgAction(item.ExtrasContent)
                        break;
                  case 3:
                    vm.jlfyAction(item.ExtrasContent);
                    break;
                  case 4:
                    break;
                }
              }
            }
          }, {
            title: '删 除',
            action: function () {
              $mdBottomSheet.hide();
              remote.message.deleteMessage(item.id).then(function () {
                reloadMessage();
              })
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




    //业务逻辑
    var dbpics = db('pics');
    var globalTask = [
      function () {
        return remote.Procedure.queryProcedure();
      }
    ];
    function projectTask(region, areas, acceptanceItemID) {
      var projectId=region.substr(0,5);
      return [
        function (tasks) {
          return $q(function (resolve) {
            var arr = [
              remote.Project.getDrawingRelations(region),
              dbpics.findAll()
            ];
            $q.all(arr).then(function (res) {
              var result = res[0], offPics = res[1].rows;
              var pics = [];
              result.data.forEach(function (item) {
                if ((!acceptanceItemID || item.AcceptanceItemID == acceptanceItemID) &&
                  (!areas || areas.find(function (a) {
                    return a.AreaID == item.RegionId;
                  })) &&
                  pics.indexOf(item.DrawingID) == -1 && !offPics.find(function (r) {
                    return r._id == item.DrawingID;
                  }) && vm.procedure.find(function (k) {
                    return k.AcceptanceItemID == item.AcceptanceItemID;
                  })) {
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
            });
          })
        },
        function () {
          return remote.Project.queryAllBulidings(projectId);
        }
      ]
    }
    function InspectionTask(item) {
      var t = [function () {
        return remote.Project.getInspectionList(item.InspectionId);
      }];
      item.AreaList.forEach(function (area) {
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
              var tasks = [].concat(globalTask)
                .concat(projectTask(item.AreaList[0].AreaID, item.AreaList, item.AcceptanceItemID))
                .concat(InspectionTask(item))
                .concat(function () {
                  return remote.offline.create({Id: 'ys' + item.InspectionId});
                })
              api.task(tasks, {
                event: 'downloadys',
                target: item
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
            template: '<md-dialog aria-label="正在下载"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate"></md-progress-circular><p style="padding-left: 6px;">正在下载： {{item.AcceptanceItemName}} {{item.percent}}({{item.current}}/{{item.total}})</p></md-dialog-content></md-dialog>',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            fullscreen: false
          });
        })
      });
    }
    api.event('downloadys', function (s, e) {
      var current = e.target;
      switch (e.event) {
        case 'progress':
          current.percent = parseInt(e.percent * 100) + ' %';
          current.current = e.current;
          current.total = e.total;
          break;
        case 'success':
          break;
      }
    }, $scope);

    vm.downloadzg = function (item) {
      item.InspectionId=item.InspectionId?item.InspectionId:item.InspectionID;
      return $q(function (resolve, reject) {
        api.setNetwork(0).then(function () {
          $mdDialog.show({
            controller: ['$scope', 'utils', '$mdDialog', function ($scope, utils, $mdDialog) {
              $scope.item = item;
              var tasks = [].concat(globalTask)
                .concat(projectTask(item.AreaList[0].AreaID, item.AreaList, item.AcceptanceItemID))
                .concat(InspectionTask(item))
                .concat(rectificationTask(item))
                .concat(function () {
                  return remote.offline.create({Id: 'zg' + item.RectificationID});
                });
              api.task(tasks, {
                event: 'downloadzg',
                target: item
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
            template: '<md-dialog aria-label="正在下载"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate"></md-progress-circular><p style="padding-left: 6px;">正在下载：{{item.ProjectName}} {{item.percent}}({{item.current}}/{{item.total}})</p></md-dialog-content></md-dialog>',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            fullscreen: false
          });
        });
      })

    }
    api.event('downloadzg', function (s, e) {
      var current = e.target;
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

    vm.jlfyAction = function (item) {
      item.InspectionId=item.InspectionId?item.InspectionId:item.InspectionID;
      vm.downloadzg(item).then(function () {
        api.setNetwork(1).then(function () {
          remote.message.deleteMessage(item.id).then(function(){
            $state.go('app.xhsc.gx.gxzg', {
              Role: 'jl',
              InspectionID: item.InspectionId,
              AcceptanceItemID: item.AcceptanceItemID,
              RectificationID: item.RectificationID
            })
          })
        });
      })
    }
    vm.zbzgAction = function (item) {
        item.InspectionId=item.InspectionId?item.InspectionId:item.InspectionID;
        vm.downloadzg(item).then(function () {
          api.setNetwork(1).then(function () {
            remote.message.deleteMessage(item.id).then(function(){
              $state.go('app.xhsc.gx.gxzg', {
                Role: 'zb',
                InspectionID: item.InspectionId,
                AcceptanceItemID: item.AcceptanceItemID,
                RectificationID: item.RectificationID,
                AcceptanceItemName: item.AcceptanceItemName
              });
            })
          });
        })
    }
    vm.jlysAction = function (item) {
      item.InspectionId=item.InspectionId?item.InspectionId:item.InspectionID;
      vm.downloadys(item).then(function () {
        api.setNetwork(1).then(function () {
          remote.message.deleteMessage(item.id).then(function(){
            $state.go('app.xhsc.gx.gxtest', {
              acceptanceItemID: item.AcceptanceItemID,
              acceptanceItemName: item.AcceptanceItemName,
              name: item.AreaList[0].newName,
              projectId: item.AreaList[0].substring(0, 5),
              areaId: item.AreaList[0],
              InspectionId: item.InspectionId
            })
          })
        });
      })
    }

    $scope.$on("$destroy",function(){
      event();
      event=null;
    });
  }
})();
