/**
 * Created by emma on 2016/6/25.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('sxtAreaShow',sxtAreaShowDirective);

  /**@ngInject*/
  function sxtAreaShowDirective($timeout,remote,$rootScope,$state){
    return {
      scope:{
        projectId:'=',
        projectName:'='
      },
      link:link
    }
    function link(scope,element,attr,ctrl){
      var map,layer,dlg;
      var ran = function(){
        $timeout(function(){
          if(!scope.projectId) return;
          if (map && map.projectId == scope.projectId) return;
          if (map) map.remove();
          remote.Assessment.EngineeringProcess.getWorkingMap(scope.projectId).then(function(result){
            var project = result.data;
            //console.log('project',result.data)
            if(project.AreaImage){
              remote.Assessment.EngineeringProcess.getWorkingMapDetail(project.AreaImage).then(function(fs){
                if (fs.data.Files.length == 0) return;
                map = L.map(element[0], {
                  crs: L.extend({}, L.CRS, {
                    projection: L.Projection.LonLat,
                    transformation: new L.Transformation(1, 0, 1, 0),
                    scale: function (e) {
                      return 256 * Math.pow(2, e);
                    }
                  }),
                  center: [.48531902026005, .5],
                  zoom: 0,
                  minZoom: 0,
                  maxZoom: 3,
                  scrollWheelZoom: true,
                  annotationBar: false,
                  attributionControl: false
                }),
                  layer = L.tileLayer(sxt.app.api + '/api/picMap/load/{z}_{x}_{y}.png?size=256&path='+fs.data.Files[0].Url.replace('/s_', '/'), {
                    noWrap:true,
                    continuousWorld:false,
                    tileSize:256
                  });
                //console.log('picUrl',scope.picUrl)
                map.projectId = scope.projectId;
                layer.addTo(map);
                var feature = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[0.5732421875,0.4951171875]},"options":{"icon":{"options":{"className":"","shadowUrl":null,"iconAnchor":[15,15],"iconSize":[30,30],"iconUrl":"/dp/libs/leaflet/images/photo.png","color":"#ff0000"},"_initHooksCalled":true},"title":"","alt":"","clickable":true,"draggable":false,"keyboard":true,"zIndexOffset":0,"opacity":1,"riseOnHover":false,"riseOffset":250,"gid":"e5bf57b4-7d71-4161-9b4f-c460766e7398"}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[0.21875,0.49609375]},"options":{"icon":{"options":{"className":"","shadowUrl":null,"iconAnchor":[15,15],"iconSize":[30,30],"iconUrl":"/dp/libs/leaflet/images/photo.png","color":"#ff0000"},"_initHooksCalled":true},"title":"","alt":"","clickable":true,"draggable":false,"keyboard":true,"zIndexOffset":0,"opacity":1,"riseOnHover":false,"riseOffset":250,"gid":"0f8696fa-f1e7-4f08-be50-5228eaddf32f"}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[0.3975830078125,0.3734130859375]},"options":{"icon":{"options":{"className":"leaflet-div-label","html":"万科时代广场一期","color":"#ff0000"},"_initHooksCalled":true,"_div":{"_leaflet_pos":{"x":568,"y":193}}},"title":"","alt":"","clickable":true,"draggable":true,"keyboard":true,"zIndexOffset":1000,"opacity":1,"riseOnHover":false,"riseOffset":250,"saved":false}},{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[0.15966796875,0.338623046875],[0.2236328125,0.338134765625],[0.223388671875,0.347412109375],[0.22314453125,0.353759765625],[0.2236328125,0.357666015625],[0.22607421875,0.364501953125],[0.231201171875,0.3740234375],[0.2392578125,0.380126953125],[0.24462890625,0.382568359375],[0.249755859375,0.384033203125],[0.255615234375,0.384521484375],[0.264404296875,0.3837890625],[0.2705078125,0.381591796875],[0.27978515625,0.375],[0.28466796875,0.3662109375],[0.2880859375,0.35693359375],[0.2890625,0.35107421875],[0.28759765625,0.3447265625],[0.2880859375,0.3388671875],[0.35107421875,0.3388671875],[0.35205078125,0.370361328125],[0.365966796875,0.37060546875],[0.375244140625,0.361328125],[0.41552734375,0.36083984375],[0.439697265625,0.3505859375],[0.56591796875,0.21533203125],[0.56591796875,0.2001953125],[0.61474609375,0.199951171875],[0.635498046875,0.218994140625],[0.330078125,0.541015625],[0.2822265625,0.546875],[0.16015625,0.5234375],[0.15966796875,0.338623046875]]]},"options":{"stroke":true,"color":"#ff0000","dashArray":null,"lineCap":null,"lineJoin":null,"weight":4,"opacity":0.5,"fill":true,"fillColor":null,"fillOpacity":0.2,"clickable":true,"smoothFactor":1,"noClip":false,"itemId":"5514f7a571fe65ac066cb091","itemName":"万科时代广场一期","areaLabel":{"text":"万科时代广场一期","id":"5514f7a571fe65ac066cb091","lat":0.3734130859375,"lng":0.3975830078125}}}]};

                L.geoJson(feature).addTo(map);
                $(element).click(function(){
                  $state.go('app.xhsc.xxjd.xxjdbuildings',{projectId:scope.projectId,projectName:scope.projectName})
                })
               // var apiLayer = L.GeoJSON.api({
               //   get: function (cb) {
               //     scope.groups =null;
               //     if (project.AreaRemark) {
               //       try {
               //         var d = project.AreaRemark;
               //         cb(d);
               //         if (d.features.length) {
               //           var g = [];
               //           d.features.forEach(function (f) {
               //             if (f.options.gid && g.find(function(a){return a ==f.options.gid;})==null) {
               //               g.push (f.options.gid);
               //             }
               //             if(f.options.icon && f.options.icon.options && f.options.icon.options.iconUrl){
               //               f.options.icon.options.iconUrl = f.options.icon.options.iconUrl.replace('/dp/libs/','assets/')
               //             }
               //           });
               //           if (g.length) {
               //             scope.groups = g;
               //           }
               //           scope.$watch('scope.groups',function(){
               //             //console.log('change',scope.groups)
               //             $rootScope.temp = scope.groups;
               //           })
               //         }
               //       }
               //       catch (ex) {
               //         cb();
               //       }
               //     }
               //     else {
               //       cb();
               //     }
               //   },
               //   post: function (data, cb) {
               //     project.AreaRemark = JSON.stringify(data);
               //     //api.szgc.ProjectExService.update(project).then(function () {
               //     //  cb();
               //     //});
               //   },
               //   click: function (layer, cb) {
               //     if (layer.editing && layer.editing._enabled) return;
               //     {
               //       if (layer._icon) {
               //         if (layer.options.gid) {
               //           $rootScope.$emit('sxtImageView', {
               //             groups: [layer.options.gid]
               //           });
               //         }
               //         else {
               //           utils.alert('此摄像头未上传现场照片')
               //         }
               //       }
               //       else {
               //         $state.go('app.xhsc.xxjdmain.xxjdbuildings') //, { itemId: layer.options.itemId, itemName: layer.options.itemName, projectType: 2 }
               //       }
               //     }
               //
               //   }
               // }).addTo(map);
              })
            }

          })
        },1000)
      }
      scope.$watch('projectId',ran);
      scope.$on('$destory',function(){

      })
    }
  }
})();
