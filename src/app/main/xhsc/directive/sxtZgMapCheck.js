/**
 * Created by jiuyuong on 2016/6/22.
 */
(function () {
  angular
    .module('app.xhsc')
    .directive('sxtZgMapCheck',sxtZgMapCheck);
  /** @ngInject */
  function sxtZgMapCheck($timeout,remote,mapPopupSerivce,sxt,utils,$q,$window,xhUtils) {
    return {
      scope:{
        item:'=sxtZgMapCheck',
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
                      c.ProblemDescription= c.IndexPointID?c.ProblemDescription:'合格';
                      p.geometry.properties.seq = c.ProblemSortName;
                      p.geometry.properties.v = c;
                      if(p.geometry.geometry.type == 'Stamp')
                        p.geometry.geometry.type = 'Point';
                      p.geometry.properties.Status = c.Status;
                      fs.push(p.geometry);
                    }
                  });
                  scope.item = null;
                  fg.addData(fs,false);
                  cb();
                  scope.ct && (scope.ct.loading = false);
                })
              });
            },
            onUpdate: function (layer, isNew, group,cb) {

            },
            onPopup: function (layer,cb) {
              var edit = mapPopupSerivce.get('mapRecheckMapPopup');
              if (edit) {
                scope.sxtMapShow = true;
                edit.scope.context = fg;
                edit.scope.data = {
                  item:scope.item,
                  procedure:scope.procedure,
                  regionId:scope.regionId,
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
