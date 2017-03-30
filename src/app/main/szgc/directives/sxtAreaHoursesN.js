/**
 * Created by jiuyuong on 2016/5/20.
 */
(function () {
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtAreaHousesN',sxtAreaHousesDirective);
  /** @ngInject */
  function sxtAreaHousesDirective (sxt, api,$timeout) {
    return {
      scope: {
        param: '=',
        procedures: '=',
        itemId: '=',
        itemName:'='
      },
      link: function (scope, element, attrs, ctrl) {
        function isMiddleNumber(n1, n2, n, f) {
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

        $timeout(function () {
          scope.$watch('param', function () {
            if (!scope.param) return;
            var regionId = scope.param.idTree.replace(/\>/g,'-').replace('sub-', ''),
              bid = regionId.split('-')[1],
              type = scope.param.item.type;
            api.szgc.FilesService.group(bid + '-' + type).then(function (r) {
              var fs = r.data.Files[0];
              if (fs) {
                var map, layer, apiLayer, drawControl, itemId=[];
                if (map)
                  map.remove();

                map = L.map(element[0], {
                  crs: L.extend({}, L.CRS, {
                    projection: L.Projection.LonLat,
                    transformation: new L.Transformation(1, 0, 1, 0),
                    scale: function (e) {
                      return 256 * Math.pow(2, e);
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
                map.on('click', function (e) {
                  var p = e.latlng,// this._map.mouseEventToLatLng(e),
                    overLayers = [],
                    eb, isN = false;
                  map.eachLayer(function (layer) {
                    if (layer.editing) {
                      layer.setStyle({
                        color: '#ff0000'
                      })
                      var bounds = layer.getBounds();
                      if (bounds && isMiddleNumber(bounds._southWest.lat, bounds._northEast.lat, p.lat, 1) &&
                        isMiddleNumber(bounds._southWest.lng, bounds._northEast.lng, p.lng, 1)
                      ) {
                        overLayers.push(layer);
                      }
                    }
                  });
                  var line,itemName,curClick;
                  overLayers.forEach(function (layer) {
                    itemName = layer.options.itemName || itemName;
                    var idx = itemId.indexOf(layer.options.itemId);
                    if (itemId.indexOf(layer.options.itemId)==-1) {
                      curClick = layer;
                      itemId.push(layer.options.itemId);
                    }
                  });
                  if (!curClick && overLayers.length) {
                    var curId = itemId.find(function (iid) {
                      return !!overLayers.find(function (o) {
                        return o.options.itemId == iid;
                      });
                    });
                    curClick = overLayers.find(function (o) {
                      return o.options.itemId == curId;
                    })
                    itemId.splice(itemId.indexOf(curId), 1);
                    itemId.push(curClick.options.itemId);
                  }
                  if (curClick) {
                    curClick.setStyle({
                      color: 'green'
                    })
                    scope.itemName = curClick.options.itemName || itemName;
                    scope.itemId = curClick.options.itemId ||'--';
                    scope.$apply();
                  }
                });

                layer = L.tileLayer(sxt.app.api + '/api/picMap/load/{z}_{x}_{y}.png?size=256&path=' + fs.Url.replace('/s_', '/'), {
                  noWrap: true,
                  continuousWorld: false,
                  tileSize: 256
                });
                layer.addTo(map);

                var lys = [];
                scope.procedures = ['1', '2', '3', '4', '5'];
                scope.$watchCollection('procedures', function () {

                  lys.forEach(function (l) {
                    l.hide = true;
                  })
                  scope.procedures.forEach(function (m) {
                    var layer = lys.find(function (o) {
                      return o.p == m;
                    });
                    if (!layer) {
                      layer = L.GeoJSON.api({
                        areaLabel: false,
                        edit: false,
                        get: function (cb) {
                          api.szgc.ProjectExService.get(bid + '-' + type +'-'+ m).then(function (r) {
                            var project = r.data;
                            if (project && project.AreaRemark) {
                              try {
                                var d = JSON.parse(project.AreaRemark);
                                d.features.forEach(function (g) {
                                  if (g.geometry.type == 'Polygon') {
                                    g.options.stroke = false;
                                    g.options.opacity = 0.01;
                                  }
                                })
                                cb(d);
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
                                y = h/w*0.5;
                              }
                              else {
                                y = 0.5;
                                x = w / h * 0.5;
                              }
                              map.setView([y, x]);
                            };
                            cImg.src = sxt.app.api + '/api/Files/thumb/250?path=' + fs.Url.replace('/s_', '/');
                          });

                        },
                        click: function () {

                        }
                      });

                      lys.push(layer)
                    }
                    layer.hide = false;
                  });
                  lys.forEach(function (l) {
                    if (l._map && l.hide) {
                      l._map.removeLayer(l);
                    }
                    else if (!l.hide && !l._map) {
                      l.addTo(map);
                    }
                  })

                });
              }
            })
          })
        },500)

      }
    }
  }

})();
