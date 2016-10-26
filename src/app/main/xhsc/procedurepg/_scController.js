/**
 * Created by lss on 2016/7/25.
 */
/**
 * Created by jiuyuong on 2016-5-3.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('_scController',_scController)
  /** @ngInject */
  function _scController($scope,$rootScope,xhUtils,$stateParams,utils,$mdDialog,db,scPack,sxt,$timeout,$state,remote,api,$q) {
    var vm = this;
    var  pack=scPack;
    vm.info = {
      db:$stateParams.db,
      name: $stateParams.name,
      areaId:$stateParams.areaId,
      acceptanceItemID:$stateParams.measureItemID,
      regionId: $stateParams.regionId,
      regionType: $stateParams.regionType,
      aItem:{
        MeasureItemName:$stateParams.pname,
        AcceptanceItemID:$stateParams.measureItemID
      },
      tooltip:''
    };
    api.setNetwork(1).then(function(){
      $rootScope.title =vm.info.name;
      var packdb = db('pack'+vm.info.db);
      var arr=[
        packdb.get('GetMeasureItemInfoByAreaID'),
        remote.Assessment.GetMeasurePointByRole($rootScope.sc_Area)
      ]

      $q.all(arr).then(function(res){
        var  r=res[0];
        //var  n=res[1];

        var find = r.data.find(function (it) {
          return it.AcceptanceItemID == vm.info.acceptanceItemID;
        });
        if(!find){ //TODO:一般不可能找不到,找不到肯定后台有问题,这里可能需要提示并去掉
          find = r.data.find(function () {
            return true;
          })
        }
        var m=[];
        find.MeasureIndexList.forEach(function(item) {
          m.push(item);
        });
        vm.MeasureIndexes = m;
        vm.MeasureIndexes.forEach(function(t){
          t._id = sxt.uuid();//指标结构表
          t.checked = false;
        })
        //var arr= n.data.data,t;
        //var index=1
        //for (var i=vm.MeasureIndexes.length-1;i>=0;i--){
        //  t=[];
        //  for (var j=0;j<arr.length;j++){
        //    if ( vm.info.regionId== arr[j].CheckRegionID&&vm.MeasureIndexes[i].AcceptanceIndexID==arr[j].AcceptanceIndexID){
        //      if (!arr[j].MeasurePointID){
        //        vm.MeasureIndexes[i].hide=true;
        //        //合格
        //      }else {
        //        vm.MeasureIndexes[i].hidebutton=true;
        //      }
        //      index++;
        //      break;
        //    }
        //  }
        //}

        $timeout(function () {
          vm.scChoose();
        },500);
      }).catch(function(err){
          console.log(err);
      });

      vm.scChoose = function($event){
        $mdDialog.show({
            controller: ['$scope','$mdDialog',function($scope, $mdDialog) {
              $scope.checkSc = function(sc){
                vm.MeasureIndexes.forEach(function (it) {
                  it.checked =false;
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
            targetEvent:$event,
            templateUrl: 'app/main/xhsc/ys/scChoose.html',
            parent:angular.element('#content'),
            clickOutsideToClose:vm.info.MeasureIndexes//&&vm.info.MeasureIndexes[0].checked
          })
          .then(function(answer) {
            var scStr=[];
            answer && answer.forEach(function(t){
              if(t.checked ==  true){
                scStr.push(t);
              }
            });
            vm.info.MeasureIndexes = scStr;
            var ms=[];

            vm.info.MeasureIndexes.forEach(function (m) {
              ms.push(m);
              if(m.Children && m.Children.length){
                m.Children.forEach(function (m1) {
                  ms.push(m1);
                });
              }
            });
            ms.forEach(function (m) {
              //系统中仅有"门洞尺寸"的"厚"和"宽"需要处理抹灰厚度问题
              if(m.AcceptanceIndexID=='8043e1a4efa942babdb87c5ad5116737'||m.AcceptanceIndexID=='500dc59be8d44458b6fd7940d2c54adc'){
                m.plasterDepth = vm.plasterDepth;
                m.plasterDepthMethod = m.AcceptanceIndexID=='8043e1a4efa942babdb87c5ad5116737'?'+':'-'
              }
            });
            vm.submit();
          });
      }

      vm.setRegionId = function(regionId,regionType){
        packdb.get('GetRegionTreeInfo').then(function (result) {
          vm.regionTree = result.data.Children;
          result.data.Children.forEach(function(r){
            if(r.selected == true){
              var region = xhUtils.findRegion(r.Children,regionId),
                ld = xhUtils.findRegion(r.Children,regionId.substring(0,15));
              vm.plasterDepth = ld?ld.PlasterDepth:0;
              vm.setRegion(region);
            }
          })

        });
      }
      vm.setRegion = function(region){
        vm.info.imageUrl = region.DrawingID;
        vm.info.regionId = region.RegionID;
        vm.info.regionType = region.RegionType;
        vm.info.name = region.fullName;
      }
      vm.submit = function (ev) {
        /*      $mdDialog.show($mdDialog.confirm()
         .title('提交？')
         .textContent('确定完成提交当前指标测试数据吗？')
         .ariaLabel('提交？')
         .targetEvent(ev)
         .ok('确定')
         .cancel('取消')).then(function () {*/
        var indexs = pack.sc.up(vm.info.db).indexs.db;
        vm.info.MeasureIndexes.forEach(function (m) {
          var ms = [];
          if(m.Children && m.Children.length){
            m.Children.forEach(function (it) {
              ms.push(it);
            })
          }
          else{
            ms.push(m);
          }
          ms.forEach(function (m) {
            if(!m._id)
              m._id = sxt.uuid();

            indexs.addOrUpdate({
              _id: m._id,
              RegionId: vm.info.regionId,
              RegionType:vm.info.regionType,
              AcceptanceIndexID: m.AcceptanceIndexID,
              AcceptanceItemID: vm.info.acceptanceItemID,
              IndexResultID:m._id,
              RecordType:1,
              RelationID:vm.info.db,
              Status: 1
            });
          });
        })
      }

      vm.setRegionId($stateParams.regionId);
      remote.Assessment.getMeasure({
        RegionID:$stateParams.regionId,//'0001500000000010000000001',//,
        AcceptanceItemID:$stateParams.measureItemID,//'c9ba481a76644c949d13fdb14b4b4adb',//,
        RecordType:1,
        RelationID:vm.info.db//'a55164d5c46f454ca8df799f520bbba8'//
      }).then(function (result){
        if(result.data[0] && result.data[0].data.checkUser.length){
          vm.showState = true;
        }
      })
      vm.stateGo = function(){
        var routeData={
          areaId: vm.info.areaId,
          regionId: vm.info.regionId,
          RegionName: vm.info.name,
          name: vm.info.name,
          regionType: vm.info.regionType,
          db:vm.info.db,
          measureItemID:$stateParams.measureItemID,
          pname:$stateParams.pname
        }

        $state.go('app.xhsc.scsl.schztb',routeData);
      }
    });
  }
})();
