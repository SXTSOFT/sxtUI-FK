/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('HomeController',HomeController);

  /** @ngInject */
  function HomeController($scope, $timeout, $mdBottomSheet, $mdToast){
  //  $scope.alert = '';
  //  $scope.showListBottomSheet = function() {
  //    $scope.alert = '';
  //    $mdBottomSheet.show({
  //      templateUrl: 'bottom-sheet-list-template.html',
  //      controller: 'ListBottomSheetCtrl'
  //    }).then(function(clickedItem) {
  //      $scope.alert = clickedItem['name'] + ' clicked!';
  //    });
  //  };
    var imagePath = 'img/list/60.jpeg';
    $scope.messages = [{
      face : imagePath,
      what: 'Brunch this weekend?',
      who: 'Min Li Chan',
      when: '3:08PM',
      notes: " I'll be in your neighborhood doing errands"
    }, {
      face : imagePath,
      what: 'Brunch this weekend?',
      who: 'Min Li Chan',
      when: '3:08PM',
      notes: " I'll be in your neighborhood doing errands"
    }, {
      face : imagePath,
      what: 'Brunch this weekend?',
      who: 'Min Li Chan',
      when: '3:08PM',
      notes: " I'll be in your neighborhood doing errands"
    }, {
      face : imagePath,
      what: 'Brunch this weekend?',
      who: 'Min Li Chan',
      when: '3:08PM',
      notes: " I'll be in your neighborhood doing errands"
    }, {
      face : imagePath,
      what: 'Brunch this weekend?',
      who: 'Min Li Chan',
      when: '3:08PM',
      notes: " I'll be in your neighborhood doing errands"
    }];


}



})();
