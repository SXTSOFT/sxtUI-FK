/**
 * Created by emma on 2016/6/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('pcenterController',pcenterController);

  /**@ngInject*/
  function pcenterController($scope,$mdDialog,db,auth,$rootScope,api,utils,$q,remote,versionUpdate,$state,$timeout ){
    var vm = this;

    vm.serverAppVersion = versionUpdate.version;
    var pro=[
      remote.profile()
    ];
    $q.all(pro).then(function(r){
      var role=r[0];
      vm.user={};
      vm.u={};
      if (role&&role.data&&role.data){
          vm.user.name= role.data.Name,
          vm.user.userName= role.data.UserName
          switch (role.data.Role.MemberType){
            case 0:
              vm.user.role='总包';
                  break
            case 2:
              vm.user.role='监理';
                  break;
            case 4:
              vm.user.role="项目部";
          }
      }
    });

    vm.goMsg=function(){
      $state.go("app.xhsc.mcenter");
    }

    $rootScope.$on('sxt:online', function(event, state){
      vm.networkState = api.getNetwork();
    });
    $rootScope.$on('sxt:offline', function(event, state){
      vm.networkState = api.getNetwork();
    });
    vm.networkState = api.getNetwork();
    $scope.$watch(function () {
      return vm.networkState
    },function () {
      api.setNetwork(vm.networkState);
    });

    vm.clearCache=function(){
      utils.confirm('确定清除所有缓存数据吗?').then(function (result) {
        vm.trueClear = function (exclude) {
          $mdDialog.show({
              controller: ['$scope','utils','$mdDialog',function ($scope,utils,$mdDialog) {
                api.clearDb(function (persent) {
                  $scope.cacheInfo = parseInt(persent * 100) + '%';
                }, function () {
                  $scope.cacheInfo = null;
                  //$rootScope.$emit('clearDbSuccess');
                  $mdDialog.hide();
                  //utils.alert('清除成功');
                }, function () {
                  $scope.cacheInfo = null;
                  $mdDialog.cancel();
                  utils.alert('清除失败');

                }, {
                  exclude: exclude,
                  timeout: 3000
                })
              }],
              template: '<md-dialog aria-label="正在清除"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate"></md-progress-circular> 正在清除数据，请稍候……({{cacheInfo}})</md-dialog-content></md-dialog>',
              parent: angular.element(document.body),
              clickOutsideToClose:false,
              fullscreen: false
            })
            .then(function(answer) {
            }, function() {
              utils.alert('清除成功');
            });
          return;
        }
        vm.trueClear(['v_profile']);
      });
    }


    vm.logout = function(){
      utils.confirm('确定清除所有缓存数据吗?').then(function (result) {
        vm.trueClear = function (exclude) {
          $mdDialog.show({
              controller: ['$scope','utils','$mdDialog',function ($scope,utils,$mdDialog) {
                api.clearDb(function (persent) {
                  $scope.cacheInfo = parseInt(persent * 100) + '%';
                }, function () {
                  $scope.cacheInfo = null;
                  //$rootScope.$emit('clearDbSuccess');
                  $mdDialog.hide();
                  //utils.alert('清除成功');
                }, function () {
                  $scope.cacheInfo = null;
                  $mdDialog.cancel();
                  utils.alert('清除失败');

                }, {
                  exclude: exclude,
                  timeout: 3000
                })
              }],
              template: '<md-dialog aria-label="正在清除"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate"></md-progress-circular> 正在清除数据，请稍候……({{cacheInfo}})</md-dialog-content></md-dialog>',
              parent: angular.element(document.body),
              clickOutsideToClose:false,
              fullscreen: false
            })
            .then(function(answer) {
              auth.logout();
            }, function() {

            });
          return;
        }
        vm.trueClear(['v_profile']);
      });
    }

    //消息中心
    function reloadMessage() {
      remote.message.messageList(0, 0).then(function (result) {
        vm.messages = [];
        result.data.Items.forEach(function (item) {
          vm.messages.push({
            id: sxt.uuid(),
            name: '系统',
            time: item.SendTime,
            title: item.Title,
            description: item.Content
          });
        })

        function DynamicItems() {
          /**
           * @type {!Object<?Array>} Data pages, keyed by page number (0-index).
           */
          this.loadedPages = {};

          /** @type {number} Total number of items. */
          this.numItems = 0;

          /** @const {number} Number of items to fetch per request. */
          this.PAGE_SIZE = 10;

          this.fetchNumItems_();
        };
        // Required.
        DynamicItems.prototype.getItemAtIndex = function(index) {
          var pageNumber = Math.floor(index / this.PAGE_SIZE);
          var page = this.loadedPages[pageNumber];

          if (page) {
            return page[index % this.PAGE_SIZE];
          } else if (page !== null) {
            this.fetchPage_(pageNumber);
          }
        };
        // Required.
        DynamicItems.prototype.getLength = function() {
          return this.numItems;
        };

        DynamicItems.prototype.fetchPage_ = function(pageNumber) {
          // Set the page to null so we know it is already being fetched.
          this.loadedPages[pageNumber] = null;

          // For demo purposes, we simulate loading more items with a timed
          // promise. In real code, this function would likely contain an
          // $http request.
          $timeout(angular.noop, 300).then(angular.bind(this, function() {
            this.loadedPages[pageNumber] = [];
            var pageOffset = pageNumber * this.PAGE_SIZE;
            for (var i = pageOffset; i < pageOffset + this.PAGE_SIZE; i++) {
              if (vm.messages[i]){
                this.loadedPages[pageNumber].push(vm.messages[i]);
              }
            }
          }));
        };

        DynamicItems.prototype.fetchNumItems_ = function() {
          $timeout(angular.noop, 300).then(angular.bind(this, function() {
            this.numItems = vm.messages.length;
          }));
        };
        vm.dynamicItems = new DynamicItems();

      })
    }

    reloadMessage();
    var onMessage = $rootScope.$on('receiveMessage',function(){
      reloadMessage();
    })
    $scope.$on('destroy',function(){
      onMessage();
    })
    vm.messages&&vm.messages.forEach(function(t){
      t.checked = false;
    })
    $scope.$watch('vm.msgList',function(){
      var i=0;
      vm.messages&&vm.messages.forEach(function(t){
        console.log(t.checked)
        if(t.checked){
          i++;
        }
      })
      if(i){
        vm.showSend = true;
      }else{
        vm.showSend  = false;
      }
    },true)
    function operateMsg(ev){

      utils.confirm('确认全部删除?',ev,'','').then(function(){
        remote.message.deleteAllMessage().then(function () {
          vm.messages = [];
        })
      })
    }
    var event=   $rootScope.$on('operateMsg',operateMsg);
    $scope.$on("$destroy",function(){
      //$mdDialog
      event();
      event=null;
    });
  }
})();
