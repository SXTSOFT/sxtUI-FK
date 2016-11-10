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
        var map,layer,dlg;

        var ran = function () {
          $timeout(function(){
            if (!scope.projectId) return;
            //var crs = ;
            var temp=[];
            if (map && map.projectId == scope.projectId) return;
            if (map) map.remove();
            var showImgs = function(d,data){
             // console.log('load',data)
              if(!data.data) return;
              if(data.data){
                data.data = false;
                var load = false;
              }
              if(load) return;
              if(!load){
                load = true;
                newFn(load);
              }
            }
            var newFn = function(load){
                if(load){
                 // console.log('temp',$rootScope.temp)
                  if($rootScope.temp){
                    $rootScope.$emit('sxtImageView', {
                      groups: $rootScope.temp
                    });
                  }
                  else{
                    if(!dlg){
                      dlg = utils.alert('暂未上传照片').then(function(){dlg=null;})
                    }
                  }
                }
            }

            $rootScope.$on('sxtImageViewAll',showImgs);

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
                        return 256 * Math.pow(2, e);
                      }
                    }),
                    center: [.48531902026005, .5],
                    zoom: 1,
                    minZoom: 0,
                    maxZoom: 3,
                    scrollWheelZoom: true,
                    annotationBar: false,
                    attributionControl: false
                  }),
                    layer = L.tileLayer(sxt.app.api + '/api/picMap/load/{z}_{x}_{y}.png?size=256&path=' + fs.data.Files[0].Url.replace('/s_', '/'), {
                      noWrap: true,
                      continuousWorld: false,
                      tileSize: 256
                    });
                  //console.log('picUrl',scope.picUrl)
                  map.projectId = scope.projectId;
                  layer.addTo(map);

                  var apiLayer = L.GeoJSON.api({
                    get: function (cb) {
                      scope.groups = null;
                      if (project.AreaRemark) {
                        try {
                          var d = JSON.parse(project.AreaRemark);
                          cb(d);
                          if (d.features.length) {
                            var g = [];
                            d.features.forEach(function (f) {
                              if (f.options.gid && g.find(function (a) {
                                  return a == f.options.gid;
                                }) == null) {
                                g.push(f.options.gid);
                              }
                              if (f.options.icon && f.options.icon.options && f.options.icon.options.iconUrl) {
                                f.options.icon.options.iconUrl = f.options.icon.options.iconUrl.replace('/dp/libs/', 'assets/')
                              }
                            });
                            if (g.length) {
                              scope.groups = g;
                            }
                            scope.$watch('scope.groups', function () {
                              //console.log('change',scope.groups)
                              $rootScope.temp = scope.groups;
                            })
                          }
                        }
                        catch (ex) {
                          cb();
                        }
                      }
                      else {
                        cb();
                      }
                      var cImg = new Image();
                      cImg.onload = function () {
                        var w = this.width,
                          h = this.height;
                        var x, y;
                        if (w > h) {
                          x = 0.5;
                          y = h / w * 0.5;
                        }
                        else {
                          y = 0.5;
                          x = w / h * 0.5;
                        }
                        map.setView([y, x]);
                      };
                      cImg.src = sxt.app.api + '/api/Files/thumb/250?path=' + fs.data.Files[0].Url.replace('/s_', '/');
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
                          var el, conents = [];
                          conents.push('<div>'+(layer.options.itemName||'')+'<br /><button class="md-button md-raised ld" style="margin: 4px 2px 4px -4px;width:44px;min-width: 44px;">主体</button>');
                          conents.push('<button class="md-button md-raised yj" style="margin: 4px -4px 4px 2px;width:44px;min-width: 44px;" disabled>园建</button> &nbsp;');
                          conents.push('<button class="md-button md-raised zj" style="margin: 4px -4px 4px 2px;width:44px;min-width: 44px;" disabled>桩基</button></div>');
                          el = $(conents.join(''));
                          api.szgc.vanke.yj(layer.options.itemId).then(function (r) {
                            layer.options.yj = r.data.Rows.find(function (it) { return it.RegionType == 128; });
                            layer.options.zj = r.data.Rows.find(function (it) { return it.RegionType == 256; });
                            if(layer.options.yj){
                              el.find('.yj').prop('disabled',false);
                            }
                            if(layer.options.zj){
                              el.find('.zj').prop('disabled',false);
                            }
                          });
                          var popup = L.popup()
                            .setLatLng(layer.getBounds().getCenter())
                            .setContent(el[0])
                            .openOn(map);
                          el.on('click', '.ld', function () {
                            $state.go('app.szgc.project.buildinglist', {
                              itemId: layer.options.itemId,
                              itemName: layer.options.itemName,
                              projectType: 2
                            })
                          });
                          el.on('click', '.yj', function () {
                            $state.go('app.szgc.project.yj', {
                              itemId: scope.projectId+'>'+ layer.options.itemId+'>'+layer.options.yj.Id,
                              itemName: layer.options.itemName,
                              projectType: 2
                            })
                          });
                          el.on('click', '.zj', function () {
                            $state.go('app.szgc.project.zj', {
                              itemId: scope.projectId+'>'+ layer.options.itemId+'>'+layer.options.zj.Id,
                              itemName: layer.options.itemName,
                              projectType: 2
                            })
                          });
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
