(function ()
{
  'use strict';

  angular
    .module('app.auth')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $timeout, $state, appAuth,$location)
  {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      if (toState.auth !== false && !appAuth.isLoggedIn()) {
        appAuth.getUser(true).then(function(){
          if(toState.name.indexOf('login')!=-1)
            $location.path('/');
          else
            $state.go(toState.name, toParams);
        });
        event.preventDefault ();
      }
    });
  }
})();
