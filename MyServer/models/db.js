
const mongoose = require("mongoose");

const setting = require("../setting");
mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://${setting.host}/${setting.db}`);
var db = mongoose.connection;
db.on("error",function(){
    console.log("数据库连接失败");
})
db.once("open",function(){
    console.log("数据库连接成功");
})


module.exports = db;