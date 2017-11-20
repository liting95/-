var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

// var index = require('./routes/index');
// 导入路由文件
const routes = require("./routes");
// 导入设置文件
const setting = require("./setting");

const Buyer = require("./models/buyer");
const Seller = require("./models/seller");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// cookie加密
app.use(cookieParser(setting.cookie_secret));
app.use(express.static(path.join(__dirname, 'public')));

// 设置session 
app.use(session({
  secret:"end",
  // store:new MongoStore({
  //   url:"mongodb://localhost/endItem"
  // }),
  resave:true,
  saveUninitialized:true,
  // cookie:{maxAge:1000 * 60 * 60},
  name:"endItem"
}))



// 买家buyer------session设置-----------------------------------------------------
app.use(function(req, res,next){
  // console.log(req.session);
  console.log("shezhi----------");
  if(req.session.buyer){
    console.log("已设置");
    next();
  }else {
    var cookiename = req.signedCookies['cookieName'];
    console.log("app.js设置buyer----session------------------------------------");
//  console.log(cookiename)
    if(cookiename){
      Buyer.findOne({"_id":req.signedCookies.cookieName._id}).exec(function(err,data){
        console.log('进入');  
        if(err){
              return next();;
          }
//        console.log(data);
          req.session.buyer = data;
          next();
      })
    } else {
      next();
    }
    
  }
})

// 卖家seller----session设置-----------------------------------------------
app.use(function(req, res,next){
  // console.log(req.session);
  console.log("shezhi----------");
  if(req.session.seller){
    console.log("已设置");
    next();
  }else {
    var sellerCookie = req.signedCookies['sellerCookie'];
    console.log("app.js设置seller-----session----------------------------------------");
//  console.log(sellerCookie)
    if(sellerCookie){
      Seller.findOne({"_id":req.signedCookies.sellerCookie._id}).exec(function(err,data){
        console.log('进入');  
        if(err){
              return next();;
          }
//        console.log(data);
          req.session.seller = data;
          next();
      })
    } else {
      next();
    }
    
  }
})

 

// 服务端的
// app.use('/', routes);   //必须要有这个，不然找不到，跳转error.ejs



// 浏览器端的  
app.use(require("./routes/mailore"));

app.use(require("./routes/sellore"));
// 卖家操作
app.use(require("./routes/selleropreate"));
app.use(require("./routes/sellerupload"));


app.use(require("./routes/goods"));
// 首页分类
app.use(require("./routes/indextag"));
// 购物车
app.use(require("./routes/shopcar"));

app.use(require("./routes/faxian"));
// 地址
app.use(require("./routes/address"));
// 买家 
app.use(require("./routes/buyeropreate"));
// pingjia
app.use(require("./routes/evaluate"));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(2017,function(){
  console.log("2017----服务端-Server-----");
})

module.exports = app;
