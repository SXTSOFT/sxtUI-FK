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
    })




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
