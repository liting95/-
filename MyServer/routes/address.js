var express = require('express');
const router = express.Router();
const Seller = require("../models/seller");
const Buyer = require("../models/buyer");
const validator = require("validator");

const Good = require("../models/goods");
const Car = require("../models/shopcar");
const Order = require("../models/dingdan");
const Wait = require("../models/waitshop");

// 添加收货地址--------------------------------------
router.post("/address",function(req,res){
	console.log("添加收货地址-------");
	console.log(req.body);
	let buyer_id = req.session.buyer._id;
	let address = {};
	address.province = req.body.params.value;
	address.street = req.body.params.street;
	address.name = req.body.params.name;
	address.telnumber = req.body.params.telnumber;
	address.code = 453002;
	address.checked = false;

	Buyer.findOne({"_id":buyer_id}).exec(function(err,data){
		if(err){
			return res.end(err);
		}
		console.log(data);
		data.adressList.push(address);
		
		data.save().then((result)=>{
//			console.log(result);
			req.session.buyer = data;
			res.json({error:0,message:"success",data:data});
		}).catch((err)=>{
			console.log(err);
			res.json({error:1,message:"failed",data:""});
		});
	})
	
})

// 获得所有的地址-----------------------------------------------------
router.get("/allAddress",function(req,res){
	console.log("获得所有的地址");
	let buyer_id = req.session.buyer._id; 
	Buyer.findOne({"_id":buyer_id}).exec(function(err,datas){
		if(err){
			return res.end(err);
		}
		datas.adressList.forEach(function(data){
			data.checked = false;
//			console.log(data.checked);
		})
		let buyer = new Buyer(datas);
		buyer.save();
		req.session.buyer = buyer;
		res.json({error:0,data:datas});
	})
})  	

// 删除地址----------------------------------------------------------
router.get("/delAddress",function(req,res){
	console.log("删除地址------------------");
	let index = req.query.index;
	let buyer_id = req.session.buyer._id; 
	Buyer.findOne({"_id":buyer_id}).exec(function(err,data){
		if(err){
			return res.end(err);
		}
		data.adressList.splice(index,1);
		var buyer = new Buyer(data);
		buyer.save().then((result)=>{
			console.log(result);
			req.session.buyer = buyer;

			res.json({error:0,message:"success",data:datas});

		}).catch((err)=>{
			console.log(err);
			res.json({error:1,message:"failed",data:""});
		})
	})
})
 
// 选择一个地址--修改属性checked为true---------------------------------------------------    	
router.get("/selectAddress",function(req,res){
	console.log("选择一个地址--修改属性checked为true-------------");
	console.log(req.query);
	let index = req.query.index;
	let buyer_id = req.session.buyer._id; 
	Buyer.findOne({"_id":buyer_id}).exec(function(err,data){
		if(err){
			return res.end(err);
		}
		data.adressList[index].checked = true;
//		console.log("111111111111111111");
		console.log(data.adressList[index]);
		var buyer = new Buyer(data);
		buyer.save().then((result)=>{
//			console.log(result);
			req.session.buyer = buyer;
			res.json({error:0,message:"success",data:data});
		}).catch((err)=>{
			console.log(err);
			res.json({error:1,message:"failed",data:""});
		})
	})
})
    	
// 确认订单页面地址的获取---------------------------------------------------
router.get("/orderAddress",function(req,res){
	console.log("确认订单页面地址的获取------");
	let buyer_id = req.session.buyer._id; 
	Buyer.findOne({"_id":buyer_id}).exec(function(err,data){
		if(err){
			return res.end(err);
		}

		res.json({error:0,data:data});
	})
})

// 点击确认订单时，当有地址时可以跳转页面，不然不能-------------------------------
router.get("/confirmOrder",function(req,res){
	console.log("点击确认订单时，当有地址时可以跳转页面，不然不能");
	let buyer_id = req.session.buyer._id; 
	let jiance = false;
	Buyer.findOne({"_id":buyer_id}).exec(function(err,datas){
		if(err){
			return res.end(err);
		}
		let lists =  datas.adressList;
		for(var i = 0; i < lists.length; i++){
//			console.log(lists[i]);
			if(lists[i].checked){
				jiance = true;
//				return;
			}
		}
//		console.log(jiance);
		res.json({error:0,data:datas,checked:jiance});
	})
})
    	
// 确定支付将要支付商品的checked变为false----购物车的该商品应消失--------------------------    	
router.get("/payfor",function(req,res){
	console.log("确定支付将要支付商品的checked变为false-");
	let buyer_id = req.session.buyer._id;
	let order = {};
	let wait = {};
	let count = 0;
	Car.find({"queen":buyer_id,checked:true}).exec(function(err,datas){
		if(err){
			return res.end(err);
		}
//		console.log(datas);
		datas.forEach(function(data,ins){
//			console.log("1111111111111111111111111");
//			console.log(data);
//			order = new Order(data);
			// 生成订单
			console.log(data);
			order = new Order({
				name:data.name,
				price:data.price,
				checked:data.checked,
				queen:buyer_id,
				master:data.master,
				photo:data.photo,
				count:data.count,
				good:data.goodid
			})
			wait = new Wait({
				name:data.name,
				price:data.price,
				checked:data.checked,
				queen:buyer_id,
				master:data.master,
				photo:data.photo,
				count:data.count,
				good:data.goodid
			})
//			console.log("22222222222222222222222222");
//			console.log(order);
			order.save();
			wait.save();
			data.remove();
			count++;
			data.save();
		})
		
		Buyer.findOne({"_id":buyer_id}).exec(function(err,data){
			if(err){
				return res.end(err);
			}
			data.shopcar = data.shopcar - count;
			data.save();
			req.session.buyer = data;
			res.json({error:0,message:"success",data:data});
		})
		
	})
	
})

// 查找订单集合中的当前用户的，计算money----------------
router.get("/getorder",function(req,res){
	console.log("查找订单集合中的当前用户的，计算-----------------");
	let buyer_id = req.session.buyer._id;
	let money = 0;
	Order.find({"queen":buyer_id,checked:true}).exec(function(err,datas){
		if(err){
			return res.end(err);
		}
		
		datas.forEach(function(data){
			console.log(data.checked);
			money += data.price * data.count;
			data.checked = false;
			data.save();
//			console.log(data.checked);
//			console.log(money);
			return money;
		})

		res.json({error:0,data:datas,money:money});
	})
})


    	
module.exports = router;