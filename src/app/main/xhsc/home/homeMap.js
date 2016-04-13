/**
 * Created by emma on 2016/3/31.
 */
(function(){
  angular
    .module('app.xhsc')
    .directive('homeMap',homeMap);

  /** @Inject */
  function homeMap($timeout,mapPopupSerivce){
    return {
      link:link
    }

    function  link(scope,element,attr,ctrl){
      $timeout(function(){

        var options = {
          onUpdate:function(layer,isNew){
            if(isNew && layer instanceof L.Stamp){
              var i=0;
              this.eachLayer(function(layer){
                if(layer instanceof L.Stamp){
                  i++;
                }
              });
              layer.updateValue({
                seq:i
              });
            }
            console.log('update',layer.toGeoJSON());
          }
        },project = new L.SXT.Project(element[0],{
          map:{
            map:{}
          },
          tileLayers:{
            base: {
              url: 'http://vkde.sxtsoft.com/upload/hx_tile_{z}_{x}_{y}.png'
            }
          },
          featureGroups:{
            sc:{
              options:options,
              toolbar:{
                group:{
                  //areaGroup:false
                }
              }
            }
          }
        });
        project._map.openPopup(mapPopupSerivce.get('p3').el[0],[0.3,0.2],{
          maxWidth:300
        })
        //var draggable = new L.Draggable("<div>aaaaa</div>");
        //draggable.enable();
      },2000);
    }
  }
})();
