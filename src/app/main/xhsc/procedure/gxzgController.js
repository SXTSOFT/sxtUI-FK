/**
 * Created by emma on 2016/7/1.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxzgController',gxzgController);

  /** @ngInject */
  function gxzgController($state,$rootScope,$scope,$mdDialog,remote,$timeout,$q,utils,xhUtils,api){
    var vm = this;
    $rootScope.title = $state.params.Role == 'zb'?'整改':'复验';
      vm.ProjectID=$state.params.ProjectID;
      var InspectionID=$state.params.InspectionID;
      vm.AcceptanceItemID=$state.params.AcceptanceItemID;
      var RectificationID=$state.params.RectificationID;
      vm.AcceptanceItemName=$state.params.AcceptanceItemName?$state.params.AcceptanceItemName:"";
    vm.role = $state.params.Role;
    vm.InspectionID = $state.params.InspectionID;
    vm.RectificationID = $state.params.RectificationID;
    api.setNetwork(1).then(function(){
      remote.Procedure.getZGById(RectificationID).then(function (r) {
        console.log('r1',r)
        vm.Rectification = r.data[0];
        vm.pareaList = vm.Rectification.Children;
        vm.regionSelect = vm.pareaList[0];
        vm.warter=vm.regionSelect.RegionName+(vm.AcceptanceItemName?'('+vm.AcceptanceItemName+')':"");
        vm.regionSelect.hasCheck=true;
        load();
      });

      vm.info = {

      }

      function setChina(r) {
        switch (r) {
          case 0:
            return '合格';
            break;
          case 1:
            return '待验';
            break;
          case 2:
            return '合格';
            break;
          case 4:
            return '不合格';
            break;
          case 8:
            return '未整改';
            break;
          case 16:
            return '已整改';
            break;
        }
      }
      remote.Procedure.getRectification(RectificationID).then(function(r){
        vm.baseInfor = r.data;
        vm.baseInfor.zwStatus = setChina(r.data.Status);
      })
      function load(){

        if (!vm.regionSelect){
          return;
        }
        var promises=[
          remote.Procedure.getZGReginQues(vm.regionSelect.AreaID,RectificationID)/*,
           remote.Procedure.getZGReginQuesPoint(vm.regionSelect.AreaID,RectificationID)*/
        ]
        vm.ques=[];
        $q.all(promises).then(function(res){
          vm.items = res.data;
          res[0].data.forEach(function (item) {
            var fd = vm.ques.find(function (it) {
              return it.IndexPointID==item.IndexPointID;
            });
            if(!fd){
              fd = item;
              vm.ques.push(fd);
              fd.Points = 1;
            }
            else{
              fd.Points++;
            }
          })

        })
      }
      vm.showTop = function(){
        vm.slideShow = true;
      }
      vm.showQuesList = function(){
        vm.showUp = true;
      }
      vm.selectQy = function(item){
        vm.regionSelect = item;
        vm.regionSelect.hasCheck=true;
        vm.warter=vm.regionSelect.RegionName+(vm.AcceptanceItemName?'('+vm.AcceptanceItemName+')':"");
        vm.qyslideShow = false;
        //load();
      }
      vm.showBaseInfor = function(){
        $mdDialog.show({
          controller:['$scope',function($scope){
            $scope.baseInfo = vm.baseInfor;
            $scope.area = vm.regionSelect;
            $scope.submit = function(){
              $mdDialog.hide();
            }
          }],
          templateUrl:'app/main/xhsc/procedure/baseInforTemp.html',
          clickOutsideToClose:true
        })
      }

      vm.qyslide = function(){
        vm.qyslideShow = !vm.qyslideShow;
      }
      $scope.times = xhUtils.zgDays();


      vm.showP=  function showP() {
        var  msg=[];
        vm.pareaList.forEach(function(r){
          if (!r.hasCheck){
            msg.push(r.RegionName);
          }
        });
        if (msg.length){
          utils.alert(msg.join(",")+'尚未查看!');
          return;
        };
        $mdDialog.show({
          controller:['$scope',function($scope){
            $scope.InspectionID  = InspectionID;
            $scope.role = vm.role;
            $scope.remark = '备注';
            $scope.time= 24*7;
            $scope.times = xhUtils.zgDays();
            $scope.cancel = function(){
              $mdDialog.hide();
            }
            $scope.submit = function(){
              if(vm.role=='zb'){
                var data={
                  RectificationId:RectificationID,
                  Status:16
                }
                remote.Procedure.InspectionRectificationUpdateStatus(data).then(function (r) {
                  $mdDialog.hide();
                  utils.alert('提交成功',null,function(){
                    $state.go("app.xhsc.gx.gxmain");
                  });
                })
              }
              else{
                remote.Procedure.insertJlfy({RectificationID:RectificationID,Remarks:$scope.remark,Day:$scope.time}).then(function(r){
                  if (r.data.ErrorCode==0){
                    utils.alert("提交成功",null,function(){
                      vm.Isfail=false;
                      $mdDialog.hide();
                      $state.go("app.xhsc.gx.gxmain");
                    });
                  }
                  else{
                    utils.alert("失败",null,function(){
                      vm.Isfail=true;
                    });
                  }
                })
                //TODO:可能要生成新的整改单,或完成整改
              }
            }
            remote.Procedure.getZGReginQues(null,RectificationID).then(function (r) {
              $scope.status = [
                {status:1,name:'未整改',num:0,visible:1},
                {status:2,name:'合格',num:0,visible:vm.role=='jl'?1:0},
                {status:4,name:'不合格',num:0,visible:vm.role=='jl'?1:0},
                {status:8,name:'已整改',num:0,visible:vm.role=='zb'?1:0}];

              r.data.forEach(function (item) {
                var s = $scope.status.find(function (s1) {
                  return s1.status == item.Status;
                });
                if(s)s.num++;
              });

              if($scope.status[3].num>0 && vm.role=='jl') {
                utils.alert('还有 (' + $scope.status[3].num + '处) 未检查 ，不能提交');
              }
            })
          }],
          templateUrl:'app/main/xhsc/procedure/ngTemp.html',
          clickOutsideToClose:true
        })
      }

      var gxzgChanged = $rootScope.$on('sendGxResult',vm.showP);

      $scope.$on('$destroy', function () {
        gxzgChanged();
        gxzgChanged = null;
      })

      vm.nextRegion = function(prev){
        if (angular.isArray(vm.pareaList)&&vm.pareaList.length>0){
          var  index=vm.pareaList.indexOf(vm.regionSelect);
          if (prev){
            if ((index-1)>=0){
              vm.regionSelect=vm.pareaList[index-1];
              vm.regionSelect.hasCheck=true;
              //load();
              return;
            }
          }else {
            if ((index+1)<vm.pareaList.length){
              vm.regionSelect=vm.pareaList[index+1];
              vm.regionSelect.hasCheck=true;
              //load();
              return;
            }
          }
          utils.alert("查无数据!");
        }
      };
    });
  }
})();
