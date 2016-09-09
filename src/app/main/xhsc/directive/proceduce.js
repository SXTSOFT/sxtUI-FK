/**
 * Created by emma on 2016/3/31.
 */
(function(){
  angular
    .module('app.pcReport')
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
      template:' <div layout="row" ng-click="click()"> <md-input-container md-theme="default" flex> <label>工序</label> <div> <input ng-model="selected" disabled/> <md-button class="md-icon-button md-primary" style="position: absolute;right: -8px;" aria-label="Settings"> <md-icon  md-font-icon="icon-magnify" class="icon s24"></md-icon> </md-button> </div> </md-input-container> </div>'
    }
    function  p_controller(panel,remote,$scope,$q){
       remote.Procedure.queryProcedure().then(function(r){
         $scope.procedures= r.data;
       });
      $scope.click=function(){
        function gxController(){
          var self=this;

          self.acceptanceItem=[];
          self.selectSpecialtyLow=function(item){
            self.acceptanceItem=item.WPAcceptanceList?item.WPAcceptanceList:[];
          }

          self.choosego=function(item){
            $scope.selected=item.AcceptanceItemName;
            panel.close();
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
            self.procedures=result;
          });
        }
        panel.create({
          templateUrl:"/app/main/xhsc/directive/proceduce.html",
          controller:gxController
        })
      }
    }
    function  link(scope,element,attr,ctrl){
    }
  }
})();
