(function ()
{
    'use strict';

    angular
        .module('app.toolbar')
        .controller('ToolbarController', ToolbarController);

    /** @ngInject */
    function ToolbarController($rootScope, xhscService,$mdSidenav, $translate, $mdToast, auth, $state,sxtlocaStorage)
    {
        var vm = this;
        vm.is = isRoute;
      $rootScope.toggle = false;
      vm.role='';
      vm.OUType='';
      xhscService.getProfile().then(function(profile){
        vm.role=profile.role;
        vm.OUType=profile.ouType;
        vm.user=profile.user;
      });

      // remote.profile().then(function(r){
      //      if (r.data&& r.data.Role){
      //        vm.user=r.data;
      //        vm.role= r.data.Role.MemberType===0||r.data.Role.MemberType?r.data.Role.MemberType:-100;
      //        vm.OUType=r.data.Role.OUType===0||r.data.Role.OUType?r.data.Role.OUType:-100;
      //      }
      //   });

        // auth.getUser().then(function(user){
        //   vm.user = user;
        // });
        $rootScope.$on('user:logout',function(user){
          vm.user = null;
          sxtlocaStorage.setObj("profile", null)
        });
        // Data
        $rootScope.global = {
            search: ''
        };
      $rootScope.toLeft = function(){
          $rootScope.$emit('leftEvent');
        }
      $rootScope.toRight = function(){
          $rootScope.$emit('rightEvent');
        }
      $rootScope.toggleRight = function(){
          $rootScope.$emit('toggleRightEvent');
      }
        vm.bodyEl = angular.element('body');
        vm.userStatusOptions = [
            {
                'title': '在线',
                'icon' : 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': '忙碌',
                'icon' : 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': '请勿打扰',
                'icon' : 'icon-minus-circle',
                'color': '#F44336'
            },
            {
                'title': '隐身',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#BDBDBD'
            },
            {
                'title': '离线',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];
        vm.languages = {
            en: {
                'title'      : 'English',
                'translation': 'TOOLBAR.ENGLISH',
                'code'       : 'en',
                'flag'       : 'us'
            },
            cn: {
                'title'      : '中文',
                'translation': 'TOOLBAR.SPANISH',
                'code'       : 'cn',
                'flag'       : 'cn'
            }
        };

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
        function init()
        {
            // Select the first status as a default
            vm.userStatus = vm.userStatusOptions[0];

            // Get the selected language directly from angular-translate module setting
            vm.selectedLanguage = vm.languages[$translate.preferredLanguage()];
        }

        function isRoute(route){
           return $state.includes(route);
        }

        vm.active_selected=function(route){
          vm.current_active=route;
        }
        vm.current_active="app.xhsc.home";





        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }

        /**
         * Sets User Status
         * @param status
         */
        function setUserStatus(status)
        {
            vm.userStatus = status;
        }

        /**
         * Logout Function
         */
        function logout()
        {
            auth.logout();
        }

        /**
         * Change Language
         */
        function changeLanguage(lang)
        {
            vm.selectedLanguage = lang;

            /**
             * Show temporary message if user selects a language other than English
             *
             * angular-translate module will try to load language specific json files
             * as soon as you change the language. And because we don't have them, there
             * will be a lot of errors in the page potentially breaking couple functions
             * of the template.
             *
             * To prevent that from happening, we added a simple "return;" statement at the
             * end of this if block. If you have all the translation files, remove this if
             * block and the translations should work without any problems.
             */
            //if ( lang.code !== 'en' )
            //{
            //    var message = 'Fuse supports translations through angular-translate module, but currently we do not have any translations other than English language. If you want to help us, send us a message through ThemeForest profile page.';
            //
            //    $mdToast.show({
            //        template : '<md-toast id="language-message" layout="column" layout-align="center start"><div class="md-toast-content">' + message + '</div></md-toast>',
            //        hideDelay: 7000,
            //        position : 'top right',
            //        parent   : '#content'
            //    });
            //
            //    return;
            //}

            // Change the language
            $translate.use(lang.code);
        }

        /**
         * Toggle horizontal mobile menu
         */
        function toggleHorizontalMobileMenu()
        {
            vm.bodyEl.toggleClass('ms-navigation-horizontal-mobile-menu-active');
        }
    }

})();
