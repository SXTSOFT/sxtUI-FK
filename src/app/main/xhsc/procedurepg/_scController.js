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
    var areaId = vm.info.regionId.substr(0, 10);
    api.setNetwork(1).then(function(){
      $rootScope.title =vm.info.name;
      var packdb = db('pack'+vm.info.db);
      var arr=[
        packdb.get('GetMeasureItemInfoByAreaID'),
        remote.Project.getDrawingRelations(areaId, "scDrawingRelation"),
        remote.PQMeasureStandard.GetListByExtend(areaId.substr(0, 5), "standard")
      ]

      $q.all(arr).then(function(res){
        vm.info.loaded=true;
        var  r=res[0];
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
        vm.picRelate=res[1];
        vm.standar=res[2];

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
    });
  }
})();
