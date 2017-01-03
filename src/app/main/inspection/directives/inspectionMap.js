/**
 * Created by jiuyuong on 2016/8/13.
 */
(function () {
  'use strict';
  angular
    .module('app.inspection')
    .directive('inspectionMap',inspectionMap);
  /** @inject */
  function inspectionMap(require,$window,$timeout,api) {
    return {
      scope:{
        mapShow:'=',
        mapUrl:'='
      },
      link:function (scope,el,api) {

        //var L = $window.L;
        require('/assets/res.pbf',function () {
          $timeout(function () {
            var m = window.L.matters({
              map:{
                el:el[0],
                sheet:scope.mapUrl,
                zoomControl:false,
                fullscreenControl:false,
                drawControlTooltips:false,
                toolBar:false
              },
              draw:{
                draw:{
                  tasks: {
                    actions: function () {
                      return [
                        {
                          text: '门',
                          description: '开关不畅、异响'
                        }, {
                          text: '开关',
                          description: '表面污染、破损、刮花'
                        }, {
                          text: '插座',
                          description: '接触不良'
                        }, {
                          text: '管道',
                          description: '管道破损'
                        }, {
                          text: '涂料',
                          description: '分色线不均、咬色'
                        }, {
                          text: '墙面',
                          description: '勾缝污染、发黑'
                        }, {
                          text: '地砖',
                          description: '地砖'
                        }
                      ]
                    }
                  }
                }
              }
            });
            m.on('inited',function () {
              console.log('inited')
            })
            m.on('selected',function (e) {
              console.log('selected',e)
              //scope.$parent.vm.showPopup = true;
              //scope.$apply()
            })
            m.on('click',function (e) {
              if(!scope.$parent.vm.showPopup){
                el.find('.leaflet-pane').css({top:'-60px'})
              }
              scope.$parent.vm.showPopup = true;
              scope.$apply()
            })
            m.on('created',function (e) {
              //console.log('created',e)
              scope.$parent.vm.showPopup = true;
              scope.$apply()
            })
          },1000);
        });
      }
    }

  }
})();

