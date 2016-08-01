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
        //console.log('login',vm.form)
       // vm.form = {id: 1, RealName: "v-zhangqy03", Token: "429ad0b0d7ab966180cc4718324c50ddf176d099", Username: "v-zhangqy03"}
        auth.login(vm.form).then(function(){
          //utils.tips('登录成功');
        },function(reject){
          utils.tips('用户名或密码错误')
        })
      }
      

      //////////
    }
})();
