/**
 * Created by jiuyuong on 2016/9/22.
 */
(function (angular,undefined) {
  angular
    .module('app.plan')
    .factory('template',template);
  /** @ngInject */
  function template($window) {
    var GitGraph = $window.GitGraph;
    GitGraph.Commit.prototype._render = GitGraph.Commit.prototype.render;
    GitGraph.Commit.prototype.render = function () {
      this._render();
      this.context.fillStyle = 'white';
      if(this.tag) {
        var seq = /\d+/.exec(this.tag)[0]
        this.context.fillText(seq, this.x-(seq.length==1?5:8), this.y+5);
      }
    }
    GitGraph.Branch.prototype.merge = function ( target, commitOptions ) {
      // Merge target
      var targetBranch = target || this.parent.HEAD;

      // Check integrity of target
      if ( targetBranch instanceof GitGraph.Branch === false || targetBranch === this ) {
        return this;
      }
      // Add points to path
      var targetCommit = targetBranch.commits.slice( -1 )[ 0 ];
      var endOfBranch = {
        x: this.offsetX + this.template.commit.spacingX * (targetCommit.showLabel ? 3 : 2) - this.parent.commitOffsetX,
        y: this.offsetY + this.template.commit.spacingY * (targetCommit.showLabel ? 3 : 2) - this.parent.commitOffsetY,
        type: "join"
      };
      this.pushPath( JSON.parse( JSON.stringify( endOfBranch ) ) ); // Elegant way for cloning an object

      var mergeCommit = {
        x: targetCommit.x,
        y: targetCommit.y,
        type: "end"
      };
      this.pushPath( mergeCommit );
      endOfBranch.type = "start";
      this.pushPath( endOfBranch );
      this.parent.render();
      this.parent.HEAD = targetBranch;
      return this;
    };

/*    var graphTemplate = new $window.GitGraph.Template({
      colors: [ "#ffae4b", "#00b8ff", "#00c98f","#4cd9b0" ],
      branch: {
        lineWidth: 6,
        spacingX: 90,
        mergeStyle: "straight",
        showLabel: true,
        // display Branch names on graph
        labelFont: "normal 14px arial"
      },
      commit: {
        spacingY: -45,
        dot: {
          size: 14,
          strokeColor: "white",
          strokeWidth: 2
        },
        tag: {
          font: "normal 13px arial",
          strokeWidth: 1
        },
        message: {
          display:false
        },
        shouldDisplayTooltipsInCompactMode:false
      },
      //arrow: {
      //  size: 8,
      //  offset: 0.5
      //}
    });*/
    var graphTemplate = new $window.GitGraph.Template({
      colors: [ "#fb9013", "#ffba13", "#93ed12","#11ea6d","#05ecce","0ab5f4" ],
      branch: {
        lineWidth: 1,
        spacingX: 20,
        mergeStyle: "bezier",
        showLabel: false,
        // display Branch names on graph
        labelFont: "normal 12px arial"
      },
      commit: {

        spacingY: -44,
        dot: {
          size: 8,
          strokeColor: "white",
          strokeWidth: 1
        },
        tag: {
          font: "normal 13px arial",
          strokeWidth: 1,
          display:false
        },
        message: {
          display:false
        },
        shouldDisplayTooltipsInCompactMode:false
      },
      //arrow: {
      //  size: 8,
      //  offset: 0.5
      //}
    });
    function FTemplate(options) {
      this.options = extend(options, {});
      this.options.config = extend(this.options.config,{
        template:graphTemplate,
        mode:'extend',
        orientation:'vertical'
      });
      this.init();
    }
    FTemplate.prototype.init = function () {
      var g = $window.$('#gitGraph'),
        p = g.parent(),
        scrollTop = p.scrollTop();
      g.remove();
      p.append('<canvas id="gitGraph"></canvas>');

      var gitGraph = this.gitGraph = new GitGraph(this.options.config);
      gitGraph.canvas.addEventListener( "graph:render", function ( event ) {
        //console.log( event.data.id, "graph has been rendered" );
      } );

      gitGraph.canvas.addEventListener( "commit:mouseover", function ( event ) {
        //console.log( "You're over a commit.", event.data );
        this.style.cursor = "pointer";
      } );

      gitGraph.canvas.addEventListener("commit:mouseout", function (event) {
        //console.log( "You just left this commit ->", event.data );
        this.style.cursor = "auto";
      });

      gitGraph.canvas.addEventListener('graph:render',function () {
        p.scrollTop(scrollTop);
      })
    }
    FTemplate.prototype.load = function load(task) {
      this.task = task;
      var groups = [],lines = [],times=[];
      this.line = fillTask(groups,lines,0,task);
      groups.forEach(function (g) {
        if(!g.ParentId){
          appendRoot(times,groups,lines,g);
        }
      });
      this.times = times;
      this.render();
      return times.filter(function (t) {
        return t.type !== 'line';
      })
    }
    FTemplate.prototype.onClick = function (e) {
      var data = this.times.find(function (d) {
        return d.TaskFlowId === e.author;
      });
      this.options.onClick && this.options.onClick({e:e,data:data});
    }
    FTemplate.prototype.render = function () {
      this.gitGraph = null;
      this.init();
      var self = this,times = self.times,
        Branch = self.Branch = [],
        gitGraph = self.gitGraph;
      function onClick(e) {
        self.onClick(e);
      }
      function getBranch(line) {
        var b1 = Branch.find(function (b) {
          return b.line==line;
        });
        return b1 && b1.b;
      }
      times.forEach(function (t) {
        switch (t.type){
          case 'line':
            Branch.push({
              line: t.line,
              b: gitGraph.branch({
                name: t.Name || ('b' + Branch.length),
                showLabel: false,
                column: t.line<5?t.line:(t.line % 5)+1,
                parentBranch: getBranch(t.parent)
              })
            });
            break;
          case 'merge':
            var ix=t.merge.length===1?2:0;
            getBranch(t.line).commit({
             author:t.TaskFlowId,
             //tag: (t.seq+1)+'、'+ t.Name,
             displayTagBox:false,
             message:t.Name,
             onClick:onClick,
             color:self.options.onNodeColor && self.options.onNodeColor(t),
             dotColor:self.options.onNodeDotColor && self.options.onNodeDotColor(t)
             });
            t.merge.forEach(function (m) {
              getBranch(m).merge(getBranch(t.line),{
                author:t.TaskFlowId,
                seq:t.seq+1,
                //tag:ix!==0?(t.seq+1)+'、'+ t.Name:undefined,
                displayTagBox:false,
                dotSize:ix===0?1:0,
                dotStrokeWidth:ix===0?1:0,
                dotStrokeColor:ix===0?'transparent':0,
                onClick:onClick,
                color:self.options.onNodeColor && self.options.onNodeColor(t),
                dotColor:self.options.onNodeDotColor && self.options.onNodeDotColor(t)
              });
              ix++;
            });

            break;
          default:
            if(t.line || t.line===0){
              //console.log('commnt',t.Name);
              getBranch(t.line).commit({
                author:t.TaskFlowId,
                //tag: (t.seq+1)+'、'+ t.Name,
                displayTagBox:false,
                message:t.Name,
                onClick:onClick,
                color:self.options.onNodeColor && self.options.onNodeColor(t),
                dotColor:self.options.onNodeDotColor && self.options.onNodeDotColor(t)
              });
            }
            break;
        }
      });
    }
    FTemplate.prototype.add = function (data,prev,isBranch) {
      if(prev && !prev.TaskFlowId)
        prev = null;

      var container = !prev||prev.line===0?this.task.Master:this.task.Branch.find(function (b) {
        return b.indexOf(prev)!=-1;
      });
      if(prev)
        data.ParentId = prev.TaskFlowId;
      if(isBranch){
        this.task.Branch.push([data]);
      }
      else{
        container.push(data);
      }
      return this.load(this.task);
    }
    FTemplate.prototype.edit = function (data) {
      this.render();
    }
    FTemplate.prototype.remove = function (data) {
      var container = this.task.Master.indexOf(data)!=-1?
        this.task.Master:
        this.task.Branch.find(function (b) {
          return b.indexOf(data)!=-1;
        });
      var index = container.indexOf(data);
      if(index===0 && container===this.task.Master && container.length===1){
        this.task.Master = [];
        this.task.Branch = [];
      }
      else{
        var next = container[index+1];
        container.splice(index,1);
        if(next) {
          next.ParentId = data.ParentId;
          this.task.Branch.forEach(function (b) {
            if (b[0].ParentId === data.TaskFlowId) {
              b[0].ParentId = next.TaskFlowId;
            }
          });
        }
      }
      for(var l=this.task.Branch.length-1;l>=0;l--){
        if(this.task.Branch[l].length===0){
          this.task.Branch.splice(l,1);
        }
      }
      return this.load(this.task);
    }
    function extend(obj,ext) {
      obj = obj||{};
      for(var k in ext){
        if(ext.hasOwnProperty(k) && !obj.hasOwnProperty(k)){
          obj[k] = ext[k];
        }
      }
      return obj;
    }
    function appendRoot(times,groups,lines,g) {
      if(g.TaskFlowId && !times.find(function (t) {
          return t.TaskFlowId===g.TaskFlowId;
        })) {
        var line = lines.find(function (l) {
          return l.line === g.line;
        });
        times.push(line);
        times.push(g);
      }
      appendTask(times,groups,lines,g);
    }
    function appendTask(times,groups,lines,gp) {
      if(!gp || !gp.TaskFlowId) return;
      var fds = groups.filter(function (g) {
        return g.ParentId === gp.TaskFlowId;
      });
      fds.sort(function (s1,s2) {
        if(s1.line===gp.line)
          return 1;
        if(s2.line===gp.line)
          return -1;
        return 0;
      }).forEach(function (fd) {
        var ends = fd.TaskFlowId && groups.filter(function (g) {
            return g.EndFlagTaskFlowId === fd.TaskFlowId;
          });
        ends && ends.forEach(function (e) {
          if(!fd.merge) {
            fd.merge = [];
            fd.type = 'merge';
          }
          fd.merge.push(e.line);
        })
        if(fd.line != gp.line){
          var line = lines.find(function (l) {
            return l.line === fd.line;
          });
          line.parent = gp.line;
          times.push(line);
        }
        if(fd.TaskFlowId && times.find(function (g) {
            return g.TaskFlowId===fd.TaskFlowId;
          })) {
          return;
        }
        times.push(fd);
        appendTask(times, groups, lines, fd);
        //
        /*      if(fd.EndFlagTaskFlowId){
         var ed = groups.find(function (g) {
         return g.TaskFlowId === fd.EndFlagTaskFlowId;
         });
         if(ed){
         var eRoot = findLineRoot(groups,ed);
         appendRoot(times,groups,lines,eRoot);
         }
         }*/
      });
      /*    fds.forEach(function (fd) {
       appendTask(times, groups, lines, fd);
       })*/
    }
    function findLineRoot(groups,g1) {
      var prev = groups.find(function (g) {
        return g.line===g1.line && g1.ParentId===g.TaskFlowId;
      });
      return prev?findLineRoot(groups,prev):g1;
    }
    function fillTask(groups,lines,t,task,parent) {
      var t2 = t;
      task.type = 'line';
      task.line = t2;
      lines.push(task);
      var prev = null,seq=0;
      var laskTask;
      task.Master && task.Master.forEach(function (g) {
        g.seq = seq++;
        g.ParentId = prev ? prev.TaskFlowId : parent && parent.TaskFlowId;
        if(prev)
          prev.hasNext = true;
        prev = g;
        g.line = t2;
        groups.push(g);

        if (laskTask) {
          laskTask.EndFlagTaskFlowId = g.TaskFlowId;
          laskTask = null;
        }
        g.tasks && g.tasks.forEach(function (tk) {
          if (tk.Master.length) {
            tk.Master[0].ParentId = g.TaskFlowId;
            laskTask = tk.Master[tk.Master.length - 1];
            t = fillTask(groups, lines, t + 1, tk, g);
          }
        });
      });
      task.Branch && task.Branch.forEach(function (b) {
        lines.push({
          type:'line',
          line:(++t)
        });
        prev = null;
        seq=0;
        b.forEach(function (g) {
          if(prev)
            prev.hasNext = true;
          g.seq = seq++;
          prev = g;
          g.line = t;
          groups.push(g);
          g.tasks && g.tasks.forEach(function (tk) {
            t = fillTask(groups,lines,t+1,tk,g);
          })
        });
      });

      return t;
    }
    return FTemplate;
  }
})(angular,undefined);
