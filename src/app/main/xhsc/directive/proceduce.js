/**
 * Created by emma on 2016/3/31.
 */
(function(){
  angular
    .module('app.xhsc')
    .directive('proceduce',proceduce);

  /** @Inject */
  function proceduce(){
    return {
      restrict:'EA',
      scope:{
        selected:'=',
      },
      controller:p_controller,
      link:link,
      template:' <div layout="row" ng-click="click()"> <md-input-container md-theme="default" flex> <label>工序</label> <div> <input ng-model="gxNames" disabled/> <md-button class="md-icon-button md-primary" style="position: absolute;right: -8px;" aria-label="Settings"> <md-icon  md-font-icon="icon-magnify" class="icon s24"></md-icon> </md-button> </div> </md-input-container> </div>'
    }
    function  p_controller($timeout,remote,$scope,$q,$mdDialog){
       $scope.selected=[];
       remote.Procedure.queryProcedure().then(function(r){
         if (r.data&&angular.isArray(r.data)){
           $scope.procedures= r.data;
         }
       });

      $scope.click=function(){
        function gxController(){
          var self=this;
          self.selected=$scope.selected;
          self.acceptanceItem=[];
          self.remove=function(item){
            $timeout(function(){
              var index=self.selected.indexOf(item);
              if (index>-1){
                $scope.gxNames= self.selected.splice(index,1);
              }
            })
          }
          self.choosego=function(item){
            var p=self.selected.find(function(o){
              return o.AcceptanceItemID==item.AcceptanceItemID;
            });
            if (!p&&!item.checked){
              self.selected.push(item)
            }
            if (p&&item.checked){
              var index=self.selected.indexOf(p);
              self.selected.splice(index,1);
            }
          }
          self.ok=function(){
            var attr=[];
            self.selected.forEach(function(k){
              attr.push(k.AcceptanceItemName);
            });
            $scope.gxNames= attr.join(',');
            $mdDialog.hide();
          }
          self.close=function(){
            //$scope.selected=self.selected=[];
            $mdDialog.cancel();
          }
          self.selectSpecialtyLow=function(item,parent){
              parent.WPAcceptanceList=item.WPAcceptanceList;
          }
          $q(function(resolve,reject){
            if ($scope.procedures){
              resolve($scope.procedures);
            }else {
              remote.Procedure.queryProcedure().then(function(r){
                $scope.procedures= r.data;
                resolve($scope.procedures);
              }).catch(function(r){
                reject(r);
              })
            }
          }).then(function(result){
            var procedures= $.extend(true,{},result)
            self.procedures=procedures;
          });
        }

        $mdDialog.show({
          controller:gxController,
          controllerAs:"ctrl",
          templateUrl:"/app/main/xhsc/directive/proceduce.html",
          parent: angular.element(document.body),
          clickOutsideToClose:true,
          fullscreen: true
        });
      }
    }
    function  link(scope,element,attr,ctrl){
    }
  }
})();
