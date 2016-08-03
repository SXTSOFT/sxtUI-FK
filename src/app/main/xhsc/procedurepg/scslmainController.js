/**
 * Created by emma on 2016/6/21.
 */
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .controller('scslmainController',scslmainController);
  function scslmainController($mdDialog,db,scRemote,sxt,$rootScope,$scope,scPack,utils,$q,api,$state){
    var vm = this;
    var remote=  scRemote;
    var pack=scPack;
    var xcpk = db('xcpk');

    remote.Procedure.authorityByUserId().then(function(res){
      if (res&&res.data&&res.data.length){
        vm.role=res.data[0].MemberType;
      }else {
        vm.role=0;
      }
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

    }).catch(function(r){

    });
    //项目包
    function projectTask(projectId) {
     // return [];
      return [
        function (tasks) {
          return $q(function(resolve) {
            remote.Project.getDrawingRelations(projectId).then(function (result) {
              var pics = [];
              result.data.forEach(function (item) {
                if (pics.indexOf(item.DrawingID) == -1) {
                  pics.push(item.DrawingID);
                }
              });
              pics.forEach(function (drawingID) {
                tasks.push(function () {
                  return remote.Project.getDrawing(drawingID);
                })
              });
              resolve(result);
            })
          })
        },
        function () {
          return remote.Project.queryAllBulidings(projectId);
        }
      ]
    }
    vm.download = function (item) {
      item.downloading = true;
      item.progress = 0;
      var tasks = [];
      tasks.push(function () {
        return $q(function (resolve) {
          item.pack = pack.sc.down(item);
          $rootScope.$on('pack'+item.AssessmentID,function (e,d) {
            //console.log(arguments);
            if(!item.pack)return;
            var p = item.pack.getProgress();
            item.progress = parseInt(p.progress);
            if(item.pack && item.pack.completed) {
              resolve();
            }

          })
        });
      });
      tasks = tasks.concat(projectTask(item.ProjectID));
      tasks.push(function () {
        return remote.Assessment.getUserMeasureValue(item.ProjectID,1,item.AssessmentID,"Pack"+item.AssessmentID+"sc",sxt);
      });
      tasks.push(function () {
        return remote.Assessment.getUserMeasurePoint(item.ProjectID,1,"Pack"+item.AssessmentID+"point");
      });
      api.task(tasks)(function (percent, current, total) {
        item.progress = parseInt(percent * 100);
      }, function () {
        //$rootScope.isDown=true;
        var ix = vm.onlines.indexOf(item);
        if (ix != -1)
          vm.onlines.splice(ix, 1);
        ix = vm.offlines.indexOf(item);
        if(ix!=-1){
          vm.offlines.splice(ix, 1);
        }
        var it1 = vm.data.rows.find(function (it) {
          return it.ProjectID==item.ProjectID;
        }),ix=it1?vm.data.rows.indexOf(it1):-1;
        if(ix!=-1){
          vm.data.rows.splice(ix, 1);
        }
        delete item.pack;
        remote.Project.getMap().then(function (result) {
          var project=result.data.find(function(r){
            return r.ProjectID== item.ProjectID;
          });
          project.AssessmentID='scsl'+ project.ProjectID+'_'+vm.role;
          project.AssessmentSubject= project.ProjectName;
          var fd = vm.data.rows.find(function (a) {
            return a.ProjectID ==project.ProjectID;
          }),ix=fd?vm.data.rows.indexOf(fd):-1;
          if(ix==-1) {
            vm.data.rows.push(project);
            vm.offlines.push(project);
          }
          else{
            vm.data.rows[ix] = project;
          }
          xcpk.addOrUpdate(vm.data).then(function () {
            item.downloading = false;
            utils.alert('下载完成');
          })
        })
      }, function () {
        item.downloading = false;
        utils.alert('下载失败,请检查网络');
      },{timeout:20000})
    }
    vm.upload =function (item) {
      item.uploading = true;
      remote.Project.getMap(item.ProjectID).then(function (result) {
          if(result.data&&result.data.length){
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
          utils.alert('网络出现异常')
        })

    }
    vm.delete = function(item,ev){
      utils.confirm('确认删除?',ev,'','').then(function(){
        pack.sc.remove(item.AssessmentID,function () {
          var idx = vm.data.rows.indexOf(item);
          vm.data.rows.splice(idx, 1);
          idx = vm.offlines.indexOf(item);
          vm.offlines.splice(idx, 1);
          xcpk.addOrUpdate(vm.data);
          queryOnline();
        })
      })
    }

    function queryOnline() {
      vm.onlines = [];
      vm.offlines = [];
      vm.data.rows.forEach(function (m) {
        m.progress = 0;
        vm.offlines.push(m);
      });
      remote.Project.getMap().then(function (result) {
        if(!result || result.data.length==0){
          utils.alert('暂无项目！');
        }
        else {
          result.data.forEach(function (m) {
            m.AssessmentID='scsl'+ m.ProjectID+'_'+vm.role;
            m.AssessmentSubject= m.ProjectName;
            var fd = vm.data.rows.find(function (a) {
              return a.AssessmentID == m.AssessmentID;
            });
            if (fd) {

            }
            else {
              vm.onlines.push(m);
            }
          });

          vm.projects=result.data;
        }
      }).catch(function () {

      });
    }

    vm.go=function(item,isReport){

      function callBack(r){
        if (r&& r.data&& r.data.Children){
          var areas=r.data.Children;
          var  routeData={
            projectId:item.ProjectID,
            assessmentID:item.AssessmentID,
            role:vm.role,
            isReport:isReport
          };
          if (angular.isArray(areas)&&areas.length>1){
            $state.go("app.xhsc.scsl.chooseArea",routeData)
          }else {
            if(isReport){
              $state.go("app.xhsc.scsl.sclist",angular.extend(routeData,{area:areas[0].RegionID}));
            }else {
              pk.update(r).then(function(){
                $state.go("app.xhsc.scsl.sclist",angular.extend(routeData,{area:areas[0].RegionID}));
              })
            }
          }
        }
      }
      if (!isReport){
        var pk = db('pack'+item.AssessmentID);
        pk.get('GetRegionTreeInfo').then(callBack).catch(function(r){
        });
      }else {
        remote.Project.GetRegionTreeInfo(item.ProjectID).then(callBack).catch(function(r){
        });
      }

    }
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
  }
})();
