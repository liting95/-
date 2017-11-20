var express = require('express');
const router = express.Router();
const Seller = require("../models/seller");
const Buyer = require("../models/buyer");
const validator = require("validator");

const Good = require("../models/goods");
const Car = require("../models/shopcar");

// 
router.get("/faxian",function(req,res){
	console.log("发现----被收藏的");
	var page = req.query.page;
	var page = parseInt(page);
//	console.log("page =  " + page);
	Good.find({"check_collect":true}).skip(3 * page).limit(3).populate("master").exec(function(err,datas){
		if(err){
			return res.end(err);
		}
//		console.log(datas);
		res.json({error:0,message:"success",data:datas});
	})
})


// 首页搜索-----------------------------------------------------------------------
router.get("/searchCollect",function(req,res){
	console.log("首页搜索---------------------");
	Good.find().exec(function(err,datas){
		if(err){
			return res.end(err);
		}
		res.json({error:0,data:datas});
	})
})
// 进行搜索-----------------------------------------------------------------------
router.get("/search",function(req,res){
	console.log("进行搜索------------------------");
	console.log(req.query.value);
	let value = req.query.value;
	let reg = RegExp(value,"gi");
	console.log(reg);
	Good.find({"name":reg}).populate("master").exec(function(err,data){
		if(err){
			return res.end(err);
		}
		console.log(data);
		res.json({error:0,message:"success",data:data});
	})
})


module.exports = router;