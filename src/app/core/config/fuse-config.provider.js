(function () {
  'use strict';

  angular
    .module('app.core')
    .provider('fuseConfig', fuseConfigProvider);

  /** @ngInject */
  function fuseConfigProvider($provide) {
    // Default configuration
    var fuseConfiguration = {
      'disableCustomScrollbars': false,
      'disableMdInkRippleOnMobile': false,
      'disableCustomScrollbarsOnMobile': true
    };

    var self = this;
    // Methods
    self.config = config;

    function config(configuration) {
      fuseConfiguration = angular.extend({}, fuseConfiguration, configuration);
    }

    self.$get = getService;

    getService.$injector = ['$rootScope'];
    function getService($rootScope) {
      self.$rootScope = $rootScope;
      var service = {
        getConfig: getConfig,
        setConfig: setConfig
      };

      return service;

      //////////

      /**
       * Returns a config value
       */
      function getConfig(configName) {
        if (angular.isUndefined(fuseConfiguration[configName])) {
          return false;
        }

        return fuseConfiguration[configName];
      }

      /**
       * Creates or updates config object
       *
       * @param configName
       * @param configValue
       */
      function setConfig(configName, configValue) {
        fuseConfiguration[configName] = configValue;
      }
    };

    $provide.decorator('$exceptionHandler', extendExceptionHandler);

    extendExceptionHandler.$inject = ['$delegate'];

    function extendExceptionHandler($delegate) {
      return function (exception, cause) {
        //$delegate(exception, cause);
        if(self.$rootScope)
          self.$rootScope.$emit('applicationError', {exception: exception, cause: cause});
      };
    }
  }
})();
