var express = require('express');
const router = express.Router();
const Seller = require("../models/seller");
const validator = require("validator");

const Good = require("../models/goods");

// 首页---------------------------------------------
router.get("/",function(req,res){
	console.log("首页");
	console.log(req.query);
	var page = req.query.page;
	var page = parseInt(page);
//	console.log("page =  " + page);
	
	if(!page){
		page = 1;
	}
	Good.find().skip(2*(page -1)).limit(2).exec(function(err,goods){
		if(err){
			return res.end(err);
		}
//		console.log(goods);
		res.json({error:0,goods:goods});
	})
})


// 卖家宝贝-------------------------------------------------
router.get("/sellerGood",function(req,res){
	console.log("卖家宝贝");
	let seller = req.session.seller._id;
	var page = req.query.page;
	var page = parseInt(page);
	Good.find({master:seller}).skip(3 * page).limit(3).exec(function(err,data){
		if(err){
			return res.end(err);
		}
//		console.log(data);
		res.json({error:0,message:'cha-zhao-dao-le',data:data});
	})
})

// 买家进卖家店铺-------------------------------------------------
router.get("/getSellerGood",function(req,res){
	console.log("买家进卖家店铺---------------------------");
//	console.log(req.query);
	let masterid = req.query.masterid;
//	console.log(masterid);
	var page = req.query.page;
	var page = parseInt(page);
	Good.find({master:masterid}).populate("master").skip(3 * page).limit(3).exec(function(err,data){
		if(err){
			return res.end(err);
		}
//		console.log(data);
		
		let item = data.slice(0,1);
//		console.log(item);
		res.json({error:0,message:'cha-zhao-dao-le',data:data,item:item});
	})
})



module.exports = router;