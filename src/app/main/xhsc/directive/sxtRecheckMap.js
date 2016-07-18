/**
 * Created by jiuyuong on 2016/6/22.
 */
(function () {
  angular
    .module('app.xhsc')
    .directive('sxtRecheckMap',sxtRecheckMap);
  /** @ngInject */
  function sxtRecheckMap($timeout,remote,mapPopupSerivce,sxt,utils,$q,$window,api,db) {
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
          remote.Procedure.getZGReginQuesPoint(scope.regionId,scope.item).then(function(t){
            console.log('t',t)
          })
          scope.ques=[];
          regionId = scope.regionId;
          fg = new L.SvFeatureGroup({
            onLoad: function () {
              var promises=[
                remote.Procedure.getZGReginQues(scope.regionId,scope.item),
                remote.Procedure.getZGReginQuesPoint(scope.regionId,scope.item)
              ]
              $q.all(promises).then(function(res){
                res[0].data.forEach(function (item) {
                  var p = res[1].data.find(function (pt) {
                    return pt.MeasurePointID==item.PositionID;
                  });
                  if(p){
                    var geo = $window.JSON.parse(p.Geometry);
                    geo.options.v = item;
                    geo.geometry.options={};

                    if(item.Status == 2){
                      geo.options.color ='#169e49';
                    }
                    if(item.Status == 8){
                      geo.options.color = '#faa526';
                    }
                    geo.options.customSeq = true;
                    geo.options.seq = item.ProblemSortName;
                    fg.addData(geo);
                  }
                })
              })

            },
            onUpdate: function (layer, isNew, group) {
              //console.log('a')
            },
            onUpdateData: function (context, data, editScope) {
              //console.log('b')
            },
            onPopup: function (e) {
              //alert('popup')
              if(e.layer instanceof L.Stamp) {
                var edit = mapPopupSerivce.get('mapRecheckMapPopup');
                if (edit) {
                  scope.sxtMapShow = true;
                  edit.scope.context = e;
                  edit.scope.data = {
                    item: scope.item,
                    value: e.layer.options.v
                  }
                  edit.scope.apply && edit.scope.apply();
                }
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
        //scope.$watch('sxtMapShow',function(){
        //  if(map){
        //    map._map.remove();
        //    map = null;
        //  }
        //  install();
        //})
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
