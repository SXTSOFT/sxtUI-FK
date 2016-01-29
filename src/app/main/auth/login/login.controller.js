(function ()
{
    'use strict';

    angular
        .module('app.auth')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController(auth,$mdToast)
    {

      var vm = this;
        // Data

        // Methods
      vm.login = function(loginForm){
        console.log('login',vm.form)
        auth.login(vm.form).then(function(){

        },function(reject){
          $mdToast.show('用户名或密码错误')
        })
      }
        //////////
    }
})();
