/**
 * Created by jiuyuong on 2016/9/22.
 */
(function (angular,undefined) {
  angular
    .module('app.plan')
    .factory('template',template);
  /** @ngInject */
  function template() {

    var graphTemplate = new GitGraph.Template({
      colors: [ "#EF9A9A", "#42A5F5", "#26A69A","#CE93D8" ],
      branch: {
        lineWidth: 3,
        spacingX: 60,
        mergeStyle: "straight",
        showLabel: true,                // display branch names on graph
        labelFont: "normal 10pt Arial"
      },
      commit: {
        spacingY: -30,
        dot: {
          size: 10,
          strokeColor: "#000000",
          strokeWidth: 4
        },
        tag: {
          font: "normal 10pt Arial",
          strokeWidth: 1
        },
        message: {
          font: "normal 12pt Arial",
          display:false
        },
        shouldDisplayTooltipsInCompactMode:false,
        tooltipHTMLFormatter:function (commit) {
          return commit.message;
        }
      },
      arrow: {
        size: 8,
        offset: 0.5
      }
    });

    function FTemplate(options) {
      this.options = extend(options, {});
      this.options.config = extend(this.options.config,{
        template:graphTemplate,
        mode:'extend',
        orientation:'vertical'
      });
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
    }

    FTemplate.prototype.newColumn = function () {
      this.maxColumn = this.maxColumn?this.maxColumn+1:0;
    }
    function FLine(options,temp) {
      var self = this;
      self.temp = temp;
      self.lines = [];
      self.nodes = [];
      self.branch = temp.gitGraph.branch(extend(options,
        {
          column:temp.newColumn()
        })
      );
    }
    FLine.prototype.addNode = function (options) {
      var self = this;
      this.nodes.push(options);
      var node = new FNode(options,self);
    }
    function FNode(options,line) {
      this.line = line;
      this.options = options;
    }
    FTemplate.prototype.load = function load(task) {
      var groups = [],lines = [],times=[];
      fillTask(groups,lines,0,task);
      groups.forEach(function (g) {
        if(!g.parentCategoryId){
          appendRoot(times,groups,lines,g);
        }
      });
      this.times = times;
    }
    FTemplate.prototype.onClick = function (e) {
      var data = this.times.find(function (d) {
        return d.categoryId === e.author;
      })
      this.options.onClick && this.options.onClick({e:e,data:data});
    }
    FTemplate.prototype.render = function () {
      var self = this,times = this.times,
        branch = [],
        commits = [],
        gitGraph = this.gitGraph;
      function onClick(e) {
        self.onClick(e);
      }
      function getBranch(line) {
        var b1 = branch.find(function (b) {
          return b.line==line;
        });
        return b1 && b1.b;
      }
      times.forEach(function (t) {

        switch (t.type){
          case 'line':
            branch.push({
              line: t.line,
              b: gitGraph.branch({
                name: t.name || ('b' + branch.length),
                showLabel: !!t.name,
                column: t.line,
                parentBranch: getBranch(t.parent)
              })
            });
            break;
          case 'merge':
            var ix=t.merge.length===1?2:0;
            t.merge.forEach(function (m) {
              getBranch(m).merge(getBranch(t.line),{
                author:t.categoryId,
                tag:ix!==0?t.name:undefined,
                dotSize:ix===0?1:0,
                dotStrokeWidth:ix===0?1:0,
                dotStrokeColor:ix===0?'transparent':0,
                onClick:onClick
              });
              ix++;
            })

            //commits.push(branch[t.line].merge({}))
            break;
          default:
            if(t.line || t.line===0){
              commits.push(getBranch(t.line).commit({
                author:t.categoryId,
                tag:t.name,
                message:t.name,
                onClick:onClick
              }));
            }
            break;
        }
      });
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
      if(g.categoryId && !times.find(function (t) {
          return t.categoryId===g.categoryId;
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
      if(!gp || !gp.categoryId) return;
      var fds = groups.filter(function (g) {
        return g.parentCategoryId === gp.categoryId;
      });
      fds.sort(function (s1,s2) {
        if(s1.line===gp.line)
          return 1;
        if(s2.line===gp.line)
          return -1;
        return 0;
      }).forEach(function (fd) {
        var ends = fd.categoryId && groups.filter(function (g) {
            return g.endFlagCategoryId === fd.categoryId;
          });
        ends.forEach(function (e) {
          if(!fd.merge) {
            fd.merge = [];
            fd.type = 'merge';
          }
          fd.merge.push(e.line);
          //var eRoot = findLineRoot(groups,e);
          //appendRoot(times,groups,lines,eRoot);
        })
        if(fd.line != gp.line){
          var line = lines.find(function (l) {
            return l.line === fd.line;
          });
          line.parent = gp.line;
          times.push(line);
        }
        if(fd.categoryId && times.find(function (g) {
            return g.categoryId===fd.categoryId;
          })) {
          return;
        }
        times.push(fd);
        appendTask(times, groups, lines, fd);
        //
        /*      if(fd.endFlagCategoryId){
         var ed = groups.find(function (g) {
         return g.categoryId === fd.endFlagCategoryId;
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
        return g.line===g1.line && g1.parentCategoryId===g.categoryId;
      });
      return prev?findLineRoot(groups,prev):g1;
    }
    function fillTask(groups,lines,t,task,parent) {
      var t2 = t;
      task.type = 'line';
      task.line = t2;
      lines.push(task);
      var prev = null;
      var laskTask;
      task.master && task.master.forEach(function (g) {
        g.parentCategoryId = prev ? prev.categoryId : parent && parent.categoryId;
        prev = g;
        g.line = t2;
        groups.push(g);

        if (laskTask) {
          laskTask.endFlagCategoryId = g.categoryId;
          laskTask = null;
        }
        g.tasks && g.tasks.forEach(function (tk) {
          if (tk.master.length) {
            tk.master[0].parentCategoryId = g.categoryId;
            laskTask = tk.master[tk.master.length - 1];
            t = fillTask(groups, lines, t + 1, tk, g);
          }
        });
      });
      task.branch && task.branch.forEach(function (b) {
        lines.push({
          type:'line',
          line:(++t)
        });
        b.forEach(function (g) {
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
})(angular,undefined)
