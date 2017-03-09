/**
 * Created by shaoshun on 2016/11/29.
 */
/**
 * Created by lss on 2016/10/24.
 */
/**
 * Created by jiuyuong on 2016/6/22.
 */
(function () {
  angular
    .module('app.xhsc')
    .directive('selfAccept',selfAccept);
  /** @ngInject */
  function selfAccept($timeout,remote,mapPopupSerivce,sxt,utils,$window,xhUtils,$q) {
    return {
      scope:{
        item:'=selfAccept',
        procedure:'=',
        regionId:'=',
        inspectionId:'=',
        imgId:"=",
        ct:'=',
        disableInspect:'@',
        disableDrag:'@',
        gx:"="
      },
      link:link
    };

    function link(scope,element,attr,ctrl) {
      scope.ct && (scope.ct.loading = true);
      var map,fg;

      function loadingPic(regionId,gx) {
       return  $q(function (resolve,reject) {
         scope.asy=true;
          var imgId="";
          if(scope.regionId){
            var areaID=scope.regionId.substr(0,10);
            remote.safe.getDrawingRelate.cfgSet({
              offline: true
            })("cycle",areaID).then(function (result) {
              imgId = result.data.find(function (item) {
                return item.AcceptanceItemID==scope.procedure && item.RegionId ==scope.regionId;
              });
              if(!imgId){
                imgId = result.data.find(function (item) {
                  return item.RegionId == scope.regionId;
                });
              }
              if (imgId){
                imgId=imgId.DrawingID;
              }
              resolve(imgId);
            }).catch(function () {
              resolve(imgId);
            })
          }
        })
      }

      var install =function () {
        loadingPic().then(function (imgId) {
          scope.identity=0;
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
                remote.self.zb.pointQuery.cfgSet({
                  filter:function (item){
                    return item.RegionID==scope.regionId&&item.AcceptanceItemID==scope.procedure;
                  }
                })().then(function (r) {
                  remote.Procedure.InspectionPoint.query().then(function (r1) {
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
                          if ($.isNumeric(c.ProblemSortName)){
                            var  t=parseInt(c.ProblemSortName);
                            scope.identity=scope.identity<t?t:scope.identity;
                          }
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
                  layer.properties.seq =++scope.identity;
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
                  var Id=sxt.uuid();
                  var v = {
                    Id:Id,
                    Drawing:scope.imgId,
                    InspectionID:scope.inspectionId,
                    CheckpointID:Id,
                    IndexPointID:scope.item.ProblemID,
                    RegionID:scope.regionId,
                    AcceptanceItemID:scope.procedure,
                    PositionID:point.MeasurePointID,
                    MeasureValue:0,
                    Status:1,
                    ProblemSortName:layer.properties.seq,
                    ProblemDescription:scope.item.ProblemDescription,
                    isNew:true
                  }
                  if(!v.IndexPointID){
                    v.Status = 2;
                    point.geometry.properties.Status = 2;
                  }
                  fg.data.push(v);
                  scope.ct && scope.ct.cancelMode && scope.ct.cancelMode();
                  remote.self.zb.pointCreate(v);

                }
                cb(layer);
              },
              onPopupClose: function (cb) {
                var self = this;
                var edit = mapPopupSerivce.get('selfAcceptPopup'),
                  scope = edit.scope;
                if(scope.data && scope.isSaveData!==false){
                  scope.isSaveData = false;
                  self.options.onUpdateData(scope.context,scope.data,scope);
                }
                cb();
              },
              onUpdateData: function (context, data, editScope) {
                if(data.v.ProblemSortName == 'T'){
                  remote.self.zb.pointCreate(data.v);
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
                  remote.self.zb.pointDelete({CheckpointID:v.CheckpointID}).then(function () {
                    //删除记录
                    remote.self.zb.problemRecordQuery(v.CheckpointID).then(function (k) {
                      if (angular.isArray(k.data)){
                        k.data.forEach(function (w) {
                          //删除照片
                          remote.self.zb.problemRecordDelete(w).then(function () {
                            remote.self.zb.problemRecordFileQuery(w.ProblemRecordID).then(function (m) {
                              if (angular.isArray(m.data)){
                                m.data.forEach(function (q) {
                                  remote.self.zb.problemRecordFileDelete(q);
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
                var edit = mapPopupSerivce.get('selfAcceptPopup');
                if(edit) {
                  edit.scope.context = {
                    fg:fg,
                    layer:layer
                  };
                  edit.scope.inspectionId=scope.inspectionId;
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
              if (imgId){
                remote.Project.getDrawing(imgId).then(function (result2) {
                  scope.asy=false;
                  if(!result2.data.DrawingContent){
                    scope.ct && (scope.ct.loading = false);
                    utils.alert('未找到图纸,请与管理员联系!');
                    return;
                  }
                  map.loadSvgXml(result2.data.DrawingContent);
                  map.map.addControl(fg);
                }).catch(function () {
                  scope.asy=false;
                })
              }else {
                scope.asy=false;
                utils.alert('未找到图纸,请与管理员联系!');
              }
            });
          }
        })
      };

      scope.$watch('procedure', function () {
        if(!scope.asy&&scope.regionId&&scope.procedure) {
          if(map){
            map.remove();
            fg=map = null;
          }
          install();
        }
      });

      scope.$watch('regionId', function () {
        if(!scope.asy&&scope.regionId&&scope.procedure) {
          if(map){
            map.remove();
            fg=map = null;
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

      scope.$on('destroy',function () {
        if(map){
          map.remove();
          map = null;
        }
      })
    }
  }
})();
