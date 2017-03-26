/**
 * Created by shaoshunliu on 2017/2/25.
 */
(function ()
{
  'use strict';

  angular
    .module('app.core')
    .factory('cache', cacheService);

  /** @ngInject */
  function cacheService($q, $log, api)
  {
      var defaultOptions={
          timeout:60000
      }

      function  _cache() {
          this.cacheContainer={};
          this.options=defaultOptions;
          this.clearfun=null;
      }

      _cache.prototype.setOption=function (options) {
         if (angular.isObject(options)){
           this.options=angular.extend(this.options,options)
         }
      }

      _cache.prototype.clear=function (key) {
        if (!key){
          this.cacheContainer={};
        }else {
          if (this.cacheContainer.hasOwnProperty(key)){
            this.cacheContainer[key]=null;
          }
        }

      }


      _cache.prototype.getValue=function (key) {
        if (key&&this.cacheContainer.hasOwnProperty(key)){
         return this.cacheContainer[key];
        }
        return null;
      }

      _cache.prototype.setValue=function (key,value) {
          var self=this;
          if (!key){
            return;
          }
          if (this.clearfun){
            clearTimeout(this.clearfun);
          }
          this.clearfun=setTimeout(function () {
            self.clear(key);
          },self.options.timeout);
          self.cacheContainer[key]=value;
      }

      return new  _cache();
  }

})();
