/**
 * Created by Corning on 16/11/15.
 */
(function ()
{
  'use strict';

  angular
    .module('app.core')
    .controller('msAreaSelectController', msAreaSelectController)
    .directive('msAreaSelect', msAreaSelectDirective);


  /** @ngInject */
  // function msAreaSelectController($scope,remote,xhscService){
  //
  //   //隐藏与显示列表
  //   function toggleList(isShow) {
  //       !!isShow
  //       ?
  //       (function () {
  //         $('.md-area-select .md-area-select-content').fadeOut();
  //       }())
  //       :
  //       (function () {
  //         $('.md-area-select .md-area-select-content').fadeIn();
  //       }());
  //   }
  //
  //   //由RegionID得到子级列表
  //   function getItems(RegionID,isRoot) {
  //     var res=[],
  //       rt=$scope.resultTree||[];
  //
  //     angular.forEach(rt,function (v,i) {
  //       if(!!isRoot){
  //         if(!v.ParentID){
  //           res.push(v);
  //         }
  //       }else{
  //         if(v.ParentID&&v.ParentID===RegionID){
  //           res.push(v);
  //         }
  //       }
  //     });
  //
  //     return res;
  //   }
  //
  //   /* 远程获取数据 */
  //   remote.Project.getRegionWithRight_wrap("", 31,"msAreaRegions").then(function(r){
  //     var data=r.data&&r.data.data?r.data.data:[];
  //     if (data.length == 0) {
  //       return;
  //     }
  //
  //     $scope.resultTree=data;
  //     $scope.showAreaData();
  //     //第一次加载把工序数据加载出来
  //     remote.Procedure.queryProcedure().then(function(result){
  //       $scope.procedureTree=result.data||[];
  //     });
  //
  //   });
  //
  //   /* Region */
  //   $scope.SelectedRegion=null;
  //
  //   /* Procedure */
  //   $scope.SelectedProcedure=null;
  //
  //   /* 初始化数据变量 */
  //   $scope.areaData={
  //     type:'area',//当前列表的数据类型
  //     selectedItems:[null,null],//选中的数据
  //     initText:'区域',//初始化时的文本值
  //     showText:'',//选中时展示的文本
  //     flexes:[50,50,0],//每列布局数值
  //     lever:1//有多少显示的列与flexes数值有关
  //   };
  //
  //   $scope.showAreaData=function(){
  //     $scope.itemAList=getItems(null,true);
  //     var secItem=$scope.areaData.selectedItems[0]||$scope.itemAList[0];
  //     $scope.areaData.selectedItems[0]=secItem;
  //     $scope.itemBList=getItems(secItem.RegionID);
  //     $scope.itemCList=[];
  //     $scope.flexes=[50,50,0];
  //     $scope.currentType='area';
  //
  //   };
  //
  //   $scope.departmentData={
  //     type:'department',
  //     selectedItems:[null,null,null],
  //     initText:'部位',
  //     showText:'',
  //     flexes:[25,25,50],
  //     lever:2
  //   };
  //
  //   $scope.showDepartmentData=function () {
  //
  //     $scope.itemAList=getItems($scope.areaData.selectedItems[1].RegionID);
  //
  //     var secAItem=$scope.departmentData.selectedItems[0]||$scope.itemAList[0];
  //     $scope.departmentData.selectedItems[0]=secAItem;
  //
  //     $scope.itemBList=getItems(secAItem.RegionID);
  //
  //     var secBItem=$scope.departmentData.selectedItems[1]||$scope.itemBList[0];
  //     $scope.departmentData.selectedItems[1]=secBItem;
  //
  //     $scope.flexes=[25,25,50];
  //     $scope.currentType='department';
  //     getOtherRegionList($scope.departmentData,1);
  //
  //   };
  //
  //   $scope.procedureData={
  //     type:'procedure',
  //     selectedItems:[null,null,null],
  //     initText:'工序',
  //     showText:'',
  //     flexes:[25,25,50],
  //     lever:2
  //   };
  //
  //   $scope.showProcedureData=function () {
  //     //debugger
  //     $scope.itemAList=$scope.procedureTree;
  //
  //     var secAItem=$scope.procedureData.selectedItems[0]||$scope.itemAList[0];
  //     $scope.procedureData.selectedItems[0]=secAItem;
  //
  //     $scope.itemBList=secAItem['SpecialtyChildren'];
  //
  //     var secBItem=$scope.procedureData.selectedItems[1]||$scope.itemBList[0]||[];
  //
  //     $scope.itemCList=secBItem['WPAcceptanceList'];
  //
  //     $scope.flexes=[50,50,0];
  //     $scope.currentType='procedure';
  //
  //   };
  //
  //   //每列数据及布局的数值
  //   $scope.flexes=[50,50,0];
  //   //当前选中哪种数据类型
  //   $scope.currentType=$scope.areaData.type||'area';
  //   //每列数据值 分a b c三列
  //   $scope.itemAList=[];
  //   $scope.itemBList=[];
  //   $scope.itemCList=[];
  //   //每列选中的项添加选中class值
  //   $scope.getCurrentSelectedItem=function (flexIndex,listItem) {
  //     var resItem={};
  //     switch($scope.currentType){
  //       case 'area':
  //         resItem=$scope.areaData.selectedItems[flexIndex];
  //         break;
  //       case 'department':
  //         resItem=$scope.departmentData.selectedItems[flexIndex];
  //         break;
  //       case 'procedure':
  //         resItem=$scope.procedureData.selectedItems[flexIndex];
  //         break;
  //     }
  //     if(
  //       resItem&&listItem&&
  //       (resItem.RegionUnSelected||resItem.RegionID&&(resItem.RegionID===listItem.RegionID)
  //       ||
  //       (resItem.SpecialtyID&&(resItem.SpecialtyID===listItem.SpecialtyID))
  //         ||
  //       (resItem.AcceptanceItemID&&(resItem.AcceptanceItemID===listItem.AcceptanceItemID))
  //       )
  //     ){
  //       return 'selected';
  //     }else{
  //       return ''
  //     }
  //   };
  //
  //   /* 点击下拉列表 */
  //   $scope.clickDrownList=function(e,type,i){
  //
  //     if(!type)
  //       return false;
  //     //如果前面的最后一项没有选中值，则不做任何操作
  //     var typeArray=['areaData','departmentData','procedureData'];
  //     if(i>0){
  //       var preVal=$scope[typeArray[i-1]];
  //       if(!preVal['selectedItems'][preVal['lever']]){
  //         return false;
  //       }
  //     }
  //
  //     var selectedElement=$(e.target);
  //
  //     if(selectedElement.length>0){
  //
  //       var hasClass=selectedElement.hasClass('on');
  //       selectedElement.parents('.md-area-select-top').find('.md-select-value').removeClass('on');
  //
  //       if(hasClass){
  //         selectedElement.removeClass('on');
  //       }else{
  //         selectedElement.addClass('on');
  //       }
  //
  //       var dataArrNames=['showAreaData','showDepartmentData','showProcedureData'];
  //
  //       toggleList(hasClass);
  //
  //       $scope[dataArrNames[i]]();
  //     }
  //
  //   };
  //
  //   //用递规方法遍历其它列
  //   function getOtherRegionList(typeInstance,flexIndex){
  //     if(flexIndex<typeInstance.lever){
  //       var listName=['itemAList','itemBList','itemCList'];
  //       var Children=getItems(typeInstance['selectedItems'][flexIndex].RegionID)||[];
  //       var firstChildren=[];
  //       if(flexIndex==1&&$scope.currentType==='department'){
  //         firstChildren.push({
  //           Children:null,
  //           ParentID:null,
  //           RegionID:null,
  //           RegionName:'不到户',
  //           RegionType:null,
  //           RegionUnSelected:true
  //         });
  //       }
  //
  //       $scope[listName[flexIndex+1]]=firstChildren.concat(Children);
  //
  //       if(flexIndex+1<typeInstance.lever){
  //         typeInstance['selectedItems'][flexIndex+1]=$scope[listName[flexIndex+1]][0];
  //       }
  //
  //       getOtherRegionList(typeInstance,flexIndex+1);
  //
  //     }
  //
  //   }
  //
  //   //选中项的触发方法
  //   function selectedRegionListItem(e,listItem, flexIndex) {
  //     function combineName(data) {
  //       var res='';
  //       angular.forEach(data.selectedItems,function (v,i){
  //         res+=(v.RegionName||v.SpecialtyName||v.AcceptanceItemName);
  //         res+='->';
  //       });
  //       return res.replace(/\->$/,'');
  //     }
  //
  //     var currData=$scope[$scope.currentType+'Data'];
  //     currData['selectedItems'][flexIndex]=listItem;
  //
  //     if($scope.currentType==='procedure'){
  //
  //       if(flexIndex==0){
  //
  //         $scope.itemBList=$scope.procedureData.selectedItems[0]['SpecialtyChildren']||[];
  //         $scope.itemCList=[];
  //         $scope.flexes=[50,50,0];
  //
  //       }else if(flexIndex==1){
  //
  //         var selB=$scope.procedureData.selectedItems[1]||{};
  //         $scope.itemCList=selB['WPAcceptanceList']||[];
  //         if($scope.itemCList.length>0){
  //           $scope.flexes=[25,25,50];
  //         }else{
  //           $scope.SelectedProcedure=selB;
  //           $scope.flexes=[50,50,0];
  //           toggleList(true);//隐藏列表
  //         }
  //       }else{
  //         $scope.SelectedProcedure=$scope.procedureData.selectedItems[2];
  //         toggleList(true);//隐藏列表
  //       }
  //       //console.log($scope.SelectedProcedure);
  //       return false;
  //     }
  //
  //     //进入部门选择
  //     getOtherRegionList(currData,flexIndex);
  //
  //     if(currData['lever']===flexIndex){
  //
  //       var arrNames=['showAreaData','showDepartmentData','showProcedureData'];
  //
  //       var arrIndex={
  //         area:0,
  //         department:1,
  //         procedure:2
  //       };
  //
  //       currData.showText=combineName(currData);
  //
  //       var i=arrIndex[$scope.currentType];
  //
  //       $(e.target)
  //         .parents('.md-area-select')
  //         .find('.md-select-value')
  //         .eq(i)
  //         .addClass('selected');
  //
  //       $(e.target)
  //         .parents('.md-area-select')
  //         .find('.md-select-value')
  //         .removeClass('on')
  //         .eq(i+1)
  //         .addClass('on');
  //
  //       if(i===0){//选中区域项的最后一个
  //
  //       }else if(i===1){//选中部门项的最后一个
  //         var selectedRegion=$scope.departmentData['selectedItems'][2];
  //         $scope.SelectedRegion=(!!selectedRegion['RegionID'])?selectedRegion:$scope.departmentData['selectedItems'][1];
  //         //console.log($scope.SelectedRegion);
  //       }
  //
  //       $scope[arrNames[i+1]]();
  //
  //
  //     }
  //
  //   }
  //
  //   /* selectRegionItems */
  //   $scope.selectRegionItems=function (e,listItem,flexIndex) {
  //     var currentItem=$(e.target);
  //     if(currentItem.length>0){
  //       //如果已经选中
  //       if(currentItem.hasClass('selected')){
  //         return false;
  //       }
  //       selectedRegionListItem(e,listItem,flexIndex);
  //     }
  //   };
  //
  // }

  function msAreaSelectController($scope,remote,xhscService){

    //隐藏与显示列表
    function toggleList(isShow) {
      !!isShow
        ?
        (function () {
          $('.md-area-select .md-area-select-content').fadeOut();
        }())
        :
        (function () {
          $('.md-area-select .md-area-select-content').fadeIn();
        }());
    }

    //由RegionID得到子级列表
    function getItems(RegionID,isRoot) {
      var res=[],
        rt=$scope.resultTree||[];

      angular.forEach(rt,function (v,i) {
        if(!!isRoot){
          if(!v.ParentID){
            res.push(v);
          }
        }else{
          if(v.ParentID&&v.ParentID===RegionID){
            res.push(v);
          }
        }
      });

      return res;
    }

    /* 远程获取数据 */
    remote.Project.getRegionWithRight_wrap("", 31,"msAreaRegions").then(function(r){
      var data=r.data&&r.data.data?r.data.data:[];
      if (data.length == 0) {
        return;
      }

      $scope.resultTree=data;
      $scope.showAreaData();
      //第一次加载把工序数据加载出来
      remote.Procedure.queryProcedure().then(function(result){
        $scope.procedureTree=result.data||[];
      });

    });

    /* Region */
    $scope.SelectedRegion=null;

    /* Procedure */
    $scope.SelectedProcedure=null;

    /* 初始化数据变量 */
    $scope.areaData={
      type:'area',//当前列表的数据类型
      selectedItems:[null,null],//选中的数据
      initText:'区域',//初始化时的文本值
      showText:'',//选中时展示的文本
      flexes:[50,50,0],//每列布局数值
      lever:1//有多少显示的列与flexes数值有关
    };

    $scope.showAreaData=function(){
      $scope.itemAList=getItems(null,true);
      var secItem=$scope.areaData.selectedItems[0]||$scope.itemAList[0];
      $scope.areaData.selectedItems[0]=secItem;
      $scope.itemBList=getItems(secItem.RegionID);
      $scope.itemCList=[];
      $scope.flexes=[50,50,0];
      $scope.currentType='area';

    };

    $scope.departmentData={
      type:'department',
      selectedItems:[null,null,null],
      initText:'部位',
      showText:'',
      flexes:[25,25,50],
      lever:2
    };

    $scope.showDepartmentData=function () {

      $scope.itemAList=getItems($scope.areaData.selectedItems[1].RegionID);

      var secAItem=$scope.departmentData.selectedItems[0]||$scope.itemAList[0];
      $scope.departmentData.selectedItems[0]=secAItem;

      $scope.itemBList=getItems(secAItem.RegionID);

      var secBItem=$scope.departmentData.selectedItems[1]||$scope.itemBList[0];
      $scope.departmentData.selectedItems[1]=secBItem;

      $scope.flexes=[25,25,50];
      $scope.currentType='department';
      getOtherRegionList($scope.departmentData,1);

    };

    $scope.procedureData={
      type:'procedure',
      selectedItems:[null,null,null],
      initText:'工序',
      showText:'',
      flexes:[25,25,50],
      lever:2
    };

    $scope.showProcedureData=function () {
      //debugger
      $scope.itemAList=$scope.procedureTree;

      var secAItem=$scope.procedureData.selectedItems[0]||$scope.itemAList[0];
      $scope.procedureData.selectedItems[0]=secAItem;

      $scope.itemBList=secAItem['SpecialtyChildren'];

      var secBItem=$scope.procedureData.selectedItems[1]||$scope.itemBList[0]||[];

      $scope.itemCList=secBItem['WPAcceptanceList'];

      $scope.flexes=[50,50,0];
      $scope.currentType='procedure';

    };

    //每列数据及布局的数值
    $scope.flexes=[50,50,0];
    //当前选中哪种数据类型
    $scope.currentType=$scope.areaData.type||'area';
    //每列数据值 分a b c三列
    $scope.itemAList=[];
    $scope.itemBList=[];
    $scope.itemCList=[];
    //每列选中的项添加选中class值
    $scope.getCurrentSelectedItem=function (flexIndex,listItem) {
      var resItem={};
      switch($scope.currentType){
        case 'area':
          resItem=$scope.areaData.selectedItems[flexIndex];
          break;
        case 'department':
          resItem=$scope.departmentData.selectedItems[flexIndex];
          break;
        case 'procedure':
          resItem=$scope.procedureData.selectedItems[flexIndex];
          break;
      }
      if(
        resItem&&listItem&&
        (resItem.RegionUnSelected||resItem.RegionID&&(resItem.RegionID===listItem.RegionID)
          ||
          (resItem.SpecialtyID&&(resItem.SpecialtyID===listItem.SpecialtyID))
          ||
          (resItem.AcceptanceItemID&&(resItem.AcceptanceItemID===listItem.AcceptanceItemID))
        )
      ){
        return 'selected';
      }else{
        return ''
      }
    };

    /* 点击下拉列表 */
    $scope.clickDrownList=function(e,type,i){

      if(!type)
        return false;
      //如果前面的最后一项没有选中值，则不做任何操作
      var typeArray=['areaData','departmentData','procedureData'];
      if(i>0){
        var preVal=$scope[typeArray[i-1]];
        if(!preVal['selectedItems'][preVal['lever']]){
          return false;
        }
      }

      var selectedElement=$(e.target);

      if(selectedElement.length>0){

        var hasClass=selectedElement.hasClass('on');
        selectedElement.parents('.md-area-select-top').find('.md-select-value').removeClass('on');

        if(hasClass){
          selectedElement.removeClass('on');
        }else{
          selectedElement.addClass('on');
        }

        var dataArrNames=['showAreaData','showDepartmentData','showProcedureData'];

        toggleList(hasClass);

        $scope[dataArrNames[i]]();
      }

    };

    //用递规方法遍历其它列
    function getOtherRegionList(typeInstance,flexIndex){
      if(flexIndex<typeInstance.lever){
        var listName=['itemAList','itemBList','itemCList'];
        var Children=getItems(typeInstance['selectedItems'][flexIndex].RegionID)||[];
        var firstChildren=[];
        if(flexIndex==1&&$scope.currentType==='department'){
          firstChildren.push({
            Children:null,
            ParentID:null,
            RegionID:null,
            RegionName:'不到户',
            RegionType:null,
            RegionUnSelected:true
          });
        }

        $scope[listName[flexIndex+1]]=firstChildren.concat(Children);

        if(flexIndex+1<typeInstance.lever){
          typeInstance['selectedItems'][flexIndex+1]=$scope[listName[flexIndex+1]][0];
        }

        getOtherRegionList(typeInstance,flexIndex+1);

      }

    }

    //选中项的触发方法
    function selectedRegionListItem(e,listItem, flexIndex) {
      function combineName(data) {
        var res='';
        angular.forEach(data.selectedItems,function (v,i){
          res+=(v.RegionName||v.SpecialtyName||v.AcceptanceItemName);
          res+='->';
        });
        return res.replace(/\->$/,'');
      }

      var currData=$scope[$scope.currentType+'Data'];
      currData['selectedItems'][flexIndex]=listItem;

      if($scope.currentType==='procedure'){

        if(flexIndex==0){

          $scope.itemBList=$scope.procedureData.selectedItems[0]['SpecialtyChildren']||[];
          $scope.itemCList=[];
          $scope.flexes=[50,50,0];

        }else if(flexIndex==1){

          var selB=$scope.procedureData.selectedItems[1]||{};
          $scope.itemCList=selB['WPAcceptanceList']||[];
          if($scope.itemCList.length>0){
            $scope.flexes=[25,25,50];
          }else{
            $scope.SelectedProcedure=selB;
            $scope.flexes=[50,50,0];
            toggleList(true);//隐藏列表
          }
        }else{
          $scope.SelectedProcedure=$scope.procedureData.selectedItems[2];
          toggleList(true);//隐藏列表
        }
        //console.log($scope.SelectedProcedure);
        return false;
      }

      //进入部门选择
      getOtherRegionList(currData,flexIndex);

      if(currData['lever']===flexIndex){

        var arrNames=['showAreaData','showDepartmentData','showProcedureData'];

        var arrIndex={
          area:0,
          department:1,
          procedure:2
        };

        currData.showText=combineName(currData);

        var i=arrIndex[$scope.currentType];

        $(e.target)
          .parents('.md-area-select')
          .find('.md-select-value')
          .eq(i)
          .addClass('selected');

        $(e.target)
          .parents('.md-area-select')
          .find('.md-select-value')
          .removeClass('on')
          .eq(i+1)
          .addClass('on');

        if(i===0){//选中区域项的最后一个

        }else if(i===1){//选中部门项的最后一个
          var selectedRegion=$scope.departmentData['selectedItems'][2];
          $scope.SelectedRegion=(!!selectedRegion['RegionID'])?selectedRegion:$scope.departmentData['selectedItems'][1];
          //console.log($scope.SelectedRegion);
        }

        $scope[arrNames[i+1]]();


      }

    }

    /* selectRegionItems */
    $scope.selectRegionItems=function (e,listItem,flexIndex) {
      var currentItem=$(e.target);
      if(currentItem.length>0){
        //如果已经选中
        if(currentItem.hasClass('selected')){
          return false;
        }
        selectedRegionListItem(e,listItem,flexIndex);
      }
    };

  }




  /** @ngInject */
  function msAreaSelectDirective()
  {
    return {
      restrict: 'E',
      scope:{
        dataList2:'='
      },
      templateUrl: 'app/core/directives/ms-area-select/ms-area-select.html',
      compile : function (tElement) {

      },
      controller:'msAreaSelectController',
      link:function ($scope,element,attr,ctrl) {

      }
    };
  }
})();
