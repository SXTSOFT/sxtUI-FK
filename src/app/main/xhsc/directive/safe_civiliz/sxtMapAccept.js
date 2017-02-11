/**
 * Created by lss on 2016/10/24.
 */
/**
 * Created by jiuyuong on 2016/6/22.
 */
(function () {
  angular
    .module('app.xhsc')
    .directive('sxtMapAccept',sxtMapAccept);
  /** @ngInject */
  function sxtMapAccept($timeout,remote,mapPopupSerivce,sxt,utils,$window,xhUtils,api) {
    return {
      scope:{
        item:'=sxtMapAccept',
        procedure:'=',
        regionId:'=',
        inspectionId:'=',
        inspectionAreaId:"=",
        ct:'=',
        disableInspect:'@',
        disableDrag:'@'
      },
      link:link
    };

    function link(scope,element,attr,ctrl) {
      api.setNetwork(1).then(function () {
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
                remote.safe.ckPointQuery.cfgSet({
                  filter:function (item,AcceptanceItemID,AreaID,inspectionId){
                    return item.AcceptanceItemID==AcceptanceItemID && item.AreaID==AreaID&&item.InspectionID==inspectionId;
                  }
                })(scope.procedure,scope.regionId,scope.inspectionId).then(function (r) {
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
                        if(p.geometry && p.geometry.properties) {
                          p.geometry.properties.seq = c.ProblemSortName;
                          if (p.geometry.geometry.type == 'Stamp')
                            p.geometry.geometry.type = 'Point';
                          p.geometry.properties.Status = c.Status;
                          fs.push(p.geometry);
                        }
                      }
                    });
                    scope.item = null;
                    fg.addData(fs,false);
                    cb();
                    scope.ct && (scope.ct.loading = false);
                  })
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
                    InspectionAreaID:scope.inspectionAreaId,
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
                  v.action="Insert";
                  fg.data.push(v);
                  scope.ct && scope.ct.cancelMode && scope.ct.cancelMode();
                  remote.safe.ckPointCreate(v);

                }
                cb(layer);
              },
              onPopupClose: function (cb) {
                var self = this;
                var edit = mapPopupSerivce.get('mapAcceptPopup'),
                  scope = edit.scope;
                if(scope.data && scope.isSaveData!==false){
                  scope.isSaveData = false;
                  self.options.onUpdateData(scope.context,scope.data,scope);
                }
                cb();
              },
              onUpdateData: function (context, data, editScope) {
                if(data.v.ProblemSortName == 'T'){
                  data.v.action="Insert";
                  remote.safe.ckPointCreate(data.v);
                }
              },
              onDelete: function (layer,cb) {
                var id = layer.properties.$id;
                //删除几何点
                remote.Procedure.InspectionPoint.delete({MeasurePointID:id}).then(function (r) {
                  var v = fg.data.find(function (d) {
                    return d.PositionID == id;
                  }),ix = fg.data.indexOf(v);
                  fg.data.splice(ix,1);
                  //删除检查点
                  remote.safe.ckPointDelete({CheckpointID:v.CheckpointID}).then(function () {
                    //删除记录
                    remote.safe.problemRecordQuery(v.CheckpointID).then(function (k) {
                      if (angular.isArray(k.data)){
                        k.data.forEach(function (w) {
                          //删除照片
                          remote.safe.problemRecordDelete(w).then(function () {
                            remote.safe.ProblemRecordFileQuery(w.ProblemRecordID).then(function (m) {
                              if (angular.isArray(m.data)){
                                m.data.forEach(function (q) {
                                  remote.safe.ProblemRecordFileDelete(q);
                                })
                              }
                            })
                          })
                        });

                      }
                    })
                  });
                });
                cb(layer);
              },
              onPopup: function (layer,cb) {
                var edit = mapPopupSerivce.get('mapAcceptPopup');
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

              remote.safe.getDrawingRelate.cfgSet({
                offline: true
              })("Acceptances",scope.regionId).then(function (result) {
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

                  })
                }
                else{
                  scope.ct && (scope.ct.loading = false);
                  utils.alert('未找到图纸,请与管理员联系!(1)')
                  return;
                }
              });
            }, 300);
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
      })

    }
  }
})();
