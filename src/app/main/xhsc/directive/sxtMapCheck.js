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
        procedure:'=',
        regionId:'=',
        inspectionId:'='
      },
      link:link
    };

    function link(scope,element,attr,ctrl) {
      var map,fg;
      var install =function () {
        if (!map) {
          map = new $window.L.glProject(element[0], {
            map: {
              zoomControl: false
            }
          });
          fg = $window.mapboxgl.Plan({
            onChangeMode:function (mode,op,cb) {
              if(mode && !op){
                scope.item = {
                  ProblemID:null,
                  ProblemSortName:'✔',//'',
                  ProblemDescription:''
                };
              }
              cb();
            },
            onLoad: function (cb) {
              remote.Procedure.InspectionCheckpoint.query(scope.procedure,scope.regionId,scope.inspectionId).then(function (r) {
                remote.Procedure.InspectionPoint.query(scope.inspectionId,scope.procedure, scope.regionId).then(function (r1) {
                  fg.data = r.data,fs=[];
                  r.data.forEach(function (c) {
                    var p = r1.data.find(function (p1) {
                      return p1.MeasurePointID == c.PositionID;
                    });
                    if (p && p) {
                      if(p.Geometry){
                        p.geometry = $window.JSON.parse(p.Geometry);
                      }else{
                        p.geometry = p.geometry;
                      }
                      p.geometry.properties.seq = c.ProblemSortName;
                      if(p.geometry.geometry.type == 'Stamp')
                        p.geometry.geometry.type = 'Point';
                      p.geometry.properties.Status = c.Status;
                      fs.push(p.geometry);
                    }
                  });
                  scope.item = null;
                  fg.addData(fs,false);
                  cb();
                })
              });
            },
            onUpdate: function (layer, isNew, group,cb) {
              if(isNew){
                layer.properties.seq = scope.item.ProblemSortName;
                layer.properties.Status = scope.item.ProblemID?1:2;
              }
              var point = {
                MeasurePointID:layer.properties.$id,
                geometry:layer
              };
              remote.Procedure.InspectionPoint.create(point);
              if(isNew || !fg.data.find(function (d) {
                  return d.PositionID == point.MeasurePointID;
                })) {
                var v = {
                  InspectionID:scope.inspectionId,
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
                if(!v.IndexPointID){
                  v.Status = 2;
                  point.geometry.properties.Status = 2;
                }
                fg.data.push(v);
                fg.changeMode();
                remote.Procedure.InspectionCheckpoint.create(v);
              }
              cb(layer);
            },
            onPopupClose: function (cb) {
              var self = this;
              var edit = mapPopupSerivce.get('mapCheckMapPopup'),
                scope = edit.scope;
              if(scope.data && scope.isSaveData!==false){
                scope.isSaveData = false;
                self.options.onUpdateData(scope.context,scope.data,scope);
              }
              cb();
            },
            onUpdateData: function (context, data, editScope) {
              if(data.v.ProblemSortName == 'T'){
                remote.Procedure.InspectionCheckpoint.create(data.v);
              }
            },
            onDelete: function (layer,cb) {
              var id = layer.properties.$id;
              remote.Procedure.InspectionPoint.delete({MeasurePointID:id}).then(function (r) {
                var v = fg.data.find(function (d) {
                  return d.PositionID == id;
                }),ix = fg.data.indexOf(v);
                fg.data.splice(ix,1);
                remote.Procedure.InspectionCheckpoint.delete(v.CheckpointID);
              });
              cb(layer);
            },
            onPopup: function (layer,cb) {
              var edit = mapPopupSerivce.get('mapCheckMapPopup');
              if(edit) {
                edit.scope.context = {
                  fg:fg,
                  layer:layer
                };
                edit.scope.data = {
                  item:scope.item,
                  procedure:scope.procedure,
                  regionId:scope.regionId,
                  v:fg.data.find(function (d) {
                    return d.PositionID == layer.properties.$id;
                  })
                };

                edit.scope.readonly = scope.readonly;
                edit.scope.apply && edit.scope.apply();
                cb(edit.el[0]);
              }
            }
          });
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
                  map.loadSvgXml(result.data.DrawingContent);
                  map.map.addControl(fg);
                  
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
              map.remove();
              map = null;
            }
            install();
          }
        });
        scope.$watch('item',function () {
          if(fg) {
            if (scope.item) {
              fg.changeMode('inspect',scope.item);
            }
            else {
              fg.changeMode();
            }
          }
        })
      }, 500);
      scope.$on('destroy',function () {
        if(map){
          map.remove();
          map = null;
        }
      })
    }
  }
})();
