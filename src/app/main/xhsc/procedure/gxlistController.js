/**
 * Created by emma on 2016/6/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxlistController',gxlistController);

  /**@ngInject*/
  function gxlistController($scope,remote,$stateParams){
    var vm=this;
    vm.projectId = $stateParams.projectId;
    remote.Assessment.queryProcedure().then(function(result){
     // console.log(result);
      //vm.procedureData = result.data;
      vm.procedureData = [];
      result.data.forEach(function(it){
        for(var i=0;i<it.SpecialtyChildren.length;i++){
          if(it.SpecialtyChildren[i].WPAcceptanceList.length){
            vm.procedureData.push(it);
            break;
          }
        }
      })
     console.log('vm',vm.procedureData)
    })
    //vm.procedureData = [{
    //  procedureName:'机电1',
    //  children:[{
    //    name:'消防',
    //    procedureCh:[{
    //      name:'铝合金1'
    //    },{
    //      name:'铝合金2'
    //    },{
    //      name:'铝合金2'
    //    },{
    //      name:'铝合金2'
    //    },{
    //      name:'铝合金2'
    //    },{
    //      name:'铝合金2'
    //    },{
    //      name:'铝合金2'
    //    },{
    //      name:'铝合金2'
    //    },{
    //      name:'铝合金2'
    //    },{
    //      name:'铝合金2'
    //    },{
    //      name:'铝合金2'
    //    },{
    //      name:'铝合金2'
    //    }]
    //  },{
    //    name:'空调',
    //    procedureCh:[{
    //      name:'空调1'
    //    },{
    //      name:'空调2'
    //    },{
    //      name:'空调2'
    //    },{
    //      name:'空调2'
    //    },{
    //      name:'空调2'
    //    },{
    //      name:'空调2'
    //    }]
    //  },{
    //    name:'弱电',
    //    procedureCh:[{
    //      name:'空调1'
    //    },{
    //      name:'空调2'
    //    }]
    //  }]
    //},{
    //  procedureName:'土建',
    //  children:[{
    //    name:'幕墙',
    //    procedureCh:[{
    //      name:'空调1'
    //    },{
    //      name:'空调2'
    //    }]
    //  },{
    //    name:'钢筋',
    //    procedureCh:[{
    //      name:'空调1'
    //    },{
    //      name:'空调2'
    //    }]
    //  },{
    //    name:'栏杆',
    //    procedureCh:[{
    //      name:'空调1'
    //    },{
    //      name:'空调2'
    //    }]
    //  }]
    //},{
    //  procedureName:'土建',
    //  children:[{
    //    name:'幕墙',
    //    procedureCh:[{
    //      name:'空调1'
    //    },{
    //      name:'空调2'
    //    }]
    //  },{
    //    name:'钢筋',
    //    procedureCh:[{
    //      name:'空调1'
    //    },{
    //      name:'空调2'
    //    }]
    //  },{
    //    name:'栏杆',
    //    procedureCh:[{
    //      name:'空调1'
    //    },{
    //      name:'空调2'
    //    }]
    //  }]
    //},{
    //  procedureName:'土建',
    //  children:[{
    //    name:'幕墙',
    //    procedureCh:[{
    //      name:'空调1'
    //    },{
    //      name:'空调2'
    //    }]
    //  },{
    //    name:'钢筋',
    //    procedureCh:[{
    //      name:'空调1'
    //    },{
    //      name:'空调2'
    //    }]
    //  },{
    //    name:'栏杆',
    //    procedureCh:[{
    //      name:'空调1'
    //    },{
    //      name:'空调2'
    //    }]
    //  }]
    //},{
    //  procedureName:'土建',
    //  children:[{
    //    name:'幕墙',
    //    procedureCh:[{
    //      name:'空调1'
    //    },{
    //      name:'空调2'
    //    }]
    //  },{
    //    name:'钢筋',
    //    procedureCh:[{
    //      name:'空调1'
    //    },{
    //      name:'空调2'
    //    }]
    //  },{
    //    name:'栏杆',
    //    procedureCh:[{
    //      name:'空调1'
    //    },{
    //      name:'空调2'
    //    }]
    //  }]
    //},{
    //  procedureName:'土建',
    //  children:[{
    //    name:'幕墙',
    //    procedureCh:[{
    //      name:'空调1'
    //    },{
    //      name:'空调2'
    //    }]
    //  },{
    //    name:'钢筋',
    //    procedureCh:[{
    //      name:'空调1'
    //    },{
    //      name:'空调2'
    //    }]
    //  },{
    //    name:'栏杆',
    //    procedureCh:[{
    //      name:'空调1'
    //    },{
    //      name:'空调2'
    //    }]
    //  }]
    //},{
    //  procedureName:'土建',
    //  children:[{
    //    name:'幕墙',
    //    procedureCh:[{
    //      name:'空调1'
    //    },{
    //      name:'空调2'
    //    }]
    //  },{
    //    name:'钢筋',
    //    procedureCh:[{
    //      name:'空调1'
    //    },{
    //      name:'空调2'
    //    }]
    //  },{
    //    name:'栏杆',
    //    procedureCh:[{
    //      name:'空调1'
    //    },{
    //      name:'空调2'
    //    }]
    //  }]
    //},{
    //  procedureName:'土建',
    //  children:[{
    //    name:'幕墙',
    //    procedureCh:[{
    //      name:'空调1'
    //    },{
    //      name:'空调2'
    //    }]
    //  },{
    //    name:'钢筋',
    //    procedureCh:[{
    //      name:'空调1'
    //    },{
    //      name:'空调2'
    //    }]
    //  },{
    //    name:'栏杆',
    //    procedureCh:[{
    //      name:'空调1'
    //    },{
    //      name:'空调2'
    //    }]
    //  }]
    //}]
  }
})();
