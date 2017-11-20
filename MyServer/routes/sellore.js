var express = require('express');
const router = express.Router();
const Seller = require("../models/seller");
const validator = require("validator");
const crypto = require("crypto");

const setting = require("../setting");

// 注册---------------------------------------------
router.post("/sellerregister",function(req,res){
    console.log(req.body);
    let name = req.body.registerName;
    let password = req.body.registerPwd;
    let connect = req.body.registerTel;
    

    if( !validator.matches(name,/^[\u4e00-\u9fa5a-zA-Z0-9_]{4,6}$/,"g")){
        // error = "用户名不合法，应以字母，数字，_开头";
        return res.json({error:2,message:"用户名不合法，应以汉字开头"});
    }
    if( !validator.matches(password, /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{4,6}/,"g")){
        // error = "密码不合法，长度为4-6";
        return res.json({error:2,message:"密码不合法，长度为4-6"});
    }

    // 查找用户，存在返回信息，不存在保存
    Seller.findOne({name:name}).exec(function(err,data){
        if(err){
            return res.json({error:-1,data:err});
        }
        if(data){
            return res.json({error:1,message:"该用户已存在，请重新注册"});
        }
        // 密码加密
        // console.log(password);
        let md5 = crypto.createHash("md5");
        let newPwd = md5.update(password).digest("hex");
        // console.log(newPwd);
        let seller = new Seller({
            name:name,
            password:newPwd,
            connect:connect
        })
        seller.save();
        res.json({error:0,message:"注册成功"});
    })
})

// 登录---------------------------------------------------------
router.post("/sellerlogin",function(req,res){
    console.log(req.body);
    let name = req.body.username;
    let password = req.body.password;

    if( !validator.matches(name,/^[\u4e00-\u9fa5a-zA-Z0-9_]{4,6}$/,"g")){
        // error = "用户名不合法，应以汉字开头";
        return res.json({error:2,message:"用户名不合法，应以汉字开头"});
    }
    if( !validator.matches(password, /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{4,6}/,"g")){
        // error = "密码不合法，长度为4-6";
        return res.json({error:2,message:"密码不合法，长度为4-6"});
    }

    Seller.findOne({name:name}).exec(function(err,data){
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
//      console.log(newPwd);
        if(data.password != newPwd){
            return res.json({error:-1,message:"密码错误"});
        }
//      console.log("设置session之前");
        res.cookie("sellerCookie",data,{
            signed:true,
            maxAge:1000 * 60 * 60 * 12,
            path:"/"
        })
        // console.log("*************设置session*********************");
        req.session.seller = req.signedCookies.sellerCookie;
        // console.log(req.signedCookies.sellerCookie);
//      console.log(req.session.seller);
        res.json({error:0,message:"登录成功",data:data});
    })
})

// 检测是否登陆
router.get("/sellercheckLogin",function(req,res){
    console.log("检测----seller----是否登陆");
    // console.log(req.signedCookies);
//  console.log(req.session);
    if(req.session.seller){
        console.log("设置----seller----成功");
        res.json({error:0,data:req.session.seller});
    }else{
        console.log("没有设置----seller----成功");
        res.json({error:1,data:""});
    }
})

// 退出
router.get("/sellerlogout",function(req,res){
    console.log(111111111);
    req.session.destroy();  //销毁数据
    res.clearCookie("sellerCookie"); // 清空cookie
    console.log("退出seller成功");
    res.json({error:0,message:"退出seller成功"});
})


module.exports = router;