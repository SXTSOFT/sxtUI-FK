(function(angular){
  'use strict';

  angular
    .module('app.szgc')
    .controller('HomeZjController', HomeYjController);

  /** @ngInject */
  function HomeYjController(zj,$q,api,$scope)
  {
    var vm = this;
    vm.isE = function (b) {
      return !vm.areas ||( b?vm.yj==vm.areas[0]:vm.yj==vm.areas[vm.areas.length-1]);
    };
    vm.next = function (b) {
      var n= vm.areas.indexOf(vm.yj);
      if(n!=-1){
        if(b)
          vm.setYj(vm.areas[n+1]);
        else
          vm.setYj(vm.areas[n-1]);
      }
    };
    vm.setP = function (p) {
      vm.currentP = p;
      vm.currentD = null;
      vm.filter();
      vm.context.render(vm.yj.items);
      $scope.$apply();
    };
    vm.context = {
      onLayerClick:function (layer) {
        vm.currentD = layer.data;
        vm.filter();
        vm.context.render(vm.yj.items.filter(function (item) {
          return item.Id == layer.data.Id;
        }));
        $scope.$apply();
      },
      onOptions:function (options) {
        var c1 = 'rgba(225,225,225)';
        var rs = vm.rows.filter(function (item) {
          return item.RegionId==options.id;
        });
        if(rs.find(function (item) {
            return !!item.ZbDate && !!item.JLDate;
          })){
          c1 = 'rgb(0,150,136)'
        }
        else if(rs.find(function (item) {
            return !!item.JLDate;
          })){
          c1 = 'rgb(0,195,213)'
        }
        else if(rs.find(function (item) {
            return !!item.ZbDate;
          })){
          c1 = 'rgb(44, 157, 251)'
        }

        options = options||{};
        options.color = c1;
        options.textColor = rs.find(function (item) {
          return item.JLDate && ((item.JLLast!=0 && item.JLLast>=80) ||(item.JLFirst!=0 &&item.JLFirst>=80))
        })?'red':undefined;
        return options;
      }
    };

    $q.all([
      $q(function (r) {
        r({data:{Rows:[zj]}});
      }),
      api.szgc.BatchSetService.getAll({status:4,batchType:256})
    ]).then(function (rs) {
      var r = rs[0];
      vm.ps = rs[1].data.Rows.map(function (item) {
        return {
          id:item.ProcedureId,
          name:item.ProcedureName,
          sortName:item.Remark||item.ProcedureName
        }
      });
      vm.areas = r.data.Rows;
      vm.setYj(vm.areas[0]);
    });
    vm.setYj = function (item) {
      (item.items?$q(function (r) {
        r()
      }):api.szgc.vanke.yj(item.itemId).then(function (r) {
        item.items = r.data.Rows;

      })).then(function () {
        vm.yj = item;
        var yjId = item.itemId.split('>'),
          projectId = yjId[0];
        yjId = yjId[yjId.length - 1];
        $q.all([api.szgc.addProcessService.queryByProjectAndProdure3(projectId,{
          regionIdTree: item.itemId,
          isGetChilde: 1
        }),
          api.szgc.FilesService.group(yjId)]).then(function (rs) {
          vm.results = rs[0].data.Rows;
          vm.filter();
          var fs = rs[1];
          if(fs.data.Files.length==0){
            utils.alert('未设置图纸');
          }
          else{
            vm.context.file = fs.data.Files[0].Url.replace('/s_', '/');
            vm.context.ran();
            vm.context.render(item.items);
            vm.context.resize();
          }
        });
      });

      /*if(!item.items) {
       api.szgc.vanke.yj(item.itemId).then(function (r) {
       item.items = r.data.Rows;
       vm.yj = item;
       });
       }
       else{
       vm.yj = item;
       }*/
    };

    vm.filter = function () {
      vm.rows = vm.results.filter(function (item) {
        return (!vm.currentP || vm.currentP.id==item.ProcedureId)
          &&(!vm.currentD || vm.currentD.Id==item.RegionId)
      })
    }
  }

})(angular);
