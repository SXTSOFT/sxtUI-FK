/**
 * Created by jiuyuong on 2016/4/5.
 */
(function(){
  'use strict';
  angular
    .module('app.szgc')
    .directive('sxtAreaHouse',sxtAreaHouse);

  /** @ngInject */
  function sxtAreaHouse($timeout,$rootScope,api,sxt,$mdDialog){
    return {
      scope: {
        show:'=',
        files: '=',
        gid: '=',
        upload: '@',
        oid: '=',
        oName:'='
      },
      link: function (scope, element, attrs, ctrl) {
        var map, layer, apiLayer, drawControl;
        L.drawLocal = {
          draw: {
            toolbar: {
              actions: {
                title: '取消',
                text: '取消'
              },
              undo: {
                title: '撤消最后一个点',
                text: '撤消'
              },
              buttons: {
                polyline: '直线',
                polygon: '封闭区域',
                rectangle: '矩形',
                circle: 'Draw a circle',
                marker: '摄像头位置'
              }
            },
            handlers: {
              circle: {
                tooltip: {
                  start: 'Click and drag to draw circle.'
                },
                radius: 'Radius'
              },
              marker: {
                tooltip: {
                  start: '点击这里放置摄像头'
                }
              },
              polygon: {
                tooltip: {
                  start: '点击开始',
                  cont: '点击继续',
                  end: '点击第一点结束.'
                }
              },
              polyline: {
                error: '<strong>Error:</strong> shape edges cannot cross!',
                tooltip: {
                  start: '点击开始画线',
                  cont: '点击继续画线',
                  end: '点击最后一点结束画线'
                }
              },
              rectangle: {
                tooltip: {
                  start: '点击拖拽画矩形.'
                }
              },
              simpleshape: {
                tooltip: {
                  end: '松开鼠标结束'
                }
              }
            }
          },
          edit: {
            toolbar: {
              actions: {
                save: {
                  title: '保存编辑.',
                  text: '保存'
                },
                cancel: {
                  title: '取消编辑，所有改动将取消',
                  text: '取消'
                }
              },
              buttons: {
                edit: '修改.',
                editDisabled: 'No layers to edit.',
                remove: '删除.',
                removeDisabled: 'No layers to delete.'
              }
            },
            handlers: {
              edit: {
                tooltip: {
                  text: '点击方块改变区域.',
                  subtext: '点击取消退出编辑'
                }
              },
              remove: {
                tooltip: {
                  text: '点击物件删除'
                }
              }
            }
          }
        };
        var isMiddleNumber= function(n1,n2,n, f) {
          if(f){ //修正线难被点到的问题
            if(Math.abs(n1-n2)<0.02){
              if(n1>n2)
              {
                n1+=0.01;
                n2-=0.01;
              }
              else{
                n1-=0.01;
                n2+=0.01;
              }
            }
          }
          return n1 > n2 ?
          n1 >= n && n >= n2 :
          n2 >= n && n >= n1;
        }
        var ran = function () {
          if (!scope.show) return;
          //var crs = ;
          if (map && map.gid == scope.gid) return;
          if (map && scope.files && scope.files[0] != map.pic) {
            map.remove ();
            map = null;
          }
          if (!scope.files || !scope.files.length) return;


          api.szgc.ProjectExService.get (scope.gid).then (function (result) {
            var project = result.data;

            if (map)
              map.remove ();
            map = L.map (element[0], {
              crs: L.extend ({}, L.CRS, {
                projection: L.Projection.LonLat,
                transformation: new L.Transformation (1, 0, 1, 0),
                scale: function (e) {
                  return 512 * Math.pow (2, e);
                }
              }),
              center: [.48531902026005, .5],
              zoom: 0,
              minZoom: 0,
              maxZoom: 3,
              scrollWheelZoom: true,
              annotationBar: false,
              zoomControl: false,
              attributionControl: false
            });
            map.pic = scope.files[0];

            //layer = L.tileLayer(sxt.app.api + '/api/file/load?x={x}&y={y}&z={z}', {
            layer = L.tileLayer (sxt.app.api + '/api/picMap/load/{z}_{x}_{y}.png?path=' + scope.files[0].replace ('/s_', '/'), {
              noWrap: true,
              continuousWorld: false,
              tileSize: 512
            });
            map.gid = scope.gid;
            layer.addTo (map);


            apiLayer = L.GeoJSON.api ({
              areaLabel: scope.upload != 'true',
              edit: scope.upload != 'true',
              get: function (cb) {
                if (project && project.AreaRemark) {
                  try {
                    var d = JSON.parse (project.AreaRemark);
                    cb (d);
                  }
                  catch (ex) {
                    cb ();
                  }
                }
                else {
                  cb ();
                }
              },
              post: function (data, cb) {

              },
              contextMenu: function (e, cb) {


              },
              click: function (layer, cb) {

/*                scope.oid = layer.options.itemId;
                scope.oName = layer.options.itemName;
                if (!$rootScope.$$phase) {
                  scope.$apply ();
                }*/

              }
            }).addTo (map);
            map.on ('click', function (e) {
              console.log(e);
              var p = e.latlng,
                eb;
              apiLayer.eachLayer(function (layer) {

                var bounds = layer.getBounds ();
                if (bounds && isMiddleNumber (bounds._southWest.lat, bounds._northEast.lat, p.lat, 1) &&
                  isMiddleNumber (bounds._southWest.lng, bounds._northEast.lng, p.lng, 1)
                ) {
                  eb = layer;
                }
              });

              if(eb){
                scope.oid = eb.options.itemId;
                scope.oName = eb.options.itemName;
                if (!$rootScope.$$phase) {
                  scope.$apply ();
                };
                $mdDialog.show({
                    locals:{
                      options:layer.options
                    },
                    controller: function($scope, $mdDialog,options,$cordovaCamera) {
                      $scope.photo = function ($event) {
                        if ($event) {
                          $event.preventDefault ();
                          $event.stopPropagation ();
                        }
                        $cordovaCamera.getPicture ({
                          quality: 50,
                          destinationType: 0,
                          sourceType: 1,
                          allowEdit: true,
                          encodingType: 0,
                          saveToPhotoAlbum: false,
                          correctOrientation: true
                        }).then (function (imageData) {
                          if (imageData) {
                            //var image = document.createElement ('img');
                            //image.src = "data:image/jpeg;base64," + imageData;
                            //element.append (image);
                            imageData = imageData.replace('data:image/jpeg;base64,','').replace('data:image/png;base64,','')
                            $scope.title = '正在上传图片';
                            $http.post (sxt.app.api+'/api/Files/' + layer.options.pid + '/base64', {Url: imageData}).then (function (result) {
                              $scope.images.push (result.data.Files[0]);
                              $scope.title = null;
                              //utils.alert('上传成功');
                            })
                          }
                        }, function (err) {

                        });
                      }

                      $scope.images = [];
                      $scope.options = options;
                      $scope.hide = function () {
                        $mdDialog.hide ();
                      };

                      $scope.cancel = function () {
                        $mdDialog.cancel ();
                      };

                      $scope.answer = function () {
                        //cb ();
                        $mdDialog.hide ();
                        //$state.go ('app.szgc.tzg', {pid: options.pid})
                      };
                      //$scope.photo ();
                    },
                    template: '<md-dialog aria-label="添加拍照"  ng-cloak><form><md-toolbar ><div class="md-toolbar-tools"><h2>{{title || \'拍照\'}}</h2></div></md-toolbar>\
                  <md-dialog-content><div class="md-dialog-content" >\
                <img width="120" class="cimages" ng-repeat="img in images" ng-src="{{img.Url|fileurl}}" /></div></md-dialog-content>\
                <md-dialog-actions layout="row" style="border-top:solid 2px red">\
                <md-button  class="md-raised" ng-click="photo($event)" >\
                    添加 \
                  </md-button>\
              <span flex></span>\
                <md-button  class="md-raised" ng-click="answer()"  md-autofocus style="margin-right:20px;">确定</md-button>\
                  </md-dialog-actions>\
                  </form>\
                  </md-dialog>',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    fullscreen: true
                  })
                  .then(function(answer) {

                  }, function() {

                  });
              }
            });
          });
        }
        scope.$watch('show', ran);
        scope.$watchCollection('files', ran);
        scope.$watch('gid', ran);
      }
    }
  }
})();
