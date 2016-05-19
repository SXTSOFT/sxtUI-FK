/**
 * Created by emma on 2016/4/29.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('evaluatelistController',evaluatelistController);

  /** @ngInject*/
  function evaluatelistController($mdDialog,$rootScope,$scope,utils,$stateParams,db){
    var vm = this;
    var params={
        AssessmentID:$stateParams.AssessmentID,
        RegionID:$stateParams.RegionID
    }

    var pk = db('xcpk');
    pk.get('xcpk').then(function (pk) {
      var item = pk.rows.find(function (it) {
        return it.AssessmentID == params.AssessmentID;
      });
      vm.Assessment=item;
      vm.levels = getEvels(item,0);
    });
    vm.getWidth = function (level) {
      if(level==1){
        return 25.0/vm.levels;
      }
      else{
        return 25.0/vm.levels /(1 - vm.getWith(level-1));
      }
    }

    function getEvels(item,level) {
      item.level = level+1;
      if(item.AssessmentClassifys && item.AssessmentClassifys.length){
        var levels = [],max=0;
        item.AssessmentClassifys.forEach(function (item) {
          levels.push(getEvels(item,level));
        });
        levels.forEach(function (l) {
            if(max<l)
              max = l;
        });
        return max;
      }
      return level+1;
    }




    vm.images = [
      {url:'assets/images/etc/plug.png'},
      {url:'assets/images/etc/fallout.jpg'},
      {url:'assets/images/etc/fallout.jpg'}
    ];
    var deleteFn = function(d,data){
      //vm.images.splice(data,1);
      $scope.$apply();
     // console.log('a',vm.images)
    }
    $rootScope.$on('delete',deleteFn);
    vm.getRecord = function(ev){
    $mdDialog.show({
        controller: DialogController,
        templateUrl:'app/main/xhsc/ys/evaluateQues.html',
        //templateUrl: 'app/main/xhsc/ys/evaluateRecord.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      })
    }
    vm.showDialog = function(ev){
      $mdDialog.show({
          controller: DialogController,
          templateUrl: 'app/main/xhsc/ys/evaluateinput.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        })
        .then(function(answer) {
          vm.evaluateNote = answer;
        });
    }
    function DialogController($scope, $mdDialog) {
      $scope.evaluateNote = vm.evaluateNote;
      $scope.answer = function(answer,ev) {
        utils.confirm('前往拍照或返回',ev,'拍照','').then(function(){
          console.log('a')
          vm.input = answer;
        },function(){
          vm.input = answer;
          //vm.images.push({url:'app/main/xhsc/images/text.png'})
        })
      };
    }
  }
})();
