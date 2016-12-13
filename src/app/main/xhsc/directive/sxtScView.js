/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('sxtScView', sxtScView);

  /** @Inject */
  function sxtScView($timeout,$window,remote,utils){
    return {
      scope:{
        data:'=',
        procedure:'=',
        regionId:'='
      },
      link:link
    }
    function link(scope,element,attr,ctrl){
      var map,tile,fg;
      var install = function(){
        if(!scope.data)return;

        if(!map){
          map = new L.SXT.Project(element[0]);
        }
        $timeout(function(){
          remote.Project.getDrawingRelations(scope.regionId,"nodb").then(function (result) {
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
                map.loadSvgXml(result2.data.DrawingContent, {
                  filterLine: function (line) {
                    line.attrs.stroke = 'black';
                    line.options = line.options||{};
                    //line.options.color = 'black';

                    line.attrs['stroke-width'] = line.attrs['stroke-width']*6;
                  },
                  filterText: function (text) {
                    return false;
                  }
                });
                map.center();
                scope.tooltip = '';
              })
            }
            else{
              if(!result.data.DrawingContent){
                utils.alert('未找到图纸,请与管理员联系!(1)');
                scope.ct && (scope.ct.loading = false);
                return;
              }
            }
          });
        }, 300);

        fg = new L.SvFeatureGroup({
          onLoad:function(){
            var layer = this;

            scope.data.MeasurePoints.forEach(function (point) {
              var geo = JSON.parse(point.Geometry),
                v = scope.data.MeasureValues.find(function (value) {
                  return value.MeasurePointID == point.MeasurePointID;
                });
              if(v) {
                if(geo.geometry.type=='Stamp' && !v.MeasureValue && v.MeasureValue!==0)return;
                if(!v.ExtendedField1 && v.DesignValue){
                  v.ExtendedField1 = v.MeasureValue+','+v.DesignValue;
                }

                v.MeasureValue=!v.MeasureValue?"0":v.MeasureValue;
                geo.options.MeasureValue = v.MeasureValue;
                geo.options.ExtendedField1 = v.ExtendedField1;
                geo.options.seq = v.MeasureValue;
                geo.options.customSeq = true;
                switch(v.MeasureStatus) {
                  case 1:
                    //geo.options.
                    geo.options.color = 'black';
                    break;
                  case 2:
                    geo.options.color = '#eb7400';
                    break;
                }
                layer.addData(geo);
              }
              else if(geo.geometry.type=='Stamp'){
                layer.addData(geo);
              }
            });
            layer.eachLayer(function (layer) {
              if(layer.options.MeasureValue || layer.options.MeasureValue===0) {
                //layer.updateValue({seq: ''+layer.options.MeasureValue});
                layer.on('mouseover',function (e) {
                  if(!layer.popup) {
                    layer.popup = L.popup({
                        closeButton: false
                      })
                      .setLatLng(layer._latlng)
                      .setContent('<div style="text-align:center">' + (layer.options.ExtendedField1 ||layer.options.MeasureValue)+'</div>')
                      .openOn(map._map);
                  }
                  else if(!layer.popup._isOpen){
                    layer.popup.openOn(map._map)
                  }
                });
                layer.on('mouseout',function () {
                  map._map.closePopup(layer.popup);
                })
              }
            })
          }
        }).addTo(map._map);
      };
      $timeout(function(){
        scope.$watch('data',function(){
          install();
        });
      },500);
    }
  }


})();
