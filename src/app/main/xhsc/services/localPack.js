/**
 * Created by jiuyuong on 2016/5/5.
 */
(function () {
  'use strict';
  angular
    .module('app.xhsc')
    .factory('localPack', localPack);
  /** @ngInject */
  function localPack(db,$http,$rootScope,$cordovaFileTransfer,sxt,xhUtils,$timeout,$q,api) {

    function Pack(config) {
      var self = this,
        pack = db('pack'+config._id);
      self.pack = pack;
      if(!self.config) {
        pack.getOrAdd(config).then(function (config) {
          self.config = config;
          self.down();
        });
      }
    }
    Pack.prototype.down = function () {
      var self = this;
      if(!self.config || self.isDown)return;
      self.isDown = true;
      self.downTask();
    }
    Pack.prototype.reDown = function () {
      var self = this;
      if(self.config){
        self.config.tasks.forEach(function (item) {
          item.try=0;
          item.completed =false;
        });
        self.down();
      }
    }
    Pack.prototype.downTask = function () {
      var self = this;
      var task = self.config.tasks.find(function (t) {
        return !t.completed && (!t.try || t.try<4);
      });
      if(!task){
        self.isDown = false;
        self.completed = self.getProgress().progress==100;
        $rootScope.$emit('pack' + self.config._id, {
          name: 'allcomplete',
          config: self.config
        });
        return;
      }
      if(task){
        task.try = (task.try||0)+1;
/*        $rootScope.$emit('pack'+self.config._id,{
          name:'begin',
          task:task,
          config:this.config
        });*/
        if(task.type=='ExRegion'){
          task.callback = function (data,config,cb) {
            var gx=[],areas=[];//计算要需要的指标和图纸
            this.item.MeasureItems.forEach(function (m) {
              if(m.AssessmentAreas.length==0)return;

              //TODO: 当前是以项目下载整个测试包，其实可能许多实现项是不需要测试的，数据多余，可以进一步优化
/*              if(!gx.find(function (it) {
                  return it.MeasureItemID==m.MeasureItemID
                })){
                gx.push({
                  MeasureItemID:m.MeasureItemID,
                  MeasureItemName:m.MeasureItemName,
                  TemplateID:m.TemplateID,
                  TemplateName:m.TemplateName
                });
              };*/

              m.AssessmentAreas.forEach(function (a) {
                if(!areas.find(function (it) {
                    return it.RegionID==a.AreaID
                  })){
                  var am = xhUtils.findRegion([data],a.AreaID);
                  //临时测试要去掉
                  //am.DrawingImageUrl='/fs/UploadFiles/Framework/a744a033f5eeec56549c440de2ddfbae.jpg';
                  if(am && am.DrawingImageUrl && !areas.find(function (a) {
                      return a.DrawingImageUrl==am.DrawingImageUrl
                    })) {
                    areas.push({
                      RegionID: am.RegionID,
                      RegionName:am.RegionName,
                      DrawingID:am.DrawingID,
                      DrawingImageUrl:am.DrawingImageUrl,
                      RegionType:am.RegionType
                    });
                  };
                }
              });
            });


/*            gx.forEach(function (g) {
              config.task.push({
                _id:'gx_'+g.MeasureItemID,
                url:sxt.app.api+'/Api/MeasureInfo/GetMeasureItemInfoByAreaID?areaID='+
              })
            });*/
            if(typeof cordova != 'undefined') {
              areas.forEach(function (area) {
                var pics = xhUtils.getMapPic(area.RegionType == 8 ? 4 : 3);
                pics.forEach(function (u) {
                  config.tasks.push({
                    _id: area.RegionID + '_p_' + u,
                    type: 'file',
                    url:sxt.app.fs+'/Api/Picture/Tile/'+u+'?path='+area.DrawingImageUrl + '&name=/' + area.DrawingID +'_'+ u + '.png'
                    //测试数据
                    //url: 'http://ggem.sxtsoft.com:9191/Api/Picture/Tile/' + u + '?path=' + area.DrawingImageUrl + '&name=/' + area.DrawingID + u + '.png'
                  });
                })
              });
            }
            $rootScope.$emit('pack'+self.config._id,{
              name:'taskchanged',
              task:task,
              config:self.config
            });
            cb();
          }
        }
        if(task.type == 'file') {
          try {
            //TODO: 下载的文章与业务ID做为目录，不能共享，需要共享优化
            var rootPath = cordova.file.dataDirectory+ self.config._id+'/',
              names = task.url.split('/'),
              name = names[names.length - 1];
            task.local = rootPath + name;
            $cordovaFileTransfer.download(task.url, task.local)
              .then(function (result) {
                task.completed = true;
                $rootScope.$emit('pack' + self.config._id, {
                  name: 'complete',
                  task: task,
                  config: self.config
                });
                self.downTask();
              }, function (err) {
                task.err = err;
                self.downTask();
              }, function (progress) {

              });
          }catch (ex){
            $rootScope.$emit('pack'+self.config._id,{
              name:'error',
              task:task,
              config:self.config
            });
          }
        }
        else{
          (task.api?task.api():$http.get(sxt.app.api + task.url)).then(function (result) {
            if(task.db){
              var taskDb = db(task.db);
              var updates = [];
              if(task.type=='rows'){
                result.data.forEach(function(row){
                  row._id = row._id||row[task.idField];
                  updates.push(taskDb.addOrUpdate(row));
                });
              }
              else{
                updates.push(taskDb.addOrUpdate(result.data));
              }
              $q.all(updates).then(function (r) {
                $rootScope.$emit('pack'+self.config._id,{
                  name:'complete',
                  task:task,
                  config:self.config
                });
                task.completed = true;
                if(task.callback && task.callback(result.data,self.config,function () {
                    self.downTask();
                  }));
                else
                  self.downTask();

              }).catch(function () {
                self.downTask();
              })

            }
            else{

              self.pack.addOrUpdate({_id:task._id,data:result.data}).then(function () {
                task.completed = true;
                $rootScope.$emit('pack'+self.config._id,{
                  name:'complete',
                  task:task,
                  config:self.config
                });
                if(task.callback && task.callback(result.data,self.config,function () {
                    self.downTask();
                  }));
                else
                  self.downTask();
              }).catch(function () {
                self.downTask();
              })
            }
          })
        }
      }
    }
    Pack.prototype.getProgress = function () {
      var completed = 0, total = this.config.tasks.length;
      this.config.tasks.forEach(function (task) {
        if (task.completed)
          completed++;
      });
      return {
        completed: completed,
        total: total,
        progress: parseInt(completed / total *100)
      }
    }

    var o ={
      packages:{},
      pack:pack,
      unPack:function (id) {
        delete o.packages[id];
      }
    };
    return o;
    function pack(config) {
      //if(!this.packages[config._id]) {
        this.packages[config._id] = new Pack(config);
      //}
      //else{
      //  //this.packages[config._id].isDown=false;
      //  this.packages[config._id].reDown();
      //}
      return  this.packages[config._id];
    }

  }
})();
