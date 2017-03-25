/**
 * Created by khot on 2016/12/18.
 */
(function () {
  'use strict';

  angular
    .module('app.auth')
    .controller('ResetPsdController', ResetPsdController)
    .component('resetPassword', {
      templateUrl: 'app/main/auth/components/reset-password.html',
      controller: ResetPsdController,
      controllerAs: 'vm'
    });

  /**@ngInject*/
  function ResetPsdController($rootScope, $state, $scope, api, utils, auth, $timeout, $mdDialog) {
    var vm = this;

    init();

    vm.sending = false;
    vm.send = function () {
      if (vm.sending) return;
      vm.timing = 60;
      vm.sending = 'S后重新发送';
      api.auth.verificationCode.post({ identitySign: $scope.d.username, type: 'ResetPassword' }).then(function () {
        $timeout(function () {
          updateTime();
        }, 1000);
      });
    }

    function updateTime() {
      vm.timing--;
      if (vm.timing == 0) {
        vm.sending = false;
        vm.timing = 0;
      } else {
        $timeout(function () {
          updateTime();
        }, 1000);
      }
    }

    vm.submit = function () {
      if ($scope.d.newPassword.length < 6) {
        vm.resetError = '*新密码不少于6位字符';
        return;
      }
      if ($scope.d.newPassword !== $scope.d.passwordConfirm) {
        vm.resetError = '*两次输入的密码不一致';
        return;
      }
      api.auth.user.reset({
        emailAddressOrMobileNo: $scope.d.username,
        oldPassword: $scope.d.oldPassword,
        newPassword: $scope.d.newPassword
      }).then(function (r) {
        vm.resetError = '';
        console.log(r);
        if (r.data != "") {
          $mdDialog.show(
            $mdDialog.alert()
              .textContent('原密码错误')
              .ok('确认')
          );
        } else {
          $mdDialog.show(
            $mdDialog.alert()
              .textContent('修改密码成功')
              .ok('确认')
          );
           $scope.d.oldPassword = '';
           $scope.d.newPassword = '';
           $scope.d.passwordConfirm = '';
        }

      }, function (reject) {
        console.log(reject);
      })
    }

    function init() {
      auth.getUser().then(function (r) {
        console.log('获取用户信息', r.data);
        $scope.d = {
          username: r.data.displayName
        }
      })
    }
  }
})();
