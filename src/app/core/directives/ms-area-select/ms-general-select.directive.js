/**
 * Created by shaoshun on 2016/11/28.
 */
/**
 * Created by Corning on 16/11/15.
 */
(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('msGenSelectController', msGenSelectController)
    .directive('msGenSelect', msGenSelect);

  /** @ngInject */
  function msGenSelect($rootScope) {
    return {
      restrict: 'E',
      scope: {
        areas: '=',
        procedure: "=",
        current:"=",
        level:"=",
        arearId:"=",
        name:"="
      },
      templateUrl: 'app/core/directives/ms-area-select/ms-general-select.html',
      controller: 'msGenSelectController',
      link: function ($scope, element, attr, ctrl) {
        $scope.toggle=function (status) {
           var  _status=['region','part','procedure'];
           if (!$scope.status){
             $scope.status={};
           }
          _status.forEach(function (r) {
            if (r!==status){
              $scope.status[r]=false;
            }
          })
          $scope.status[status]=! $scope.status[status];
        }
        $scope.setBuilding=function (area,siblings) {
          $scope.setActive(area,siblings);
          $scope.source.parts=[];
          $scope.source.floors=[];
          $scope.source.rooms=[];
          $scope.source.parts=area.Children;
          if ( $scope.source.parts.length){
            $scope.setFloor($scope.source.parts[0],$scope.source.parts);
          }
          $scope.current=$scope.current?$scope.current:{};
          $scope.current.region=null;
          $scope.current.selectedArea=area;
          $scope.toggle('part');
        }
        $scope.setFloor=function (area,siblings) {
          $scope.setActive(area,siblings);
          $scope.source.floors=[];
          $scope.source.rooms=[];
          if ($scope.current){
            $scope.current.region=null;
          }
          $scope.source.floors=area.Children;
        }
        $scope.setRoom=function (area,siblings) {
          $scope.setActive(area,siblings);
          if($scope.level&&parseInt($scope.level)<5){
            $scope.selectedRegion(area,siblings);
          }else if($scope.level=="5"){
            if ($scope.current){
              $scope.current.region=null;
            }
            $scope.source.rooms=area.Children;
          }else {
            // $scope.setActive(area,siblings);
            if ($scope.current){
              $scope.current.region=null;
            }
            $scope.source.rooms=[{
              RegionID:"no",
              RegionName:"不到户",
              parent:area,
              active:true
            }].concat(area.Children);
          }
        }
        $scope.selectedRegion=function (item,siblings) {
          $scope.setActive(item,siblings);
          if (item.RegionID=="no"||item.RegionID.length>10){
            if (!$scope.current||!$scope.current.procedure){
              $scope.toggle('procedure');
            }else {
              $scope.toggle('part');
            }
          }else {
            $scope.toggle('region');
          }
          $scope.current=$scope.current?$scope.current:{};
          $scope.current.region=item.RegionID=="no"?item.parent:item;
        }
        $scope.selectedProcedure=function (item,siblings) {
          $scope.setActive(item,siblings);
          if (!$scope.current||!$scope.current.region){
            $scope.toggle('part');
          }else {
            $scope.toggle('procedure');
          }
          $scope.current=$scope.current?$scope.current:{};
          $scope.current.procedure=item;
        }

        $scope.setSpecialty=function (item,siblings) {
          $scope.setActive(item,siblings);
          $scope.source.wpAcceptanceList=[];
          if ($scope.current){
            $scope.current.procedure=null;
          }
          $scope.source.wpAcceptanceList=item.WPAcceptanceList
        }

        $scope.$watch("areas",function (v,o) {
            if (!v){
               return;
            }
            v.then(function (r) {
              $scope.build=null;
              if ($scope.arearId){
                  var area;
                  r.forEach(function (m) {
                    area=m.Children.find(function (k) {
                      return k.RegionID==$scope.arearId;
                    })
                    if (area){
                      $scope.build=area.Children;
                    }
                  })
              }
              if ($scope.build&&$scope.build.length>0){
                $scope.source.parts=$scope.build
                $scope.setRegion($scope.source.parts[0],$scope.build);
                $scope.status={
                  region:false,
                  part:true,
                  procedure:false
                };

              }else {
                $scope.source.areasData=r
                $scope.setRegion($scope.source.areasData[0]);
                $scope.status={
                  region:true,
                  part:false,
                  procedure:false
                };
              }
              $scope.loaded = true;
              $rootScope.$emit("msGenSelect_loaded");
            }).catch(function () {
              $scope.loaded = true;
            });

        })
        $scope.$watch("procedure",function (v,o) {
          if (!v){
            return;
          }
          v.then(function (r) {
            $scope.source.procedureData=r.data;
            if ($scope.source.procedureData.length){
              $scope.setProcedure($scope.source.procedureData[0],$scope.source.procedureData);
            }
          })
        })
      }
    };
  }

  function msGenSelectController($scope, remote, xhscService, $q) {
    $scope.source={};
    $scope.setActive=function (area,siblings) {
      function setChild(t) {
        if (t.Children){
          t.Children.forEach(function (m) {
            m.active=false;
            setChild(m);
          })
        }
        if (t.SpecialtyChildren){
          t.SpecialtyChildren.forEach(function (m) {
            m.active=false;
            setChild(m);
          })
        }
        if (t.WPAcceptanceList){
          t.WPAcceptanceList.forEach(function (m) {
            m.active=false;
            setChild(m);
          })
        }
      }
      siblings.forEach(function (o) {
        o.active=false; //选中背景设置
        setChild(o);
      });
      setChild(area);
      area.active=true;
    }
    //初始化部位
    $scope.setRegion=function (area,build) {
      if ($scope.current){
        $scope.current.selectedArea=null;
        $scope.current.region=null;
      }
      if ($scope.build){
        $scope.source.floors=[];
        $scope.source.rooms=[];
        $scope.setActive(area,$scope.source.parts);
        $scope.source.floors=area.Children;
      }else {
        $scope.source.fq=[];
        $scope.source.parts=[];
        $scope.source.floors=[];
        $scope.source.rooms=[];
        $scope.setActive(area,$scope.source.areasData);
        $scope.source.fq=area.Children;
      }
    }
    $scope.setProcedure=function (procedure,procedureLst) {
      $scope.setActive(procedure,procedureLst);
      $scope.source.wpAcceptanceList=[];
      $scope.source.specialtyChildren=procedure.SpecialtyChildren;
      if ($scope.current){
        $scope.current.procedure=null;
      }
      if ($scope.source.specialtyChildren){
        $scope.source.specialtyChildren.sort(function (a,b) {
          return a.SpecialtyName.localeCompare(b.SpecialtyName);
        });
      }
    }
  }
})();
