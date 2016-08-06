/**
 * Created by jiuyuong on 2016/6/22.
 */
(function () {
  angular
    .module('app.xhsc')
    .directive('sxtRecheckMap',sxtRecheckMap);
  /** @ngInject */
  function sxtRecheckMap($timeout,remote,mapPopupSerivce,sxt,utils,$q,$window,xhUtils) {
    return {
      scope:{
        item:'=sxtRecheckMap',
        sxtMapShow:'=',
        items:'=',
        procedure:'=',
        regionId:'=',
        inspectionId:'=',
        disableInspect:'=',
        disableDrag:'=',
        ct:'='
      },
      link:link
    };

    function link(scope,element,attr,ctrl) {
      scope.ct && (scope.ct.loading = true);
      var map,fg;
      var install =function () {
        scope.ct && (scope.ct.loading = true);
        if (!map) {
          map = new $window.L.glProject(element[0], {
            map: {
              zoomControl: false
            }
          });
          fg = $window.mapboxgl.Plan({
            disableInspect:scope.disableInspect,
            disableDrag:scope.disableDrag,
            onChangeMode:function (mode,op,cb) {
              if(mode && !op){
                scope.ct && scope.ct.cancelMode && scope.ct.cancelMode();
                scope.item = {
                  ProblemID:null,
                  ProblemSortName:'✔',//'',
                  ProblemDescription:''
                };
              }
              cb();
            },
            onLoad: function (cb) {
              $q.all([remote.Procedure.getZGReginQues(scope.regionId,scope.item),
                  remote.Procedure.getZGReginQuesPoint(scope.regionId,scope.item)])
                .then(function(res) {
                  var fs = [];
                  fg.data = res[0].data;
                  res[0].data.forEach(function (item) {
                    var p = res[1].data.find(function (pt) {
                      return pt.MeasurePointID == item.PositionID;
                    });
                    if (p && p.Geometry) {
                      var geo = $window.JSON.parse(p.Geometry);
                      if(geo && geo.geometry) {
                        if (geo.geometry.type == 'Stamp')
                          geo.geometry.type = 'Point';
                        geo.properties.Status = item.Status;
                        geo.properties.v = item;
                        geo.properties.seq = item.ProblemSortName;
                        fs.push(geo);
                      }
                    }
                  })
                  fg.addData(fs, false);
                  cb();
                  scope.ct && (scope.ct.loading = false);
                })
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
                scope.ct && scope.ct.cancelMode && scope.ct.cancelMode();
                remote.Procedure.InspectionCheckpoint.create(v);
              }
              cb(layer);
            },
            onPopup: function (layer,cb) {
              var edit = mapPopupSerivce.get('mapRecheckMapPopup');
              if (edit) {
                scope.sxtMapShow = true;
                edit.scope.context = fg;
                edit.scope.data = {
                  item: scope.item,
                  value: layer.properties.v
                }
                edit.scope.apply && edit.scope.apply();
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
                remote.Project.getDrawing(imgId.DrawingID).then(function (result2) {
                  if(!result2.data.DrawingContent){
                    scope.ct && (scope.ct.loading = false);
                    utils.alert('未找到图纸,请与管理员联系!(2)');
                    return;
                  }
                  map.loadSvgXml(result2.data.DrawingContent);
                  map.map.addControl(fg);
                  var btn = $('<div class="mapboxgl-ctrl-group mapboxgl-ctrl"><button class="mapboxgl-ctrl-icon links"  title="其它图纸"></button></div>');
                  btn.click(function () {
                    var mapList = [];
                    result.data.forEach(function (item) {
                      if(item.RegionId == scope.regionId && item.DrawingID!=imgId.DrawingID && !mapList.find(function (f) {
                          return f.DrawingID==item.DrawingID
                        })){
                        mapList.push(item);
                      }
                    });

                    xhUtils.openLinks(mapList);
                  });
                  element.find('.mapboxgl-ctrl-bottom-left').append(btn);
                  //scope.ct && (scope.ct.loading = false);
                })
              }
              else {
                scope.ct && (scope.ct.loading = false);
                utils.alert('未找到图纸,请与管理员联系!(1)')
                return;
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
