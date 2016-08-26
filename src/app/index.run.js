(function ()
{
    'use strict';

    angular
        .module('sxt')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $timeout, $state,auth,versionUpdate,$window) {
      // Activate loading indicator
      var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function () {
        $rootScope.loadingProgress = true;
      });

      // De-activate loading indicator
      var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function () {
        $timeout(function () {
          $rootScope.loadingProgress = false;
          $rootScope.$emit('sxt:cancelNetworking');
        });
      });

      // Store state in the root scope for easy access
      $rootScope.state = $state;


      $rootScope.$on('applicationError',function (s,error) {
        //error && error.exception && error.exception.stack()
        var u = auth.current()||{};
        try {
          $.ajax({
            type: "POST",
            url: sxt.app.logger,
            contentType: "application/json",
            data: angular.toJson({
              app: 'vankeSzgc',
              version: versionUpdate.version,
              user: u.RealName + '(' + u.Id + ')',
              url: $window.location.href,
              message: error.exception ? error.exception.stack : JSON.stringify(error),
              type: "error"
            })
          });
        }catch (ex){
          console.log(ex);
        }
      });

      // Cleanup
      $rootScope.$on('$destroy', function () {
        stateChangeStartEvent();
        stateChangeSuccessEvent();
      })

    }
})();
