  module.exports=function () {
    var reqParse=require('./req-parse');
    var pathToRegexp= require('./pathToRegexp');
    var mds=[],routers={},regs={};
    var app=function (req,res) {
      reqParse(req);
      var index=0;
      function next() {
        if(index==mds.length){
          route(req,res);
          return;
        }
        mds[index++](req,res,next);

      }
      next();
    };
    // routers={'get':{'url1':'fn1','url2':'fn2','url3':'fn3'},'post':{'url4':'fn4','url5':'fn5','url6':'fn6'}};
    function route(req,res) {
      var m=req.method.toLowerCase();
      var u=req.path.toLowerCase();
      if(!routers[m]){res.end('method is wrong');return;}
      else if(routers[m][u]){routers[m][u](req,res); return;}
      for(var item in regs){
         if(regs[item].test(u)){routers[m][item](req,res);return;}
       }
        res.end('url is wrong');
    }
    //regs={"url1":'//g','url2':'//g','url3':'//g'}
    app.use=function (fn) {
      mds.push(fn);
    };

    app.get=function (url,fn) {
    url=url.toLowerCase();
    if (!routers['get']) routers['get']={};
      routers['get'][url]=fn;
      if(url.indexOf(':')>0){
        regs[url]=pathToRegexp(url);
      }
    };

    app.post=function (url,fn) {
    url=url.toLowerCase();
    if (!routers['post']) routers['post']={};
      routers['post'][url]=fn;
      if(url.indexOf(':')>0){
        regs[url]=pathToRegexp(url);
      }
    };
    app.start=function (p) {
    require('http').createServer(app).listen(p,function(){
      console.log('lisening on '+ p);
    });
    };
    return app;
};
