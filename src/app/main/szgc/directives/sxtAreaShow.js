/**
 * Created by emma on 2016/2/25.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtAreaShow',sxtAreaShowDirective);

  /** @ngInject */
  function sxtAreaShowDirective($timeout, api, $state,$rootScope,utils,sxt){
    return {
      scope: {
        projectId: '='
      },
      link: function (scope, element, attrs, ctrl) {
        var p = element.position(), h = $(window).height();
        element.height(h - p.top - 150);
        var map,layer;
        var ran = function () {
          $timeout(function(){


            if (!scope.projectId) return;
            //var crs = ;
            if (map && map.projectId == scope.projectId) return;
            if (map) map.remove();
            var showImgs = function(){
              if(scope.groups){
                $rootScope.$emit('sxtImageView', {
                  groups: scope.groups
                });
              }
            }
            $rootScope.$on('sxtImageViewAll',showImgs)
            api.szgc.ProjectExService.get(scope.projectId).then(function (result) {
              var project = result.data;

              if (project.AreaImage) {
                api.szgc.FilesService.group(project.AreaImage).then(function (fs) {
                  if (fs.data.Files.length == 0) return;
                  map = L.map(element[0], {
                    crs: L.extend({}, L.CRS, {
                      projection: L.Projection.LonLat,
                      transformation: new L.Transformation(1, 0, 1, 0),
                      scale: function (e) {
                        return 512 * Math.pow(2, e);
                      }
                    }),
                    center: [.48531902026005, .5],
                    zoom: 0,
                    minZoom: 0,
                    maxZoom: 3,
                    scrollWheelZoom: true,
                    annotationBar: false,
                    attributionControl: false
                  }),
                    layer = L.tileLayer(sxt.app.api + '/api/picMap/load/{z}_{x}_{y}.png?path='+fs.data.Files[0].Url.replace('/s_', '/'), {
                      noWrap:true,
                      continuousWorld:false,
                      tileSize:512
                    });
                  //console.log('picUrl',scope.picUrl)
                  map.projectId = scope.projectId;
                  layer.addTo(map);

                  var apiLayer = L.GeoJSON.api({
                    get: function (cb) {
                      scope.groups =null;
                      if (project.AreaRemark) {
                        try {
                          var d = JSON.parse(project.AreaRemark);
                          cb(d);
                          if (d.features.length) {
                            var g = [];
                            d.features.forEach(function (f) {
                              if (f.options.gid)
                                g.push(f.options.gid);
                            });
                            if (g.length) {
                              scope.groups = g;
                            }
                          }
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
                      api.szgc.ProjectExService.update(project).then(function () {
                        cb();
                      });
                    },
                    click: function (layer, cb) {
                      if (layer.editing && layer.editing._enabled) return;
                      {
                        if (layer._icon) {
                          if (layer.options.gid) {
                            $rootScope.$emit('sxtImageView', {
                              groups: [layer.options.gid]
                            });
                          }
                          else {
                            utils.alert('此摄像头未上传现场照片')
                          }
                        }
                        else {
                          $state.go('app.szgc.project.buildinglist', { itemId: layer.options.itemId, itemName: layer.options.itemName, projectType: 2 })
                        }
                      }

                    }
                  }).addTo(map);

                });
              };
            });
          },1000);
        }
        scope.$watch('projectId', ran);
        scope.$on('$destroy', function () {
          scope.groups =null;
          //$rootScope.$o
        })
      }
    }
  }
})();
