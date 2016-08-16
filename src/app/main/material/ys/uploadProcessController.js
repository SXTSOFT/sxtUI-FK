/**
 * Created by jiuyuong on 2016/4/5.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .controller('MuploadProcessController',MuploadProcessController);

  /** @ngInject */
  function MuploadProcessController($scope,$stateParams){
    var vm = this;
    $scope.project = {
      files: []
    }
    $scope.project.pid = $stateParams.idTree;
    $scope.project.bid = $stateParams.idTree.split('>')[1];
    $scope.project.gid = $scope.project.bid + '-' + $stateParams.type;

    $scope.$watch('project.oid', function (a, b) {
      if ($scope.project.oid) {
        $scope.project.fid = $scope.project.pid.replace(/\>/g, '-') + '-' + $scope.project.oid;
        $scope.project.sid = 'sub-'+ $scope.project.pid.replace(/\>/g, '-') + '-' + $scope.project.oid;
      }
    });
  }
})();
