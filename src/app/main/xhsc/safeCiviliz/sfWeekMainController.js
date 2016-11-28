/**
 * Created by shaoshun on 2016/11/28.
 */
/**
 * Created by lss on 2016/10/19.
 */
/**
 * Created by emma on 2016/7/1.
 */
(function () {
  'use strict';

  angular
    .module('app.xhsc')
    .controller('sfWeekMainController', sfWeekMainController);

  /** @ngInject */
  function sfWeekMainController($state) {
    var vm = this;
    console.log($state);
  }
})();
