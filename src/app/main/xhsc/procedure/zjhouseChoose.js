/**
/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('zjhouseChooseController',zjhouseChooseController);

  /** @ngInject */
  function zjhouseChooseController($scope,$stateParams,sxt,remote,$timeout,$q,$state,$mdDialog,utils,api,xhscService,$rootScope){
    var vm=this,
      projectId = $stateParams.projectId,
      acceptanceItemID=$stateParams.acceptanceItemID,
      acceptanceItemName = $stateParams.acceptanceItemName,
      areaId = $stateParams.areaId;
    vm.maxRegion = $stateParams.maxRegion;
    $rootScope.title = $stateParams.acceptanceItemName;
    $rootScope.sendBt = false;
    vm.maxRegion = $stateParams.maxRegion;
    function  load(){
      vm.nums={
        qb:0, //全部
        wtj:0,//未提交
        ytj:0//已检查
      }
      function  setNum(status,region){
        if ((vm.maxRegion==8&&region.RegionType==8)||vm.maxRegion>8&&region.RegionType>=8){
          vm.nums.qb++;
          switch (region.status){
            case  0:
              vm.nums.wtj++;
              break;
            case  1:
              vm.nums.ytj++;
              break;
          }
        }
      }
      //状态设置与用户区域权限
      function filterOrSetting(status,region){
        if (region.RegionType<=4){
          return;
        }
        if(!angular.isArray(status)){
          status=[status];
        }
        var st= status.find(function(t){
          return t.AcceptanceItemID==acceptanceItemID && t.AreaId == region.RegionID
        });
        if (st){
          region.status=st.Status;
        }else {
          region.status=0;
        }
        region.style=ConvertClass(region.status);
        setNum(status,region);
      }

      function ConvertClass(status){
        var style;
        switch (status){
          case 0:
            style="wait";
            break;
          case 1:
            style="pass";
            break;
        }
        return style;
      }
      vm.floors=[];
      $q.all([
        remote.Project.queryAllBulidings(projectId),
        remote.Procedure.getRegionStatusEx(projectId,8)
      ]).then(function(res){
        vm.loading = true;
        var result=res[0];
        var status=res[1]&&res[1].data?res[1].data:[];
        result.data[0].RegionRelations.forEach(function(d){
          filterOrSetting(status,d);
          d.projectTree =  d.RegionName;

          d.projectTitle = result.data[0].ProjectName + d.RegionName;
          d.Children && d.Children.forEach(function(c){
            c.floors=[];
            filterOrSetting(status,c)
            c.projectTree = d.projectTree + c.RegionName;
            c.checked = false;
            c.Children && c.Children.forEach(function(r){
              r.projectTree = c.projectTree + r.RegionName;
              r.checked = false;

              filterOrSetting(status,r);
              if (! r.Children||!r.Children.length){
                c.floors.push(r);
              }else {
                r.Children.forEach(function(_r){
                  _r.projectTree = r.projectTree + _r.RegionName;
                  _r.checked = false;
                  filterOrSetting(status,_r);
                })
              }
            })
          })
        })
        vm.houses =  result.data[0].RegionRelations;
      });
    }
    load();
    vm.selected = function(r){
      remote.Procedure.getRegionStatusEx(projectId,"8").then(function (r1) {
        var fd = r1.data.find(function (item) {
          return item.AreaId==r.RegionID&&item.AcceptanceItemID==acceptanceItemID;
        });
        if(fd!=null){
          $state.go('app.xhsc.gx.gxzjcheck',
            {
              acceptanceItemID:acceptanceItemID,
              acceptanceItemName:acceptanceItemName,
              projectId:projectId,
              InspectionId:fd.InspectionId
            });
        }
        else{
          r.checked = true;
          $rootScope.$emit('sendGxResult');
        }
      });
    }
    //总包点击事件

    vm.zk = function(item){
      item.show = !item.show;
    }
    vm.filterNum = -1;
    vm.filter = function(num){
      vm.filterNum = num;
    }

    vm.regionfilterByStatus=function(region){
      if (vm.filterNum==-1){
         return true;
      }
      if (region.Children&&!region.Children.length||vm.maxRegion>8){
        return true;
      }
      return region.status==vm.filterNum;
    }

    var sendgxResult =$rootScope.$on('sendGxResult',function(){
      vm.data = {
        Percentage:100,
        AreaList:[],
        Describe:'',
        Sign:8,
        AcceptanceItemID:acceptanceItemID
      }

      vm.houses.forEach(function(t){
        t.Children.forEach(function(_t){
          if(_t.checked){
            vm.data.AreaList.push({
              AreaID:_t.RegionID,
              Describe:"",
              Percentage:100,
              RegionName:_t.RegionName
            });
          }
          _t.Children && _t.Children.forEach(function(_tt){
            if(_tt.checked){
              vm.data.AreaList.push({
                AreaID:_tt.RegionID,
                Describe:"",
                Percentage:100,
                RegionName:_t.RegionName+_tt.RegionName
              });
            }
            _tt.Children && _tt.Children.forEach(function(l){
              if(l.checked){
                vm.data.AreaList.push({
                  AreaID:l.RegionID,
                  Describe:"",
                  Percentage:100,
                  RegionName:_t.RegionName+_tt.RegionName+l.RegionName
                })
              }
            })
          })
        })
      })
      if(vm.data.AreaList.length){
        if(!vm.data.Id)
          vm.data.InspectionId = sxt.uuid();
        api.setNetwork(1).then(function(){
          remote.Procedure.postInspection(vm.data).then(function(result){
            if (result.data.ErrorCode==0){
              $state.go('app.xhsc.gx.gxzjcheck',
                {
                  acceptanceItemID:acceptanceItemID,
                  acceptanceItemName:acceptanceItemName,
                  projectId:projectId,
                  InspectionId:result.data.args[0].InspectionId
                });
            }
          });
        });
      }else{
        utils.alert('请选择区域');
      }
    });

    $scope.$on("$destroy",function(){
      sendgxResult();
      sendgxResult=null;
    });
  }
})();
