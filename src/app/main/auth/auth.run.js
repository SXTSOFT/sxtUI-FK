(function ()
{
  'use strict';

  angular
    .module('app.auth')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $timeout, $state, auth,$location)
  {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      if (toState.auth !== false && !auth.isLoggedIn()) {
        auth.getUser(true).then(function(){
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
