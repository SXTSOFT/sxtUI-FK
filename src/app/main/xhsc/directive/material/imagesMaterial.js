(function () {
    'use strict';

    angular
        .module('app.xhsc')
        .directive('imagesMaterial', imagesMaterialDirective);

    /** @ngInject */
    function imagesMaterialDirective(api, sxt, $cordovaCamera, $window, $q, $cordovaImagePicker, remote) {
        return {
            restrict: 'E',
            scope: {
                gid: '=',
                type: '@',
                stage: '@',
                edit: '@',
                planId: '=',
                batchId: '=',
                files: '='
            },
            template: '<md-button flex="10" style="margin:6px 0" class="md-secondary" ng-click ="inputChange()"><md-icon md-font-icon="icon-camera" class="icon s40"></md-icon></md-button>',
            link: function (scope, element, attrs, ngModel) {
                var gid;
                gid = scope.gid;
                scope.files = [];
                scope.remove = function ($event, item) {
                    scope.files.splice(scope.files.indexOf(item), 1);
                }
                function onSuccess(newBase64) {
                    var _id = sxt.uuid();
                    var img = {
                        Id: sxt.uuid(),
                        GroupId: scope.gid,
                        BatchId: scope.batchId,
                        OptionType: scope.type,
                        ApproachStage: scope.stage,
                        ImageName: _id + ".jpeg",
                        ImageUrl: _id + ".jpeg",
                        ImageByte: newBase64
                    }
                    scope.files.push(img);
                    remote.offline.create({ Id: img.Id, planId: scope.planId, batchId: scope.batchId, type: scope.type, img: newBase64 });
                }
                scope.inputChange = function () {

                    //var url = 

                    $cordovaCamera.getPicture({
                        quality: 50,
                        destinationType: 0,
                        sourceType: s,
                        allowEdit: false,
                        targetHeight: 600,
                        encodingType: 0,
                        saveToPhotoAlbum: (s === 0 ? false : true),
                        correctOrientation: true
                    }).then(function (base64) {
                        if (base64) {
                            onSuccess('data:image/jpeg;base64,' + base64);
                        }
                    }, function (err) {
                    });

                }

                //   api.szgc.FilesService.group(scope.gid || '').then(function (result) {
                //     var data = result.data;
                //     if (data.Files) {
                //       data.Files.forEach(function (att) {
                //         att.Uploading = undefined;
                //           scope.files.push(att);
                //       });
                //     }
                //   });

            }
        }
    }

})();
