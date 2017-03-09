
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('safeSelfAcceptController',safeSelfAcceptController);

  /** @ngInject */
  function safeSelfAcceptController($state,$rootScope,$scope,$mdDialog,$stateParams,remote,$q,utils,xhUtils,$mdSidenav,$timeout,xhscService,api){
    var vm = this;
    vm.num=0;

    vm.getMaxR=function (item) {
      if (!item){
        return;
      }
      var ApplicableArea=item.ApplicableArea.split(',');
      ApplicableArea=ApplicableArea.sort();
      if (ApplicableArea.length){
        $scope.maxRegion=ApplicableArea[ApplicableArea.length-1];
        if($scope.maxRegion){
          $scope.maxRegion=parseInt($scope.maxRegion);
        }
      }
    }

    vm.selectItem=function (item) {
      $scope.current.procedure=item;
      vm.getMaxR(item);
      $mdSidenav("acceptItem").close();
      if(!$scope.current.region&&!$mdSidenav("region").isOpen()){
        vm.open("region");
      }
    }

    vm.selectRegion=function (item) {
      $scope.current.region=item;
      $mdSidenav("region").close()
      if(!$scope.current.procedure&&!$mdSidenav("acceptItem").isOpen()){
        vm.open("acceptItem");
      }
    }

    api.setNetwork(1).then(function () {
      vm.inspectionID=$stateParams.inspectionID;
      vm.inspection=null;
      $scope.current={};
      vm.procedure=[];

      vm.zk=function (item) {
        item.show=!item.show;
      }
      //初始化左侧工序栏
      function initgx(res) {
        return  remote.safe.getSecurityItem.cfgSet({
          offline: true
        })().then(function (r) {
          var acceptItemIds="";
          if (res&&res.Extends&&res.Extends.AcceptanceItemID){
            acceptItemIds=res.Extends.AcceptanceItemID;
          }
          if (r.data && r.data.length) {
            r.data.forEach(function (k) {
              if (k.SpecialtyChildren.length) {
                k.SpecialtyChildren.forEach(function (m) {
                  if (m.WPAcceptanceList.length) {
                    vm.procedure = vm.procedure.concat(m.WPAcceptanceList);
                  }
                })
              }
            });
            vm.procedure= vm.procedure.filter(function (o) {
              return acceptItemIds.indexOf(o.AcceptanceItemID)>-1;
            })
            if (vm.procedure.length>1){
              if(!$mdSidenav("region").isOpen()){
                vm.open("acceptItem");
              }
            }else {
              $scope.current.procedure=vm.procedure[0];
              $scope.maxRegion=16;
              vm.getMaxR(vm.procedure[0]);
            }
          }
        });
      }
      //初始化右边区域
      function initRegion(res) {
        var regionIds="";
        if (res&&res.Extends&&res.Extends.RegionID){
          regionIds=res.Extends.RegionID;
        }
        return   xhscService.getRegionTreeOffline("", 31,1).then(function (r) {
          vm.loaded=true;
          vm.houses=[];
          vm.building=[];
          vm.num=0;
          var regions=regionIds.split(',');
          if (r.length){
            r.forEach(function (k) {
              if (k.Children&&k.Children.length){
                k.Children.forEach(function (m) {
                  if (regions.find(function (t) {
                      return t.indexOf(m.RegionID)>-1
                    })){
                    vm.houses.push(m)
                  }
                })
              }
            });
            vm.houses.forEach(function (o) {
              if (o.Children&&o.Children.length){
                o.Children.forEach(function (m) {
                  if (regions.find(function (t) {
                      return t==m.RegionID;
                    })) {
                    vm.building.push(m);
                  }
                });
              }
            })
          }
        })
      }

      (function init(berfor) {
        berfor().then(function (res) {
          initgx(res);
          initRegion(res);
        })
      })(function () {
        return remote.self.getInspection("safe").then(function (r) {
          var data=r.data;
          if (data&&angular.isArray(data.data)){
            vm.inspection=data.data.find(function (o) {
              return o.Id==vm.inspectionID;
            });
          }
          return vm.inspection;
        });
      });

      vm.open=function (id) {
        if (id=="region"){
          setRegionStatus();
        }
        $mdSidenav(id).open();
      }
    })

    function setRegionStatus() {
      function ConvertClass(status){
        var style;
        switch (status){
          case 1:
            style="ng";
            break;
          case 2:
            style="pass";
            break;
          default:
            break;
        }
        return style;
      }

      (function (befor) {
        befor().then(function (points) {
          if($scope.maxRegion&&vm.building&&vm.building.length){  //设置状态
            var areaList=vm.inspection&&vm.inspection.AreaList?vm.inspection.AreaList:[];
            vm.num=0;
            vm.wy_num=0; //未验
            vm.bhg_num=0; //已验
            vm.hg_num=0;
            switch ($scope.maxRegion){
              case 8:
                vm.building.forEach(function (k) {
                  if (k.Children&&k.Children.length){
                    k.Children.forEach(function (u) {
                      vm.num++;
                      var area=areaList.find(function (q) {
                        return q.RegionID==u.RegionID;
                      })
                      if (area){
                        u.Status=area.Status;
                        u.style=ConvertClass(u.Status);
                        if (u.Status==1){
                          vm.bhg_num++;
                        }else {
                          vm.hg_num++;
                        }
                      }else {
                        if (points.find(function (q) {
                            if ($scope.current.procedure){
                              return q.RegionID==u.RegionID&&q.AcceptanceItemID==$scope.current.procedure.AcceptanceItemID;
                            }
                            return false;
                          })){
                          u.checked=true;
                        }else {
                          u.checked=false;
                        }
                        vm.wy_num++;
                      }
                    });
                  }
                })
                break;
              default:
                vm.building.forEach(function (k) {
                  if (k.Children&&k.Children.length){
                    k.Children.forEach(function (u) {
                      vm.num++;
                      var area=areaList.find(function (q) {
                        return q.RegionID==u.RegionID;
                      })
                      if (area){
                        u.Status=area.Status;
                        u.style=ConvertClass(u.Status);
                        if (u.Status==1){
                          vm.bhg_num++;
                        }else {
                          vm.hg_num++;
                        }
                      }else {
                        if (points.find(function (q) {
                            if ($scope.current.procedure){
                              return q.RegionID==u.RegionID&&q.AcceptanceItemID==$scope.current.procedure.AcceptanceItemID;
                            }
                            return false;
                          })){
                          u.checked=true;
                        }else {
                          u.checked=false;
                        }
                        vm.wy_num++;
                      }
                      if (u.Children&&u.Children.length){
                        u.Children.forEach(function (n) {
                          vm.num++;
                          area=areaList.find(function (q) {
                            return q.RegionID==n.RegionID;
                          })
                          if (area){
                            u.Status=area.Status;
                            u.style=ConvertClass(u.Status);
                            if (u.Status==1){
                              vm.bhg_num++;
                            }else {
                              vm.hg_num++;
                            }
                          }else {
                            if (points.find(function (q) {
                                if ($scope.current.procedure){
                                  return q.RegionID==u.RegionID&&q.AcceptanceItemID==$scope.current.procedure.AcceptanceItemID;
                                }
                                return false;
                              })){
                              u.checked=true;
                            }else {
                              u.checked=false;
                            }
                            vm.wy_num++;
                          }
                        })
                      }
                    });
                  }
                })
                break;
            }
          }
        })
      })(function () {
        return  $q(function (resolve,reject) {
          return remote.self.safe.pointQuery().then(function (r) {
            if (r&&r.data){
              resolve(r.data);
            }else {
              resolve([]);
            }
          });
        });
      });
    }

    vm.info = {
      current:null,
      cancelMode:function () {
        vm.cancelCurrent(null);
      }
    };

    vm.cancelCurrent = function ($event) {
      vm.info.current = null;
    }

    var sendResult = $rootScope.$on('sendGxResult',function(){
      utils.alert("提交成功，请稍后离线上传数据！",null,function () {
        $state.go('app.xhsc.sf.selfMain');
      });
    })
    $scope.$on("$destroy",function(){
      sendResult();
      sendResult = null;
    });


    $scope.$watch("current.region",function (v,o) {
      if (v){
        if ($scope.current.procedure){
          vm.info.show=true;
        }else {
          vm.info.show=false;
        }
      }
    })
    $scope.$watch("current.procedure",function (v,o) {
      if (v){
        if ($scope.current.region){
          vm.info.show=true;
        }else {
          vm.info.show=false;
        }
        vm.procedureData=[v];
        vm.procedureData.forEach(function(t){
          t.SpecialtyChildren = t.ProblemClassifyList;
          t.ProblemClassifyList.forEach(function(_t){
            _t.WPAcceptanceList = _t.ProblemLibraryList;
            _t.SpecialtyName = _t.ProblemClassifyName;
            _t.ProblemLibraryList.forEach(function(_tt){
              _tt.AcceptanceItemName = _tt.ProblemSortName +'.'+ _tt.ProblemDescription;
            })
          })
        })
      }
    })
  }
})();
/**
 * Created by shaoshun on 2017/3/7.
 */
