/**
 * Created by emma on 2016/5/5.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('downloadController',downloadController);

  /** @ngInject*/
  function downloadController($mdDialog,db,remote,$rootScope,$scope,pack,utils,api,$q,$state){
    var vm = this;
    api.setNetwork(0).then(function(){
      var xcpk = db('xcpk'),dbpics=db('pics');
      xcpk.get('xcpk').then(function (result) {
        vm.data = result;
        queryOnline();
      }).catch(function (err) {
        vm.data = {
          _id:'xcpk',
          rows:[]
        };
        queryOnline();
      });

      function projectTask(projectId,assessmentID) {
        return [
          function (tasks) {
            return $q(function(resolve,reject) {
              var arr=[
                remote.Project.getDrawingRelations(projectId),
                dbpics.findAll(),
                remote.Assessment.getCheckArea(assessmentID)
              ];
              $q.all(arr).then(function(res){
                var result=res[0],offPics=res[1].rows,chooseArea=res[2].data;
                var pics = [];
                if (chooseArea&&chooseArea.length){
                  result.data.forEach(function (item) {
                    if (chooseArea.find(function(k){
                       return  k.RegionID==item.RegionId
                      })&&pics.indexOf(item.DrawingID) == -1&&!offPics.find(function(r){
                        return r._id==item.DrawingID;
                      })) {
                      pics.push(item.DrawingID);
                    }
                  });
                  pics.forEach(function (drawingID) {
                    tasks.push(function () {
                      return remote.Project.getDrawing(drawingID).then(function(){
                        dbpics.addOrUpdate({
                          _id:drawingID
                        })
                      });
                    })
                  });
                }
                resolve(result);
              }).catch(function(){
                reject();
              });
            })
          }
        ]
      }


      vm.download=function(item,isReflsh){
        vm.current=item;
        //下载成功回掉
        function callBack(){
          remote.Assessment.queryById(item.AssessmentID).then(function (result) {
            var ix = vm.onlines.indexOf(item);
            if (ix != -1)
              vm.onlines.splice(ix, 1);
            ix = vm.offlines.indexOf(item);
            if(ix!=-1){
              vm.offlines.splice(ix, 1);
            }
            var it1 = vm.data.rows.find(function (it) {
              return it.AssessmentID==item.AssessmentID;
            }),ix=it1?vm.data.rows.indexOf(it1):-1;
            if(ix!=-1){
              vm.data.rows.splice(ix, 1);
            }
            delete item.pack;
            var fd = vm.data.rows.find(function (a) {
              return a.AssessmentID == result.data.AssessmentID;
            }),ix=fd?vm.data.rows.indexOf(fd):-1;
            if(ix==-1) {
              vm.data.rows.push(result.data);
              vm.offlines.push(item);
            }
            else{
              vm.data.rows[ix] = result.data;
            }
            xcpk.addOrUpdate(vm.data).then(function () {
              utils.alert('下载完成');
            })
          })
        }

        $mdDialog.show({
          controller: ['$scope','utils','$mdDialog',function ($scope,utils,$mdDialog) {
            $scope.item=item;
            var tasks=[];
            tasks.push(function () {
              return remote.Assessment.GetMeasureItemInfoByAreaID(item.ProjectID,"pack"+item.AssessmentID);
            });
            tasks.push(function () {
              return remote.Assessment.GetRegionTreeInfo(item.ProjectID,"pack"+item.AssessmentID);
            });
            tasks = tasks.concat(projectTask(item.ProjectID,item.AssessmentID));
            item.percent = item.current =0; item.total = tasks.length;
            api.task(tasks,{
              event:'downloadxc',
              target:item
            })(null,function () {
              if (!isReflsh){
                callBack();
              }else {
                utils.alert("下载成功!");
              }
            }, function (timeout) {
              item.percent = item.current = item.total = null;
              var msg=timeout?'请求超时,任务下载失败!':'下载失败,请检查网络';
              $mdDialog.cancel();
              utils.alert(msg);
            })
          }],
          template: '<md-dialog aria-label="正在下载"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate"></md-progress-circular><p style="padding-left: 6px;">正在下载：{{item.ProjectName}} {{item.percent}}({{item.current}}/{{item.total}})</p></md-dialog-content></md-dialog>',
          parent: angular.element(document.body),
          clickOutsideToClose:false,
          fullscreen: false
        });
      }

      api.event('downloadxc',function (s,e) {
        var current =vm.current;
        if(current) {
          switch (e.event) {
            case 'progress':
              current.percent = parseInt(e.percent * 100) + ' %';
              current.current = e.current;
              current.total = e.total;
              break;
          }
        }
      },$scope);

      vm.upload =function (item) {
        item.uploading = true;
        remote.Assessment.GetAssessmentStatus(item.AssessmentID).then(function (result) {
            if(result.data.ErrorCode==0){
              var pk = pack.sc.up(item.AssessmentID);
              pk.upload(function (proc) {
                item.progress = proc;
                if(proc==-1) {
                  item.completed = pk.completed;
                  if(item.completed)
                    remote.Assessment.sumReportTotal(item.AssessmentID).then(function(){
                      xcpk.addOrUpdate(vm.data);
                      item.progress = 100;
                      //utils.tips('同步完成');
                      utils.alert('同步完成');
                      item.uploading = true;
                    })
                  else {
                    utils.alert('同步未完成');
                    item.uploading = true;
                  }
                }
              });
            }
            else{
              utils.alert(result.data.ErrorMessage);
            }
          })
          .catch(function () {
            utils.alert('网络错误')
          })

      }
      vm.delete = function(item,ev){
        utils.confirm('确认删除?',ev,'','').then(function(){
          $mdDialog.show({
            controller: ['$scope','utils','$mdDialog',function ($scope,utils,$mdDialog) {
              pack.sc.remove(item.AssessmentID,function () {
                $mdDialog.hide();
                var idx = vm.data.rows.indexOf(item);
                vm.data.rows.splice(idx, 1);
                idx = vm.offlines.indexOf(item);
                vm.offlines.splice(idx, 1);
                xcpk.addOrUpdate(vm.data);
                queryOnline();
              })
            }],
            template: '<md-dialog aria-label="正在删除"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate"></md-progress-circular><p style="padding-left: 6px;">正在删除,请稍后...</p></md-dialog-content></md-dialog>',
            parent: angular.element(document.body),
            clickOutsideToClose:false,
            fullscreen: false
          });
        })
      }
      function queryOnline() {
        vm.onlines = [];
        vm.offlines = [];
        vm.data.rows.forEach(function (m) {
          m.progress = 0;
          vm.offlines.push(m);
        });
        remote.Assessment.query().then(function (result) {
          if(result.data.length==0){
            utils.alert('暂无待评估项目！');
          }
          else {
            result.data.forEach(function (m) {
              var fd = vm.data.rows.find(function (a) {
                return a.AssessmentID == m.AssessmentID;
              });
              if (fd) {

              }
              else {
                vm.onlines.push(m);
              }
            });
          }
        }).catch(function () {

        });
      }
      remote.Assessment.queryItemResults().then(function(result){
        result.data.forEach(function(t){
          t.fullName = ((t.Year+'年')||'') +'第'+t.Quarter +'季度'+ (t.ProjectName||'')+'项目得分汇总';
        })
        vm.projects = result.data;
      })
      vm.showECs = function(ev,item) {
        $mdDialog.show({
            controller: ['$scope', '$mdDialog','item', function DialogController($scope, $mdDialog,item) {
              $scope.item = item;
              $scope.hide = function () {
                $mdDialog.hide();
              };
              $scope.cancel = function () {
                $mdDialog.cancel();
              };
              $scope.answer = function (answer) {
                $mdDialog.hide(answer);
              };

              $scope.goSC=function(item){
                api.setNetwork(1).then(function(){
                  $state.go('app.xhsc.ch2',{areaID:item.AreaID,areaName:item.AreaName,assessmentID:item.AssessmentID});
                  $mdDialog.hide();
                });
              }
              $scope.goST=function(item){
                api.setNetwork(1).then(function(){
                  $state.go('app.xhsc.ch1',{areaID:item.AreaID,areaName:item.AreaName,assessmentID:item.AssessmentID,AssessmentTypeID:'7d179e8804a54819aad34b7a9398880d',typename:'实体质量'});
                  $mdDialog.hide();
                });
              }
              $scope.goAQ=function(item){
                api.setNetwork(1).then(function(){
                  $state.go('app.xhsc.ch1',{assessmentID:item.AssessmentID,AssessmentTypeID:'82666209a15647569f9bcaff50d324c2',typename:'安全文明'});
                  $mdDialog.hide();
                });
              }

            }],
            templateUrl: 'app/main/xhsc/ys/evaluateChoose.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            focusOnOpen:false,
            locals:{
              item:item
            },
            clickOutsideToClose: true
          })
          .then(function(answer) {
          });
      };
      vm.detail=function(ev,item){
        $mdDialog.show({
            controller: ['$scope', '$mdDialog','item', function DialogController($scope, $mdDialog,item) {
              $scope.item = item;
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
            templateUrl: 'app/main/xhsc/ys/detailChoose.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals:{
              item:item
            },
            clickOutsideToClose: true
            //fullscreen: useFullScreen
          })
          .then(function(answer) {

          });
      }
    });
  }
})();
