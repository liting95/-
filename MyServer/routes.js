const express = require("express");
const router = express.Router();
// 引入首页的路由文件
const home = require("./routes/home");
// const mailore = require("./routes/mailore");


// 首页
router.get("/",home.index);
// router.get("/login",home.login);


// 导出路由文件
module.exports = router;