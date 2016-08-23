(function ()
{
    'use strict';

    angular
        .module('app.sample', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msNavigationServiceProvider,apiProvider)
    {
      // State
      $stateProvider
          .state('app.sample', {
              url    : '/sample',
              views  : {
                  'content@app': {
                      templateUrl: 'app/main/sample/sample.html',
                      controller : 'SampleController as vm'
                  }
              },
              resolve: {
                  SampleData: function (apiResolver)
                  {
                      return apiResolver.resolve('sample@get');
                  }
              }
          });


      //// Navigation
      //msNavigationServiceProvider.saveItem('fuse', {
      //    title : 'SAMPLE',
      //    group : true,
      //    weight: 1
      //});
      //
      //msNavigationServiceProvider.saveItem('fuse.sample', {
      //    title    : 'Sample',
      //    icon     : 'icon-tile-four',
      //    state    : 'app.sample',
      //    /*stateParams: {
      //        'param1': 'page'
      //     },*/
      //    translate: 'SAMPLE.SAMPLE_NAV',
      //    weight   : 1
      //});

      var $http = apiProvider.$http;
      apiProvider.register('sample',$http.resource('app/data/sample/sample.json'));

    }
})();
