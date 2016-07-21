/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('zjhouseChooseController',zjhouseChooseController);

  /** @ngInject */
  function zjhouseChooseController($scope,$stateParams,db,$rootScope,xhUtils,remote,$timeout,$q,$state,$mdDialog,utils){
    var vm=this,
      projectId = $stateParams.projectId,
      acceptanceItemID=$stateParams.acceptanceItemID,
      acceptanceItemName = $stateParams.acceptanceItemName,
      role=$stateParams.role,
      areaId = $stateParams.areaId;
    vm.maxRegion = $stateParams.maxRegion;
    $rootScope.title = $stateParams.acceptanceItemName;
    $rootScope.sendBt = false;
    vm.maxRegion = $stateParams.maxRegion;
    function  load(){
      vm.nums={
        qb:0, //全部
        wtj:0,//未提交
        dy:0,//待验收
        hg:0, //合格
        bhg:0,//不合格
        yzg:0,//已整改
        wzg:0,//未整改
        ytj:0//已检查
      }
      function  setNum(status,region){
        if(vm.maxRegion >8){
          vm.nums.qb++;
          switch (status){
            case  0:
              vm.nums.wtj++;
              break;
            case  1:
              vm.nums.ytj++;
              break;
            case  2:
              vm.nums.hg++;
              break;
            case  4:
            case  8:
            case  16:
              vm.nums.bhg++;
              break;
          }
        }else{
          if(region.RegionType == 8){
            vm.nums.qb++;
            switch (status){
              case  0:
                vm.nums.wtj++;
                break;
              case  1:
                vm.nums.ytj++;
                break;
              case  2:
                vm.nums.hg++;
                break;
              case  4:
              case  8:
              case  16:
                vm.nums.bhg++;
                break;
            }
          }
        }


      }
      //状态设置与用户区域权限
      function filterOrSetting(status,region){
        if (region.RegionType>4){
          statusSetting(status,region);
        }
        var st=status.find(function(o){
          return o.AreaId.indexOf(region.RegionID)!=-1;
        });
        if (st){
          region.hasShowRight=true;
        }
      }
      var st2 =[];
      function setInspection(region){
        var percentage= 0,status=0;
        if(region.inspectionRows.length){
          region.inspectionRows && region.inspectionRows.forEach(function(t){
            percentage += t.Percentage;
            status = t.Status;
          })
        }else{
          percentage = region.percentage;
          status = 0;
        }
        if(percentage > 100){
          percentage = 100;
        }
        region.Percentage = percentage;
        region.status = status;
        region.style=ConvertClass(status);
        setNum(status,region);
      }
      //状态设置
      function statusSetting(status,region){
        if(!angular.isArray(status)){
          status=[status];
        }
        var st1 = [];
        region.inspectionRows=[];
        status.forEach(function(t){
          if(t.AcceptanceItemID==acceptanceItemID && t.AreaId == region.RegionID){
            region.inspectionRows.push(t);
          }else{
            region.status=0;
            region.Percentage=0;
          }
        })
        setInspection(region);
      }
      function ConvertClass(status){
        var style;
        switch (status){
          case 0:

            style="wait";
            break;
          case 2:
            style="pass";break;
          case 1:
            style="dy";
            break;
          case 4:
          case 8:
          case 16:
            style="ng";
            break;
          default:
            break;
        }
        return style;
      }
      $q.all([
        remote.Project.queryAllBulidings(projectId),
        remote.Procedure.getRegionStatus(projectId,8),
        remote.Procedure.authorityByUserId()
      ]).then(function(res){
        vm.loading = true;
        var result=res[0];
        var status=res[1]&&res[1].data?res[1].data:[];
        var permissionRegion = res[2].data;
        var find = res[2].data.forEach(function(p){
          return p.ProjectID == projectId;
        })
        //if(find){
        //  var allRegins = find;
        //  var idx = allRegins.RegionIDs.indexOf(',');
        //  if(idx == -1){
        //
        //  }else{
        //    var arr=[];
        //    arr=allRegins.RegionIDs.split(',');
        //    for(var i=0;i<arr.length;i++){
        //
        //    }
        //  }
        //}
        result.data[0].RegionRelations.forEach(function(d){
          filterOrSetting(status,d);
          d.projectTree =  d.RegionName;
          d.projectTitle = result.data[0].ProjectName + d.RegionName;
          d.Children && d.Children.forEach(function(c){
            filterOrSetting(status,c)
            c.projectTree = d.projectTree + c.RegionName;
            c.checked = false;
            c.Children && c.Children.forEach(function(r){
              r.projectTree = c.projectTree + r.RegionName;
              r.checked = false;
              filterOrSetting(status,r);
              vm.floors=vm.floors?vm.floors:[];
              vm.floors.push(r);
              r.Children && r.Children.forEach(function(_r){
                _r.projectTree = r.projectTree + _r.RegionName;
                _r.checked = false;
                filterOrSetting(status,_r);
              })
            })
          })
        })
        vm.houses =  result.data[0].RegionRelations;
      });
    }

    load();
    var inspectionInfoDef = remote.Procedure.getInspectionInfoBySign(8);

    vm.callBack=function(){
      load();
    };
    vm.selected = function(r){
      inspectionInfoDef.then(function (r1) {
        var fd = r1.data.find(function (item) {
          return item.Children.find(function (area) {
            return area.AreaID == r.RegionID;
          })!=null;
        });
        if(fd!=null){
          $state.go('app.xhsc.gx.gxzjcheck',
            {
              acceptanceItemID:acceptanceItemID,
              acceptanceItemName:acceptanceItemName,
              //name: vm.data.AreaList[0].newName,
              projectId:projectId,
              //areaId:vm.data.AreaList[0].AreaID,
              InspectionId:fd.InspectionId
            });
        }
        else{
          console.log('r',r);
          r.checked = true;
          $rootScope.$emit('sendGxResult');
        }
      });
      //zbSelected(r);
    }
    //总包点击事件
    function zbSelected(r){
      function validateChecked(r){
        if (r.status!=0&& r.status!=1){
          r.checked=false;
        }
        switch(r.RegionType){
          case 8:
            r.Children.forEach(function(m){
              if (m.checked){
                r.checked=false;
              }
            });
            break;
          case 16:
            var parent=vm.floors.find(function(m){
              return r.RegionID.indexOf(m.RegionID)>-1;
            });
            if (parent&&parent.checked){
              r.checked=false;
            }
            break;
        }
      }
      r.checked = !r.checked;
      validateChecked(r);
    }

    vm.zk = function(item){
      item.show = !item.show;
    }
    vm.filterNum = -1;
    vm.filter = function(num){
      vm.filterNum = num;
    }

    function compare(region,operator){
      if (region.Children){
        for (var  i=0;i<region.Children.length;i++){
          if (vm.regionfilterByStatus(region.Children[i])){
            return true;
          }
        }
        return  operator(region.status);
      }else {
        return  operator(region.status);
      }
    }

    vm.regionfilterByStatus=function(region){
      if (vm.filterNum==-1){
         return true;
      }
      return compare(region,function(status){
        return vm.statusRight(status);
      });
    }

    vm.statusRight=function(status){
      var show=[0,1,2,4,8,16];
      switch (vm.filterNum){
        case 0:
        case 1:
          show=[0,1];
          break;
        case 2:
          show=[2];
          break;
        case 4:
        case 8:
        case 16:
          show=[4,8,16];
          break;
      }
      return show.indexOf(status)>-1;
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
              Percentage:100
            });
          }
          _t.Children && _t.Children.forEach(function(_tt){
            if(_tt.checked){
              vm.data.AreaList.push({
                AreaID:_tt.RegionID,
                Describe:"",
                Percentage:100
              });
            }
            _tt.Children && _tt.Children.forEach(function(l){
              if(l.checked){
                vm.data.AreaList.push({
                  AreaID:l.RegionID,
                  Describe:"",
                  Percentage:100
                })
              }
            })
          })
        })
      })
      if(vm.data.AreaList.length){
        remote.Procedure.postInspection(vm.data).then(function(result){
          console.log(result);
          if (result.data.ErrorCode==0){
            $state.go('app.xhsc.gx.gxzjcheck',
              {
                acceptanceItemID:acceptanceItemID,
                acceptanceItemName:acceptanceItemName,
                //name: vm.data.AreaList[0].newName,
                projectId:projectId,
                //areaId:vm.data.AreaList[0].AreaID,
                InspectionId:result.data.Data.InspectionID
              });
          }
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
