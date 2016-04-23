/**
 * Created by zhangzhaoyong on 16/1/28.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .controller('viewBathController',viewBathController);

  /** @ngInject */
  function viewBathController($scope,api,$q,$timeout,$state){
    var vm = this;
    vm.is = function(route){
      return $state.is(route);
    }
    vm.ddd = {};
    vm.ddd.grpKey = "";

    vm.project = {
      onQueryed: function(data) {
        if (!vm.project.pid) {
          vm.project.data = data;
          queryTable();
        }
      }
    };
    var pt, ptype;
    console.log('api',api)
    //质量总表
    vm.WorkGrops = []; //班组
    vm.getProjects = function() {
      api.szgc.vanke.projects({
        page_size: 1000,
        page_number: 1
      }).then(function(result) {
        vm.projects = result.data;
      })
    }
    vm.getProjects();
    // 返回
    vm.goback = function() {
      history.go(-1);
    }
    //专业类型
    //ProcedureTypeService.getAll('?startrowIndex=0&maximumRows=100&Status=4').then(function (result) {
    //    vm.project.procedureTypes = result.data.Rows;
    //});
    //加载工序
    var queryProcedures = function() {
      var t = 1;
      if (vm.project.type) {
        switch (vm.project.type) {
          case 1:
            t = 2;
            break;
          case 2:
            t = 8;
            break;
          case 8:
            t = 32;
            break;
          case 32:
            t = 64;
            break;
        }
      }
      if (pt == t && vm.project.procedureTypeId == ptype) return;
      pt = t;
      ptype = vm.project.procedureTypeId;
      api.szgc.BatchSetService.getAll({status:4,batchType: t}).then(function(result) {
        var data = [];
        console.log("BatchSetServiceresult", result);
        result.data.Rows.forEach(function(item) {
          //if (vm.project.procedureTypeName != item.ProcedureType)
          //vm.project.ProcedureType = item.ProcedureType;
          if (!vm.project.procedureTypeId || vm.project.procedureTypeId == item.ProcedureTypeId) {
            data.push(item);
          }
        });
        vm.project.procedures = data;
      });
    }

    //施工单位信息
    api.szgc.vanke.partners({
      page_size: 1000,
      page_number: 1,
      type: 'construction'
    }).then(function(result) {
      vm.project.Company = result.data;
    })
    //班组信息
    vm.WorkGrops = [{
      Id: "",
      name: "全部",
      color: "blue",
      selected: false
    }]
    //选择班组
    var checkState = function(wkId) {
      vm.WorkGrops.forEach(function(item) {
        if (item.Id == wkId) {
          item.selected = true;
          item.color = "red";
        } else {
          item.selected = false;
          item.color = "blue";
        }
      })

    };

    api.szgc.ProcedureService.getAll({status:4}).then(function(r) {
      vm.project.produres = r.data;
    });
    //获取资料表数据
    var t1,queryTable = function() {
      vm.norecords = false;
      if(t1)
        $timeout.cancel(t1);
      t1 = $timeout(function(){


      vm.baths = {};
      console.log(vm.project)
      if (vm.project.pid) {
        var batchParems = {
          isGetChilde: 1,
          produreId: vm.project.procedureId,
          workGropId: vm.project.workGroupId,
          companyId: vm.project.companyId,
          regionIdTree: vm.project.idTree
        }

        api.szgc.addProcessService.queryByProjectAndProdure2(vm.project.projectId, batchParems).then(function(result) {
          if (result.data.Rows.length > 0) {
            result.data.Rows.forEach(function(item) {
              if (item.AccordRatio > 0) {
                item.AccordRatio = item.AccordRatio * 100;
              } else {
                item.AccordRatio = undefined;
              }
            })
          }
          vm.baths = result.data;

          //console.log(" vm.baths ", result.data,vm.baths.Rows.length);
          if(vm.baths.Rows.length){
            vm.norecords = false;
          }else {
            vm.norecords = true;
          }
          //截取班组组长名称
          var fishIndex = 0;
          var lastIndex = 0;
          vm.baths.Rows.forEach(function(item) {
            fishIndex = 0;
            if (item.GrpName) {

              fishIndex = item.GrpName.indexOf("(");
              lastIndex = item.GrpName.indexOf(")");
              if (fishIndex > 0 && lastIndex > 0) {
                item.GrpWokerName = item.GrpName.substring(fishIndex + 1, lastIndex);
              } else {
                item.GrpWokerName = "";
              }
            }

          });
          $timeout(function() {
            vm.reverse = false;
            //vm.toggleSort('JLDate');
          }, 1000);

        });

      }
      else if (vm.project.data) {
        var df = [],
          batchParems = {
            isGetChilde: 1,
            produreId: vm.project.procedureId,
            workGropId: vm.project.workGroupId,
            companyId: vm.project.companyId,
            regionIdTree: vm.project.idTree
          }

        vm.project.data.items.forEach(function(p) {
          batchParems.regionIdTree = p.$id;
          df.push(api.szgc.addProcessService.queryByProjectAndProdure2(p.$id, batchParems));
        })
        $q.all(df).then(function(rs) {
          var bs = [];
          rs.forEach(function(r) {
            r.data.Rows.forEach(function(item) {
              if (item.AccordRatio > 0) {
                item.AccordRatio = item.AccordRatio * 100;
              } else {
                item.AccordRatio = undefined;
              }
              bs.push(item);
            });
          });
          vm.baths = {
            Rows: bs
          };

          //截取班组组长名称
          var fishIndex = 0;
          var lastIndex = 0;
          vm.baths.Rows.forEach(function(item) {
            // console.log("vm.GrpName", item.GrpName)
            if (item.GrpName) {
              fishIndex = 0;
              fishIndex = item.GrpName.indexOf("(");
              lastIndex = item.GrpName.indexOf(")");
              if (fishIndex > 0 && lastIndex > 0) {
                item.GrpWokerName = item.GrpName.substring(fishIndex + 1, lastIndex);
              } else {
                item.GrpWokerName = "";
              }
            }
          });
          $timeout(function() {
            vm.reverse = false;
            //vm.toggleSort('JLDate');
          }, 1000);
        })
      }
      },500);
    }



    //区域改变
    $scope.$watch(function(){
      return vm.searBarHide;
      //return  vm.project.pid;
    }, function() {
      console.log('sh',vm.searBarHide)
      if(vm.searBarHide)
      queryTable();
    })

    $scope.$watch(function(){
      return  vm.project.procedureId;
    }, function() {
      //queryTable();
    })

    $scope.$watch(function(){
      return  vm.project.companyId;
    }, function() {
      //queryTable();
    })

    //班组改变
    vm.changeWorkGrop = function(workGropId) {
      vm.project.workGroupId = workGropId;
      //queryTable();
      checkState(workGropId);
    }
    //动态加载工序
    //$scope.$watch(function(){
    //  return vm.project.procedureTypeId
    //}, queryProcedures);
    //$scope.$watch(function(){
    //  return vm.project.type;
    //}, queryProcedures);


  }
})();
