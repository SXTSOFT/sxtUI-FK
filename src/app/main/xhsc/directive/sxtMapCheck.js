/**
 * Created by jiuyuong on 2016/6/22.
 */
(function () {
  angular
    .module('app.xhsc')
    .directive('sxtMapCheck',sxtMapCheck);
  /** @ngInject */
  function sxtMapCheck($timeout,remote,mapPopupSerivce,sxt,utils,$window) {
    return {
      scope:{
        item:'=sxtMapCheck',
        items:'=',
        projectId:'=',
        procedure:'=',
        regionId:'='
      },
      link:link
    };

    function link(scope,element,attr,ctrl) {
      var map,fg,stamp,regionId;
      var install =function () {
        if (!map) {
          map = new L.SXT.Project(element[0], {
            map: {
              zoomControl: false
            }
          });
          map._map.removeControl(map._map.zoomControl);
          if(fg && scope.regionId!=regionId){
            stamp.disable();
            map._map.removeLayer(fg);
          }
          regionId = scope.regionId;
          fg = new L.SvFeatureGroup({
            onLoad: function () {
              remote.Procedure.InspectionCheckpoint.query(scope.procedure,scope.regionId).then(function (r) {
                remote.Procedure.InspectionPoint.query(scope.procedure, scope.regionId).then(function (r1) {
                  fg.data = r.data;
                  r.data.forEach(function (c) {
                    var p = r1.data.find(function (p1) {
                      return p1.MeasurePointID == c.PositionID;
                    });
                    if (p) {
                      p.geometry = $window.JSON.parse(p.Geometry);
                      p.geometry.options.customSeq = true;
                      p.geometry.options.seq = c.ProblemSortName;
                      p.geometry.options.v = c;
                      fg.addData(p.geometry);
                    }
                  })
                })
              });
            },
            onUpdate: function (layer, isNew, group) {
              var point = layer.toGeoJSON();
              if(isNew){
                layer.updateValue({
                  seq: scope.item.ProblemSortName
                });
              }
              point = {
                MeasurePointID:point.properties.$id,
                geometry:point
              };
              remote.Procedure.InspectionPoint.create(point);
              if(isNew || !fg.data.find(function (d) {
                  return d.PositionID == point.MeasurePointID;
                })) {
                var v = {
                  CheckpointID:sxt.uuid(),
                  IndexPointID:scope.item.ProblemID,
                  AreaID:scope.regionId,
                  AcceptanceItemID:scope.procedure,
                  PositionID:point.MeasurePointID,
                  MeasureValue:0,
                  Status:1,
                  ProblemSortName:scope.item.ProblemSortName,
                  ProblemDescription:scope.item.ProblemDescription,
                  isNew:true
                }
                fg.data.push(v);
                remote.Procedure.InspectionCheckpoint.create(v);
              }
            },
            onPopupClose: function (e) {
              var self = this;
              var edit = mapPopupSerivce.get('mapCheckMapPopup'),
                scope = edit.scope;
              if(scope.data && scope.isSaveData!==false){
                scope.isSaveData = false;
                self.options.onUpdateData(scope.context,scope.data,scope);
              }
            },
            onUpdateData: function (context, data, editScope) {
              //remote.Procedure.InspectionCheckpoint.create(data.v);
            },
            onDelete: function (layer) {
              var id = layer.getValue().$id;
              remote.Procedure.InspectionPoint.delete({MeasurePointID:id}).then(function () {
                var v = fg.data.find(function (d) {
                  return d.PositionID == id;
                }),ix = fg.data.indexOf(v);
                fg.data.splice(ix,1);
                remote.Procedure.InspectionCheckpoint.delete(v.CheckpointID);
              });
            },
            onPopup: function (e) {
              if(e.layer instanceof L.Stamp)
                var edit = mapPopupSerivce.get('mapCheckMapPopup');
              if(edit) {
                if(e.layer instanceof L.Stamp) {
                  $timeout(function () {
                    var center = fg._map.getCenter();
                    fg._map.setView([center.lat,e.layer._latlng.lng]);
                  },500);
                };
                edit.scope.context = e;
                edit.scope.data = {
                  item:scope.item,
                  projectId:scope.projectId,
                  procedure:scope.procedure,
                  regionId:scope.regionId,
                  v:fg.data.find(function (d) {
                    return d.PositionID == e.layer._value.$id;
                  }),

                };

                edit.scope.readonly = scope.readonly;
                edit.scope.apply && edit.scope.apply();
                return edit.el[0];
              }
            }
          }).addTo(map._map),
          stamp = new L.Draw.Stamp(map._map);
          map._map.on('draw:created',function (e) {
            if(this._map){
              this.addLayer(e.layer);
            }
          },fg);
          $timeout(function () {
            remote.Project.getDrawingRelations(scope.regionId.substring(0,5)).then(function (result) {
              var imgId = result.data.find(function (item) {
                return item.AcceptanceItemID == scope.procedure && item.RegionId == scope.regionId;
              });
              if(!imgId){
                imgId = result.data.find(function (item) {
                  return item.RegionId == scope.regionId;
                });
              }
              if (imgId) {
                remote.Project.getDrawing(imgId.DrawingID).then(function (result) {
                  if(!result.data.DrawingContent){
                    utils.alert('未找到图纸,请与管理员联系!(2)');
                    return;
                  }
                  map.loadSvgXml(result.data.DrawingContent, {
                    filterLine: function (line) {
                      line.attrs.stroke = 'black';
                      line.options = line.options || {};
                      line.attrs['stroke-width'] = line.attrs['stroke-width'] * 6;
                    },
                    filterText: function (text) {
                    }
                  });
                  map.center();
                  map._map.setZoom(1);
                })
              }
              else{
                if(!result.data.DrawingContent){
                  utils.alert('未找到图纸,请与管理员联系!(1)')
                  return;
                }
              }
            });
          }, 0);
        }
      };
      $timeout(function () {
        scope.$watch('regionId', function () {
          if(scope.regionId && scope.procedure) {
            if(map){
              map._map.remove();
              map = null;
            }
            install();
          }
        });
        scope.$watch('item',function () {
          if(stamp) {
            if (scope.item) {
              stamp.enable();
            }
            else {
              stamp.disable();
            }
          }
        })
      }, 500);
      scope.$on('destroy',function () {
        if(map){
          map._map.remove();
          map = null;
        }
      })
    }
  }
})();
