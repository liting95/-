var express = require('express');
const router = express.Router();
const Seller = require("../models/seller");
const Buyer = require("../models/buyer");
const validator = require("validator");

const Good = require("../models/goods");
const Car = require("../models/shopcar");
const Order = require("../models/dingdan");
const Attention = require("../models/attention");
const Evaluate = require('../models/evaluate');

//
router.get("/goodping",function(req,res){
	if(req.session.buyer){
		res.json({error:0,message:"已登录"});
	}else{
		res.json({error:1,message:"未登录"});
	}
})

router.get("/evaluate",function(req,res){
	console.log(req.query);
	let goodid = req.query.goodid;
	Good.findOne({"_id":goodid}).exec(function(err,data){
		if(err){
			return res.end(err);
		}
//		console.log(data);
		res.json({error:0,data:data});
	})
})

router.get("/getContent",function(req,res){
	console.log("获取评价内容----------------");
	console.log(req.query);
	let goodid = req.query.goodid;
	let content = req.query.content;
	
	let eval = new Evaluate({
		content:content,
		good:goodid,
		queen:req.session.buyer._id,
	});
	eval.save().then((result)=>{
		console.log(result);
//		console.log(result.create_time);
		res.json({error:0,data:""});
	}).catch((err)=>{
		console.log(err);
		res.json({error:1,data:""});
	})
})

router.get("/danEvaluate",function(req,res){
	console.log("找当前这一个人一个商品的所有评论-------------------------");
	let goodid = req.query.goodid;

	let buyer_id = req.session.buyer._id;
//	console.log(goodid);
	Evaluate.find({"good":goodid,"queen":buyer_id}).populate("queen").sort({"create_time":-1}).exec(function(err,data){
		if(err){
			return res.end(err);
		}
//		console.log(data);
		res.json({error:0,data:data});
	})

})

router.get("/allEvaluate",function(req,res){
	console.log("找一个商品的所有评论-------------------------");
	let goodid = req.query.goodid;
//	console.log(goodid);
	var page = req.query.page;
	var page = parseInt(page);
	Evaluate.find({"good":goodid}).populate("queen").skip(3*page).limit(3).sort({"create_time":-1}).exec(function(err,data){
		if(err){
			return res.end(err);
		}
//		console.log(data);
//		console.log(data.create_time);   //undefined
		res.json({error:0,data:data});
	})

})





module.exports = router;

