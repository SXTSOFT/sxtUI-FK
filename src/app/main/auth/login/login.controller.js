(function ()
{
    'use strict';

    angular
        .module('app.auth')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController(auth,utils,appCookie,versionUpdate)
    {

      var vm = this;
        // Data

        // Methods
      console.log(versionUpdate.aa());


      vm.login = function(loginForm){

        if(!vm.form || !vm.form.username || !vm.form.password){
          utils.tips('请输入您的用户名和密码');
        }
        else {
          vm.logining = '正在登录';
          auth.login (vm.form).then (function () {
            if(vm.show) {
              utils.tips ('登录成功');
            }
            vm.logining = null;
          }, function (reject) {
            utils.tips ('用户名或密码错误');
            vm.logining = null;
            vm.show = true;
          })
        }
      }

      var authObj = appCookie.get('auth');

      if(authObj) {
        authObj = JSON.parse (authObj);
        vm.form = authObj;
        vm.login();
      }
      else{
        vm.show=true;
      }


        //////////
    }
})();
