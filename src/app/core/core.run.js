(function ()
{
    'use strict';

    angular
        .module('app.core')
        .run(runBlock);

    /** @ngInject */
    function runBlock(msUtils, fuseGenerator, fuseConfig, $httpBackend, $rootScope, $timeout, $state, auth,$location,$q)
    {
      /**
       * Generate extra classes based on registered themes so we
       * can use same colors with non-angular-material elements
       */
      fuseGenerator.generate();

      /**
       * Disable md-ink-ripple effects on mobile
       * if 'disableMdInkRippleOnMobile' config enabled
       */
      if ( fuseConfig.getConfig('disableMdInkRippleOnMobile') && msUtils.isMobile() )
      {
        var bodyEl = angular.element('body');
        bodyEl.attr('md-no-ink', true);
      }

      /**
       * Put isMobile() to the html as a class
       */
      if ( msUtils.isMobile() )
      {
        angular.element('html').addClass('is-mobile');
      }

      /**
       * Put browser information to the html as a class
       */
      var browserInfo = msUtils.detectBrowser();
      if ( browserInfo )
      {
        var htmlClass = browserInfo.browser + ' ' + browserInfo.version + ' ' + browserInfo.os;
        angular.element('html').addClass(htmlClass);
      }


      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        //console.log('toState',toState,toParams)
        if (toState.auth !== false && !auth.isLoggedIn()) {
          auth.autoLogin().then(function(){
            if(toState.name.indexOf('login')!=-1)
              $timeout(function(){$location.path('/');},100);
            else
              $state.go(toState.name, toParams);
          });
          event.preventDefault ();
        }
        else{
          $rootScope.noBack = toState.noBack;
          $rootScope.sendBt = toState.sendBt;
          $rootScope.subtitle = toState.subtitle;
          $rootScope.leftArrow = toState.leftArrow;
          $rootScope.rightArrow = toState.rightArrow;
          $rootScope.refreshBtn = toState.refreshBtn;
          $rootScope.title = toState.title || $rootScope.title;
        }
        //console.log('toState',toState)
      });

    }
})();
