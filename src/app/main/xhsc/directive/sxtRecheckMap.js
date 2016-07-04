/**
 * Created by jiuyuong on 2016/6/22.
 */
(function () {
  angular
    .module('app.xhsc')
    .directive('sxtRecheckMap',sxtRecheckMap);
  /** @ngInject */
  function sxtRecheckMap($timeout,remote,mapPopupSerivce,sxt,utils,$q) {
    return {
      scope:{
        item:'=sxtRecheckMap',
        sxtMapShow:'=',
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
          scope.ques=[];
          regionId = scope.regionId;
          fg = new L.SvFeatureGroup({
            onLoad: function () {
              var promises=[
                remote.Procedure.getReginQues(scope.regionId,scope.procedure),
                remote.Procedure.getPoints(scope.regionId,scope.procedure)
              ]
              $q.all(promises).then(function(res){
                var ques=res[0].data;
                scope.points=res[1].data;
                if (ques&&ques.length){
                  ques.forEach(function(t){
                    if (scope.points&&scope.points.length){
                      scope.points.forEach(function(m){
                        if (t.IndexPointID== m.IndexPointID){
                          if (!t.points){
                            t.points=[];
                          }
                          t.points.push(m);
                        }
                      });
                    }
                    scope.ques.push(t);
                  });
                }
                var features = [];
                scope.ques.forEach(function(t){
                  var feature ={"type":"Feature","properties":{"seq":1,"$id":"9f04f4e54ae54858ba5cc30670491818"},"options":{"stroke":true,"color":"red","dashArray":"","lineCap":null,"lineJoin":null,"weight":1,"opacity":1,"fill":true,"fillColor":null,"fillOpacity":0.2,"clickable":true,"font-family":"Helvetica","font-style":"normal","font-weight":"bold","letter-spacing":"0.05em","stroke-width":2,"text-decoration":"none","multiSelect":false,"repeatMode":true},"geometry":{"type":"Stamp","coordinates":[0.7236328125,0.681640625],options:{customSeq:true,seq:t.IndexName,v:t}}};
                  features.push({"type":"Feature","properties":{"seq":1,"$id":"9f04f4e54ae54858ba5cc30670491818"},"options":{"stroke":true,"color":"red","dashArray":"","lineCap":null,"lineJoin":null,"weight":1,"opacity":1,"fill":true,"fillColor":null,"fillOpacity":0.2,"clickable":true,"font-family":"Helvetica","font-style":"normal","font-weight":"bold","letter-spacing":"0.05em","stroke-width":2,"text-decoration":"none","multiSelect":false,"repeatMode":true},"geometry":{"type":"Stamp","coordinates":[0.7236328125,0.681640625],options:{customSeq:true,seq:t.IndexName}}})
                  fg.addData(feature.geometry);
                })

              })
              //remote.Procedure.InspectionCheckpoint.query(scope.procedure,scope.regionId).then(function (r) {
              //  remote.Procedure.InspectionPoint.query().then(function (r1) {
              //    fg.data = r.data;
              //    r.data.forEach(function (c) {
              //      var p = r1.data.find(function (p1) {
              //        return p1.MeasurePointID==c.PositionID;
              //      });
              //      if(p){
              //        p.geometry.options.customSeq = true;
              //        p.geometry.options.seq = c.ProblemSortName;
              //        p.geometry.options.v = c;
              //        fg.addData(p.geometry);
              //      }
              //    })
              //
              //  });
              //
              //
              //});
             // var feature ={"type":"Feature","properties":{"seq":1,"$id":"9f04f4e54ae54858ba5cc30670491818"},"options":{"stroke":true,"color":"red","dashArray":"","lineCap":null,"lineJoin":null,"weight":1,"opacity":1,"fill":true,"fillColor":null,"fillOpacity":0.2,"clickable":true,"font-family":"Helvetica","font-style":"normal","font-weight":"bold","letter-spacing":"0.05em","stroke-width":2,"text-decoration":"none","multiSelect":false,"repeatMode":true},"geometry":{"type":"Stamp","coordinates":[0.7236328125,0.681640625],options:{customSeq:true,seq:1}}};
             // this.addData(feature.geometry);
            },
            onUpdate: function (layer, isNew, group) {
              console.log('a')
            },
            onUpdateData: function (context, data, editScope) {
              console.log('b')
            },
            onPopup: function (e) {
              console.log('e',e)
              if(e.layer instanceof L.Stamp)
              var edit = mapPopupSerivce.get('mapRecheckMapPopup');
              if(edit){
                scope.sxtMapShow = true;
                edit.scope.context = e;
                edit.scope.data = {
                  item: scope.item,
                  projectId: scope.projectId,
                  procedure: scope.procedure,
                  regionId: scope.regionId,
                  indexPointID: e.layer.options.v.IndexPointID
                  //v:fg.data.find(function (d) {
                  //  return d.PositionID == e.layer._value.$id;
                  //})
                }
                edit.scope.apply && edit.scope.apply();
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
            remote.Project.getDrawingRelations(scope.projectId).then(function (result) {
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
              //stamp.enable();
            }
            else {
              //stamp.disable();
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
