/**
 * Created by emma on 2016/5/5.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('downloadController',downloadController);

  /** @ngInject*/
  function downloadController($mdDialog,db,remote,localPack,xhUtils,$rootScope,$scope,pack,utils,stzlServices,$mdBottomSheet){
    var vm = this;
    var xcpk = db('xcpk');
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
    vm.download = function (item) {
      item.progress = 0;
      item.pack = pack.sc.down(item);
      $rootScope.$on('pack'+item.AssessmentID,function (e,d) {
        //console.log(arguments);
        if(!item.pack)return;
        var p = item.pack.getProgress();
        item.progress = parseInt(p.progress);
        if(item.pack && item.pack.completed){
          var ix = vm.onlines.indexOf(item);
          if(ix!=-1)
            vm.onlines.splice(ix,1);
          ix = vm.offlines.indexOf(item);
          if(ix==-1) {
            vm.offlines.push(item);
            delete item.pack;
            vm.data.rows.push(item);
            xcpk.addOrUpdate(vm.data);
          }
          utils.tips('下载完成');
        }
       // console.log('getProgress',  item.progress);

      })
    }
    vm.upload =function (item) {
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
              utils.alert('同步完成')
            })
          else {
            utils.tips('同步未完成');
          }
        }
      });
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
      remote.Assessment.query().then(function (result) {
        result.data.forEach(function (m) {
          var fd = vm.data.rows.find(function (a) {
            return a.AssessmentID==m.AssessmentID;
          });
          if(fd){

          }
          else{
            vm.onlines.push(m);
          }
        })
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
      //var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && vm.customFullscreen;
      console.log('ev',item)
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
          //fullscreen: useFullScreen
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
  }
})();
