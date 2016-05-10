/**
 * Created by emma on 2016/5/5.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('downloadController',downloadController);

  /** @ngInject*/
  function downloadController($mdDialog,db,remote,localPack,xhUtils,$rootScope,$scope,pack,utils){
    var vm = this;
    var pk = db('xcpk');
    pk.get('xcpk').then(function (result) {
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
      var pack =localPack.pack({
        _id:item.AssessmentID,
        name:item.AssessmentSubject,
        tasks:[
          {
            _id:'GetMeasureItemInfoByAreaID',
            name:'获取分期下所有指标',
            url:'/Api/MeasureInfo/GetMeasureItemInfoByAreaID?areaID='+item.AreaID
          },
          {
            _id:'GetRegionTreeInfo',
            name:'获取区域信息',
            url:'/Api/ProjectInfoApi/GetRegionTreeInfo?AreaID='+item.AreaID,
            type:'ExRegion',
            item:angular.copy(item)
          }
        ]
      })
      item.pack = pack;
      $rootScope.$on('pack'+item.AssessmentID,function (e,d) {
        //console.log(arguments);
        var p =pack.getProgress();
        item.progress = parseInt(p.progress*100);
        if(item.pack && item.pack.completed){
          var ix = vm.onlines.indexOf(item);
          if(ix!=-1)
            vm.onlines.splice(ix,1);
          ix = vm.offlines.indexOf(item);
          if(ix==-1) {
            vm.offlines.push(item);
            delete item.pack;
            vm.data.rows.push(item);
            pk.addOrUpdate(vm.data);
          }
        }
       // console.log('getProgress',  item.progress);

      })
    }
    vm.upload =function (item) {
      var pk = pack.sc.up(item.AssessmentID);
      pk.upload(function (proc) {
        item.progress = proc;
        if(proc==100) {
          item.completed = pk.completed;
          if(item.completed)
            pk.addOrUpdate(item);
          else {
            utils.tips('同步未完成');
          }
        }
      });
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
    vm.showECs = function(ev,item) {
      //var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && vm.customFullscreen;
      // console.log('ev',parent)
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
        locals:{
          item:item
        },
          clickOutsideToClose: true
          //fullscreen: useFullScreen
        })
        .then(function(answer) {

        });

    };

  }
})();
