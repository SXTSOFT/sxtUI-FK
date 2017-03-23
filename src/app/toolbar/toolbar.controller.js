(function ()
{
    'use strict';

    angular
        .module('app.toolbar')
        .controller('ToolbarController', ToolbarController);

    /** @ngInject */
    function ToolbarController($rootScope, xhscService,$mdSidenav, $translate, $mdToast, auth, $state,sxtlocaStorage,$mdDialog,remote,$http)
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

        vm.back=function () {
          $rootScope.$emit("back")
        }

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
        vm.resetPassword = resetPassword;

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
      function resetPassword(ev, item) {
      $mdDialog.show({
        controller: resetPasswordController,
        templateUrl: 'app/main/auth/components/reset-password.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        locals: {
          model: angular.copy(item)
        },
        clickOutsideToClose: false
      }).then(function () {
      }, function () {
      });
    };
    function resetPasswordController($rootScope, $state, $scope, api, utils, auth, $timeout, $mdDialog,remote,$q,$http) {
      var vm = this;
      init();

      $scope.sending = false;
      $scope.send = function () {
        if ($scope.sending) return;
        $scope.timing = 60;
        $scope.sending = 'S后重新发送';
        api.auth.verificationCode.post({ identitySign: $scope.d.LoginID, type: 'ResetPassword' }).then(function () {
          $timeout(function () {
            updateTime();
          }, 1000);
        });
      }

      function updateTime() {
        $scope.timing--;
        if ($scope.timing == 0) {
          $scope.sending = false;
          $scope.timing = 0;
        } else {
          $timeout(function () {
            updateTime();
          }, 1000);
        }
      }

      $scope.submit = function () {
        if ($scope.d.NewPassword.length < 6) {
          $scope.resetError = '*新密码不少于6位字符';
          return;
        }

        if ($scope.d.NewPassword !== $scope.d.passwordConfirm) {
          $scope.resetError = '*两次输入的密码不一致';
          return;
        }
        // auth.reset({
        //   LoginID: $scope.d.username,
        //   CurrentPassword: $scope.d.oldPassword,
        //   NewPassword: $scope.d.newPassword,
        //   IsSaveButtonClick:true
        // }).then(function (r) {
        //   $mdDialog.cancel();
        //   $rootScope.$emit('user:needlogin');
        // }, function (reject) {
        //   $scope.resetError = '*原密码不正确';
        // })
        $http({
        method  : 'POST',
        url     : 'http://emp.chngalaxy.com:9090/Api/User/ChangePassword',
        data    : $.param($scope.d),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
      }).then(function (r) {
          $scope.resetTrue = '修改成功,即将跳转到登录页';
          setTimeout(function(){
            $mdDialog.cancel(),
            $rootScope.$emit('user:needlogin')
          },3000)
        }, function (reject) {
          $scope.resetError = '*原密码不正确';
        })
      }

     function init() {
      var pro=[
          remote.profile()
        ];
        $q.all(pro).then(function(r){
          console.log(r)
          var role=r[0];
          if (role&&role.data&&role.data){
                      $scope.d = {
              LoginID:role.data.UserName,
              IsSaveButtonClick:true,
              IsSaveCloseButtonClick:null,
              IsEdit:true
            }
          }
        });
      }

      $scope.cancel = function () {
        $mdDialog.cancel();
      };
    }
    }

})();
