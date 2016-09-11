/**
 * Created by lss on 2016/9/11.
 */
/**
 * Created by emma on 2016/3/31.
 */
(function(){
  angular
    .module('app.xhsc')
    .directive('sectionFilter',sectionFilter);

  /** @Inject */
  function sectionFilter(){
    return {
      restrict:'EA',
      controllerAs:"vm",
      scope:{
        source:'=',
        gxSelected:"=",
        secSelected:"=",
        level:"="
      },
      controller:p_controller,
      link:link,
      templateUrl:"/app/main/xhsc/directive/sectionFilter.html",
    }
    function  p_controller($timeout,remote,$scope,$q,$mdSidenav){
      var vm = this;
      vm.gxSelected=[];

      vm.removeRegion=function(chip){
        if (chip.index||chip.index===0){
          for (var  i=chip.index;i<vm.ngModel.length;i++){
            vm.ngModel[i]=null;
          }
        }
        for (var i=vm.secSelected.length-1;i>=0;i--)
        {
          if (vm.secSelected[i].RegionID.toString().length>chip.RegionID.toString().length){
            vm.secSelected.splice(i,1);
          }
        }
      }
      vm.secSource=[[],[],[],[],[]];
      vm.ngModel=[null,null,null,null,null]
      vm.secSelected=[]
      if ($scope.source.then){
        $scope.source.then(function(r){
            if (r&& r.data&&angular.isArray( r.data)){
              vm.secSource[0]= r.data;
            }
        })
      }
      if (angular.isArray($scope.source)){
        vm.secSource[0]=$scope.source;
      }
      vm.getChild=function(item){
        $timeout(function(){
          function child(){
            return  remote.Project.GetAreaChildenbyID(item.RegionID);
          }

          switch ((""+item.RegionID).length){
            case 5:
              item.index=0;
              child().then(function(r){
                vm.secSource[1]= r.data;
              });
              break;
            case 10:
              item.index=1;
              child().then(function(r){
                vm.secSource[2]= r.data;
              });
              break;
            case 15:
              item.index=2;
              child().then(function(r){
                vm.secSource[3]= r.data;
              });
              break;
            case 20:
              item.index=3;
              child().then(function(r){
                vm.secSource[4]= r.data;
              });
              break;
            case 25:
              item.index=4;
              child().then(function(r){
                vm.secSource[5]= r.data;
              });
              break;
          }
          vm.secSelected.push(item);
        })
      }

      remote.Procedure.queryProcedure().then(function(r){
        if (r.data&&angular.isArray(r.data)){
          $scope.procedures= r.data;
        }
      });

      $scope.acceptanceItem=[];
      $scope.remove=function(item){
        $timeout(function(){
          var index=$scope.gxSelected.indexOf(item);
          if (index>-1){
           $scope.gxSelected.splice(index,1);
            initGxName();
          }
        })
      }
      $scope.choosego=function(item){
        var p=$scope.gxSelected.find(function(o){
          return o.AcceptanceItemID==item.AcceptanceItemID;
        });
        if (!p&&!item.checked){
          $scope.gxSelected.push(item)
        }
        if (p&&item.checked){
          var index=$scope.gxSelected.indexOf(p);
          $scope.gxSelected.splice(index,1);
        }
        initGxName();
      }
      $scope.ok=function(){
        $mdSidenav("right")
          .toggle();
      }
      $scope.selectSpecialtyLow=function(item,parent){
        parent.WPAcceptanceList=item.WPAcceptanceList;
      }
      $scope.click=function(){
        $mdSidenav("right")
          .toggle()
      }
      function initGxName(){
        var attr=[];
        $scope.gxSelected.forEach(function(k){
          attr.push(k.AcceptanceItemName);
        });
        $scope.gxNames= attr.join(',');
      }
    }
    function  link(scope,element,attr,ctrl){
    }
  }
})();
