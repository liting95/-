var express = require('express');
const router = express.Router();
const Buyer = require("../models/buyer");
const validator = require("validator");

const crypto = require("crypto");


// 注册---------------------------------------------
router.post("/register",function(req,res){
    console.log(req.body);
    let name = req.body.registerName;
    let password = req.body.registerPwd;


    if( !validator.matches(name,/^[a-zA-Z][a-zA-Z0-9_]{4,6}$/,"g")){
        // error = "用户名不合法，应以字母，数字，_开头";
        return res.json({error:2,message:"用户名不合法，应以字母，数字，_开头"});
    }
    if( !validator.matches(password, /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{4,6}/,"g")){
        // error = "密码不合法，长度为4-6";
        return res.json({error:2,message:"密码不合法，长度为4-6"});
    }

    // 查找用户，存在返回信息，不存在保存
    Buyer.findOne({name:name}).exec(function(err,data){
        if(err){
            return res.json({error:-1,data:err});
        }
        if(data){
            return res.json({error:1,message:"该用户已存在，请重新注册"});
        }
        // let buyer = new Buyer(req.body);
        // 密码加密
//      console.log(password);
        let md5 = crypto.createHash("md5");
        let newPwd = md5.update(password).digest("hex");
//      console.log(newPwd);
        let buyer = new Buyer({
            name:name,
            password:newPwd
            
        })
        buyer.save();
        res.json({error:0,message:"注册成功"});
    })
})

// 登录---------------------------------------------------------
router.post("/login",function(req,res){
    console.log(req.body);
    let name = req.body.username;
    let password = req.body.password;

    if( !validator.matches(name,/^[a-zA-Z][a-zA-Z0-9_]{4,6}$/,"g")){
        // error = "用户名不合法，应以字母，数字，_开头";
        return res.json({error:2,message:"用户名不合法，应以字母，数字，_开头"});
    }
    if( !validator.matches(password, /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{4,6}/,"g")){
        // error = "密码不合法，长度为4-6";
        return res.json({error:2,message:"密码不合法，长度为4-6"});
    }

    Buyer.findOne({name:name}).exec(function(err,data){
        if(err){
            return res.json({error:-1,data:err});
        }
        if(!data){
            return res.json({error:1,message:"该用户不存在，请注册"});
        }
        // 密码加密
        // console.log(password);
        let md5 = crypto.createHash("md5");
        let newPwd = md5.update(password).digest("hex");
        // console.log(newPwd);
        if(data.password != newPwd){
            return res.json({error:-1,message:"密码错误"});
        }
       console.log("设置session之前");
        // req.session.buyer = data;
        res.cookie("cookieName",data,{
            signed:true,
            maxAge:1000 * 60 * 60 * 12,
            path:"/"
        })
        // console.log("*************设置session*********************");
        req.session.buyer = req.signedCookies.cookieName;
        // console.log(req.signedCookies.cookieName);
//      console.log(req.session.buyer);
        res.json({error:0,message:"登录成功"});
    })
})

// 检测是否登陆
router.get("/checkLogin",function(req,res){
    console.log("检测buyer是否登陆");
    // console.log(req.signedCookies);
//  console.log(req.session);
    if(req.session.buyer){
        console.log("设置buyer成功");
        res.json({error:0,data:req.session.buyer});
    }else{
        console.log("没有设置buyer成功");
        res.json({error:1,data:""});
    }
})

// 退出
router.get("/logout",function(req,res){
    console.log(111111111);
    req.session.destroy();  //销毁数据
    res.clearCookie("cookieName"); // 清空cookie
    console.log("退出buyer成功");
    res.json({error:0,message:"退出buyer成功"});
})


module.exports = router;