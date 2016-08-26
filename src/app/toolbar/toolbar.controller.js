(function () {
  'use strict';

  angular
    .module('app.toolbar')
    .controller('ToolbarController', ToolbarController);

  /** @ngInject */
  function ToolbarController($rootScope, $mdSidenav, $mdToast, auth, $state) {
    var vm = this;
    vm.is = isRoute;


    auth.getUser().then(function (user) {
      vm.user = user;
    });
    $rootScope.$on('user:logout', function (user) {
      vm.user = null;
    });
    // Data
    $rootScope.global = {
      search: ''
    };

    vm.bodyEl = angular.element('body');

    // Methods
    vm.toggleSidenav = toggleSidenav;
    vm.logout = logout;
    vm.changeLanguage = changeLanguage;
    vm.setUserStatus = setUserStatus;
    vm.toggleHorizontalMobileMenu = toggleHorizontalMobileMenu;

    //////////

    init();

    /**
     * Initialize
     */
    function init() {

    }

    function isRoute(route) {
      return $state.includes(route);
    }

    /**
     * Toggle sidenav
     *
     * @param sidenavId
     */
    function toggleSidenav(sidenavId) {
      $mdSidenav(sidenavId).toggle();
    }

    /**
     * Sets User Status
     * @param status
     */
    function setUserStatus(status) {
      vm.userStatus = status;
    }

    /**
     * Logout Function
     */
    function logout() {
      auth.logout();
    }

    /**
     * Change Language
     */
    function changeLanguage(lang) {
      vm.selectedLanguage = lang;

    }

    /**
     * Toggle horizontal mobile menu
     */
    function toggleHorizontalMobileMenu() {
      vm.bodyEl.toggleClass('ms-navigation-horizontal-mobile-menu-active');
    }
  }

})();
