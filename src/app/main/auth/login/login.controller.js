(function ()
{
    'use strict';

    angular
        .module('app.auth')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController(auth,utils)
    {

      var vm = this;
        // Data

        // Methods
      vm.login = function(loginForm){
        console.log('login',vm.form);
        if(!vm.form.username || !vm.form.password){
          utils.tips('请输入用户名密码');
        }
        else {
          auth.login (vm.form).then (function () {
            utils.tips ('登录成功');
          }, function (reject) {
            utils.tips ('用户名或密码错误')
          })
        }
      }
        //////////
    }
})();
