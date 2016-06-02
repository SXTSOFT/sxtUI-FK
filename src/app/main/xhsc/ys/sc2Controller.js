/**
 * Created by jiuyuong on 2016-5-3.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('sc2Controller',sc2Controller)
  /** @ngInject */
  function sc2Controller($scope,$rootScope,xhUtils,$stateParams,utils,$mdDialog,db,pack,sxt,$state) {
    var vm = this;
    vm.info = {
      db:$stateParams.db,
      name: $stateParams.name,
      areaId:$stateParams.areaId,
      acceptanceItemID: $stateParams.measureItemID,
      regionId: $stateParams.regionId,
      regionType: $stateParams.regionType,
      aItem:{
        MeasureItemName:$stateParams.pname,
        AcceptanceItemID:$stateParams.measureItemID
      },
      tooltip:''
    };
    $rootScope.title = vm.info.aItem.MeasureItemName;
    var packdb = db('pack'+vm.info.db);
    packdb.get('GetMeasureItemInfoByAreaID').then (function (r) {
      //console.log('r',r)
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
      vm.scChoose();
    },function(err){

    });

    //var docClick = function(e){
    //  var target = $(e.target);
    //  if(target.closest("#scchoose").length == 0){
    //    //$(element).find('.numberpanel').css('display','none');
    //    history.go(-1);
    //    $mdDialog.cancel();
    //  }
    //}
    vm.scChoose = function($event){
      $mdDialog.show({
          controller: DialogController,
          targetEvent:$event,
          templateUrl: 'app/main/xhsc/ys/scChoose.html',
          //parent: angular.element(document.body),
          parent:angular.element('#content'),
        //  onComplete:function(){
        //  if(!vm.info.MeasureIndexes){
        //    console.log('parent',parent)
        //    $(document).find('.md-dialog-container').bind("click",docClick);
        //
        //  }
        //},
        clickOutsideToClose:vm.info.MeasureIndexes//&&vm.info.MeasureIndexes[0].checked
        })
        .then(function(answer) {
          var scStr=[];
          answer.forEach(function(t){
            if(t.checked ==  true){
              scStr.push(t);
            }
          });
          vm.info.MeasureIndexes = scStr;
          vm.submit();
         });
    }

    vm.setRegionId = function(regionId,regionType){
      packdb.get('GetRegionTreeInfo').then(function (result) {
        var region = xhUtils.findRegion([result.data],regionId);
        vm.setRegion(region)
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
              RecordType:4,
              RelationID:vm.info.db,
              Status: 1
            });
          });
        })
/*      }, function () {

      });*/

    }

    vm.nextRegion = function(prev){
      //vm.info.regionId 当前
      packdb.get('GetRegionTreeInfo').then(function (result) {
        var  rr=xhUtils.wrapRegion(result.data);
        var region = xhUtils.findRegion([rr],vm.info.regionId);
        if (region){
          var next=prev?region.prev():region.next();
          if (!next){
            utils.alert("查无数据!");
            return;
          }
          vm.setRegion(next);
        }
      });
    };

    vm.setRegionId($stateParams.regionId);
    function DialogController($scope, $mdDialog) {

      console.log(vm.info.MeasureIndexes,$mdDialog)
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
    }
  }
})();
