
/**
 * Created by zhangzhaoyong on 16/2/16.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtAreaEdit',sxtAreaEdit);

  /** @ngInject */
  function sxtAreaEdit($timeout,$http,$state,utils,msUtils,$mdDialog){
    return {
      scope:{

      },
      link:link
    }

    function  link(scope,element,attr,ctrl){

      $timeout(function() {
        $http.get ('http://vkde.sxtsoft.com/api/ProjectEx/'+utils.id).then (function (result) {
          var project = result.data || {ProjectId:utils.id};

          var map = L.map (element[0], {
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
              attributionControl: false
            }
          );
          L.tileLayer (
            'http://vkde.sxtsoft.com/api/picMap/load/{z}_{x}_{y}.png?path=/upload/hx.jpg',
            //'http://vkde.sxtsoft.com/upload/hx_tile_{z}_{x}_{y}.png',
            {
              attribution: false
            }).addTo (map);
          var drawnItems = new L.FeatureGroup ();
          map.addLayer (drawnItems);

          var apiLayer = L.GeoJSON.api ({
            get: function (cb) {
              if (project.AreaRemark) {
                try {
                  var d = JSON.parse(project.AreaRemark);
                  cb(d);
                }
                catch (ex) {
                  cb();
                }
              }
              else {
                cb();
              }
            },
            post: function (data, cb) {
              project.AreaRemark = JSON.stringify(data);
              $http.put('http://vkde.sxtsoft.com/api/ProjectEx/'+project.ProjectId,project).then(function () {
                cb();
              });
            },
            click: function (layer, cb) {
              if (layer.editing && layer.editing._enabled) return;
              {
                if (layer._icon) {

                }
                else {
                }
              }

            },
            onAdd: function (layer,cb) {
              if(layer.options.icon){
                layer.options.pid = msUtils.guidGenerator();
                $mdDialog.show({
                  controller: function($scope, $mdDialog) {

                      $scope.hide = function() {
                        $mdDialog.hide();
                      };

                      $scope.cancel = function() {
                        $mdDialog.cancel();
                      };

                      $scope.answer = function(answer) {
                        $mdDialog.hide(answer);
                      };
                    },
                    template: '<md-dialog aria-label="拍照"  ng-cloak><form><md-toolbar><div class="md-toolbar-tools"><h2>拍照</h2></div></md-toolbar>\
                  <md-dialog-content><div class="md-dialog-content" sxt-photo>\
                </div></md-dialog-content>\
                <md-dialog-actions layout="row" ng-click="cancel()">\
                  <md-button >取消</md-button>\
                <span flex></span>\
                <md-button ng-click="photo()"  md-autofocus>\
                    拍照\
                  </md-button>\
                <md-button ng-click="answer(\'useful\')"  style="margin-right:20px;">发送整改通知</md-button>\
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
                return false;
              }
            }
          }).addTo (map);


          var photoMaker = L.Icon.extend ({
            options: {
              shadowUrl: null,
              iconAnchor: [15, 15],
              iconSize: [30, 30],
              iconUrl: 'assets/leaflet/css/images/photo.png'
            }
          });
          var drawControl = new L.Control.Draw ({
            draw: {
              polygon: {
                allowIntersection: false,
                drawError: {
                  color: '#b00b00',
                  timeout: 1000
                },
                shapeOptions: {
                  color: '#ff0000'
                },
                showArea: false
              },
              rectangle: false,
              polyline: false,
              circle: false,
              marker: {
                icon: new photoMaker ()
              }
            },
            edit: {
              edit: true,
              remove: true,
              featureGroup: apiLayer
            }
          });
          map.addControl (drawControl);
        });
      }, 500);
    }
  }


})();
