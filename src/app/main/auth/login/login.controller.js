(function ()
{
    'use strict';

    angular
        .module('app.auth')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController(appAuth,$scope)
    {

      var vm = this;
      console.log(vm,appAuth,$scope);
        // Data

        // Methods
      vm.login = function(loginForm){
        console.log('login',vm.form)
        appAuth.login(vm.form).then(function(){

        },function(reject){
          alert(JSON.stringify(reject));
        })
      }
        //////////
    }
})();
