/**
 * Created by lss on 2016/10/20.
 */
/**
 * Created by emma on 2016/6/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('pcenter_mainController',pcenter_mainController);

  /**@ngInject*/
  function pcenter_mainController($scope,xhscService,$mdDialog,db,auth,$rootScope,api,utils,$q,remote,versionUpdate,$state,$timeout,$mdBottomSheet){
    var vm = this;
    vm.projects=[];
    api.setNetwork(0).then(function () {
      var arr=[
        remote.profile(),
        remote.Project.getAllRegionWithRight_no_db("", 1)
      ];
      $q.all(arr).then(function (res) {
        var r=res[0];
        if (r.data && r.data.Role) {
          vm.role = r.data.Role.MemberType === 0 || r.data.Role.MemberType ? r.data.Role.MemberType : -100;
          vm.OUType=r.data.Role.OUType===0||r.data.Role.OUType?r.data.Role.OUType:-100;
        }
        var k=res[1];
        if (k&&k.data){
          vm.projects=k.data;
        }
      }).catch(function () {
        vm.show=true;
        utils.alert("当前网络异常！");
      });


      vm.serverAppVersion = versionUpdate.version;
      // versionUpdate.check().then(function () {
      //   vm.serverAppVersion = versionUpdate.version;
      // });

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
                window.localStorage.removeItem("dbs");
                utils.alert('清除成功');
              });
            return;
          }
          xhscService.clear_Root_uglyVal();
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
                window.localStorage.clear();
                auth.logout();
              }, function() {

              });
            return;
          }
          vm.trueClear(['v_profile']);
          api.xhsc.logout();
        });
      }
      //消息中心
      vm.scStandar=function(){
        if (!vm.projects.length){
          utils.alert("正在加载您的项目信息，请稍等片刻。。。");
          return;
        }
        if (vm.projects.length>1){
          $mdDialog.show({
            controller: ['$scope','utils','$mdDialog',function ($scope,utils,$mdDialog) {
              $scope.projects=vm.projects;
              $scope.go=function (item) {
                $state.go("app.xhsc.standarRegion",{projectID:item.RegionID});
                $mdDialog.hide();
              }
            }],
            templateUrl:"app/main/xhsc/center/projectlst.html" ,
            parent: angular.element(document.body),
            clickOutsideToClose:true,
            fullscreen: false
          });

        }else {
          $state.go("app.xhsc.standarRegion",{projectID:vm.projects[0].RegionID});
        }
      }
    })
    function resetPassword(ev, item) {
      $mdDialog.show({
        controller: resetPasswordController,
        templateUrl: 'app/main/auth/components/reset-password.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        locals: {
          model: angular.copy(item)
        },
        clickOutsideToClose: false
      }).then(function () {
      }, function () {
      });
    };
    function resetPasswordController($rootScope, $state, $scope, api, utils, auth, $timeout, $mdDialog,remote,$q,$http) {
      var vm = this;
      init();

      $scope.sending = false;
      $scope.send = function () {
        if ($scope.sending) return;
        $scope.timing = 60;
        $scope.sending = 'S后重新发送';
        api.auth.verificationCode.post({ identitySign: $scope.d.LoginID, type: 'ResetPassword' }).then(function () {
          $timeout(function () {
            updateTime();
          }, 1000);
        });
      }

      function updateTime() {
        $scope.timing--;
        if ($scope.timing == 0) {
          $scope.sending = false;
          $scope.timing = 0;
        } else {
          $timeout(function () {
            updateTime();
          }, 1000);
        }
      }

      $scope.submit = function () {
        if ($scope.d.NewPassword.length < 6) {
          $scope.resetError = '*新密码不少于6位字符';
          return;
        }

        if ($scope.d.NewPassword !== $scope.d.passwordConfirm) {
          $scope.resetError = '*两次输入的密码不一致';
          return;
        }
        // auth.reset({
        //   LoginID: $scope.d.username,
        //   CurrentPassword: $scope.d.oldPassword,
        //   NewPassword: $scope.d.newPassword,
        //   IsSaveButtonClick:true
        // }).then(function (r) {
        //   $mdDialog.cancel();
        //   $rootScope.$emit('user:needlogin');
        // }, function (reject) {
        //   $scope.resetError = '*原密码不正确';
        // })
        $http({
        method  : 'POST',
        url     : 'http://emp.chngalaxy.com:9090/Api/User/ChangePassword',
        data    : $.param($scope.d),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
      }).then(function (r) {
        console.log(r)
        if(r.data.ErrorMessage=="密码验证失败"){
          $scope.resetError = '*原密码不正确';
        }else if(r.data.ErrorMessage=="修改密码成功"){
          $scope.resetTrue = '修改成功,即将跳转到登录页';
          setTimeout(function(){
            $mdDialog.cancel(),
            $rootScope.$emit('user:needlogin')
          },3000)
        }
        })
      }

     function init() {
      var pro=[
          remote.profile()
        ];
        $q.all(pro).then(function(r){
          console.log(r)
          var role=r[0];
          if (role&&role.data&&role.data){
                      $scope.d = {
              LoginID:role.data.UserName,
              IsSaveButtonClick:true,
              IsSaveCloseButtonClick:null,
              IsEdit:true
            }
          }
        });
      }

      $scope.cancel = function () {
        $mdDialog.cancel();
      };
    }
  }
})();
