/**
 * Created by jiuyuong on 2016/5/19.
 */
(function () {
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtAreaHouses',sxtAreaHousesDirective);
  /** @ngInject */
  function sxtAreaHousesDirective (sxt, api,$timeout,$q) {
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

            $q.all([
              api.szgc.FilesService.group(bid + '-' + type),
              api.szgc.FilesService.GetGroupLike(regionId),
              api.szgc.FilesService.GetGroupLike('sub-'+regionId)
            ]).then(function (rs) {
              var r = rs[0];
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
                  if (e.target.isEdit) return;
                  var p = e.latlng,// this._map.mouseEventToLatLng(e),
                    overLayers = [],
                    eb, isN = false;
                  map.eachLayer(function (layer) {
                    if (layer.editing && !layer.isEdit) {
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
                  var colorLayer = overLayers.find(function (l) {
                    return l.options.fillOpacity != 0;
                  });
                  if (!colorLayer) {
                    colorLayer = overLayers.find(function (l) {
                      return l instanceof L.Polygon || layer instanceof L.Rectangle;
                    });
                    if (colorLayer) {
                      var groupLayer = [];
                      map.eachLayer(function (layer) {
                        if (layer.isEdit) {
                          map.removeLayer(layer);
                        }
                        if (layer.editing && !layer.isEdit) {
                          if (layer.options.itemName == colorLayer.options.itemName) {
                            if (layer instanceof L.Rectangle || layer instanceof L.Polygon) {
                              layer.setStyle({
                                color: '#ff0000',
                                stroke: true,
                                opacity: 0.5,
                                dashArray: rs[1].data.Rows.find(function (r) {
                                  return r.GroupId.indexOf(layer.options.itemId) != -1
                                }) || rs[2].data.Rows.find(function (r) {
                                  return r.GroupId.indexOf(layer.options.itemId) != -1
                                }) ? null : '1 1',
                                weight: 1,
                                fillOpacity: 0.2
                              });
                              groupLayer.push(layer);
                            }
                            else {
                              layer.setStyle({
                                color: '#ff0000',
                                stroke: true,
                                dashArray: rs[1].data.Rows.find(function (r) {
                                  return r.GroupId.indexOf(layer.options.itemId) != -1
                                }) || rs[2].data.Rows.find(function (r) {
                                  return r.GroupId.indexOf(layer.options.itemId) != -1
                                }) ? null : '5 2',
                                fillOpacity: 0.2
                              });
                            }
                          }
                          else {
                            layer.setStyle({
                              color: '#ff0000',
                              stroke: false,
                              fillOpacity: 0
                            });
                          }
                        }
                      });
                      var layer = groupLayer.find(function (layer) {
                        return layer.options.p == '1';
                      });
                      var layer2 = groupLayer.find(function (layer) {
                        return layer.options.p == '5';
                      });
                      if (layer) {
                        //console.log('b', layer.getBounds());
                        var b = layer.getBounds(), p1 = new L.latLng(b._southWest.lat - 0.1, b._southWest.lng-0.1);
                        L.marker(p1, {
                          icon: new ST.L.LabelIcon({
                            html: '楼板',
                            color: rs[1].data.Rows.find(function (r) {
                              return r.GroupId.indexOf(layer.options.itemId) != -1
                            }) || rs[2].data.Rows.find(function (r) {
                              return r.GroupId.indexOf(layer.options.itemId) != -1
                            }) ? '#ff0000' : 'silver'
                          }),
                          saved: false,
                          draggable: true,       // Allow label dragging...?
                          zIndexOffset: 1000     // Make appear above other map features
                        }).addTo(map).on('click', function () {
                          layer.setStyle({
                            color: 'green'
                          })
                          scope.itemName = layer.options.t;
                          //scope.itemName = (layer.options.itemName || itemName) + ' - ' + layer.options.t;
                          scope.itemId = layer.options.itemId || '--';
                          scope.$apply();
                          layer2 && layer2.setStyle({
                            color: '#ff0000'
                          })
                        }).isEdit = true;
                      }

                      if (layer2) {
                        var b = layer2.getBounds(), p2 = L.latLng(b._southWest.lat - 0.1, b._southWest.lng + 0.1);
                        L.marker(p2, {
                          icon: new ST.L.LabelIcon({
                            html: '吊顶',
                            color: rs[1].data.Rows.find(function (r) {
                              return r.GroupId.indexOf(layer.options.itemId) != -1
                            }) || rs[2].data.Rows.find(function (r) {
                              return r.GroupId.indexOf(layer.options.itemId) != -1
                            }) ? '#ff0000' : 'silver'
                          }),
                          saved: false,
                          draggable: true,       // Allow label dragging...?
                          zIndexOffset: 1000     // Make appear above other map features
                        }).addTo(map).on('click', function () {
                          layer2.setStyle({
                            color: 'green'
                          })
                          layer && layer.setStyle({
                            color: '#ff0000'
                          })
                          scope.itemName = layer2.options.t;
                          //scope.itemName = (layer2.options.itemName || itemName) + ' - ' + layer2.options.t;
                          scope.itemId = layer2.options.itemId || '--';
                          scope.$apply();

                        }).isEdit = true;
                      }

                    }
                    return;
                  }
                  var line, itemName, curClick;
                  overLayers.forEach(function (layer) {
                    itemName = layer.options.itemName || itemName;
                    var idx = itemId.indexOf(layer.options.itemId);
                    if (itemId.indexOf(layer.options.itemId) == -1) {
                      curClick = layer;
                      itemId.push(layer.options.itemId);
                    }
                    else {

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
                    //itemId = curClick.options.itemId;
                    curClick.setStyle({
                      color: 'green'
                    })
                    scope.itemName = curClick.options.t;
                    //scope.itemName = (curClick.options.itemName || itemName)+' - '+ curClick.options.t;
                    scope.itemId = curClick.options.itemId || '--';
                    scope.$apply();

                    //console.log(curClick.toJSON())
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
                          api.szgc.ProjectExService.get(bid + '-' + type + '-' + m).then(function (r) {
                            var project = r.data;
                            if (project && project.AreaRemark) {
                              try {
                                var d = JSON.parse(project.AreaRemark);
                                d.features.forEach(function (g) {
                                  //if (g.geometry.type == 'Polygon') {
                                  g.options.p = m;
                                  switch (m) {
                                    case '1':
                                      g.options.t = '楼板';
                                      break;
                                    case '2':
                                      g.options.t = '墙体';
                                      break;
                                    case '3':
                                      g.options.t = '内墙板';
                                      break;
                                    case '4':
                                      g.options.t = '轻钢龙骨';
                                      break;
                                    case '5':
                                      g.options.t = '吊顶';
                                      break;
                                    case '6':
                                      g.options.t = '砌筑';
                                      break;
                                  }
                                  g.options.stroke = false;
                                  //g.options.opacity = 0;
                                  g.options.fillOpacity = 0;
                                  //}
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
