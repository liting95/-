var express = require('express');
const router = express.Router();
const Seller = require("../models/seller");
const Buyer = require("../models/buyer");
const validator = require("validator");

const Good = require("../models/goods");
const Car = require("../models/shopcar");
const Order = require("../models/dingdan");
const Attention = require("../models/attention");
const Wait = require("../models/waitshop");


const multer = require('multer');


// 磁盘存储路径配置
// destination：存储的文件夹路径
// filename：文件名称
var storageb = multer.diskStorage({
    destination:'public/images/buyerimgs',
    filename: function (req, file, cb) {
    	var times = Date.now();
    	
	    cb(null, times +'.jpg');
	    
	    req.body.avatar = 'images/buyerimgs/' + times +'.jpg';
	    
	    console.log(req.body.avatar);
		console.log(times + ".jpg");
    }
})
  // 根据配置信息生成处理对象
var uploadb = multer({ storage: storageb });
// upload.array('文件名称',最大数量) 批量处理文件

//---修改头像--------------------------------------------------------------
router.post('/uploadtoub',uploadb.single('photo'),(req,res)=>{
    console.log("更改头像");
    console.log(req.body);
    Buyer.findOne({"_id":req.session.buyer._id}).exec(function(err,data){
    	if(err){
    		return res.end(err);
    	}
    	console.log(data);
    	data.avatar = req.body.avatar;
    	req.session.buyer = data;
    	data.save().then((data)=>{
    		console.log(data);
    		res.json({error:0,message:"修改成功",data:data});
    	}).catch((err)=>{
    		console.log(err);
    	});
    	
    })

})

// 我关注的店铺----------------------------------------------
router.get("/attention",function(req,res){
	console.log("关注的店铺-------------------");
	let master_id = req.query.masterid;
	let like = false;
	if(req.session.buyer){
		let buyer_id = req.session.buyer._id;
		Buyer.findOne({"_id":buyer_id}).exec(function(err,buyer){
			if(err){
				return res.end(err);
			}
	//		console.log(buyer);
			// 已收藏后点击，代表要取消关注
			// liked=false代表取消收藏，买家check_like=false代表取消收藏，收藏数量-1
			Attention.findOne({"queen":buyer_id,"master":master_id}).exec(function(err,data){
				if(err){
					return res.end(err);
				}
	//			console.log(data);
				if(data == null){
					console.log("11");
					let attention = new Attention();
					attention.master = master_id;
					attention.queen = buyer_id;
					attention.liked = true;
					attention.save();
	//				console.log(attention);
	//				buyer.check_like = true;  // -- 用来检测 
					buyer.likes++;
					buyer.save();
	//				console.log(buyer);
					req.session.buyer = buyer;
					res.json({error:0,buyer:buyer,attention:attention});
				}else{
					console.log("22");
					data.liked = false;
					data.remove();
					data.save();
	//				console.log(data);
	//				buyer.check_like = false;  // -- 用来检测 
					buyer.likes--;
					buyer.save();
	//				console.log(buyer);
					req.session.buyer = buyer;
					res.json({error:0,buyer:buyer,attention:data});
				}
			})
		})
	}else{
		res.json({error:1,message:"亲，还没登录哦",data:""});
	}
})

// 店铺的关注数量-----卖家-----------------------------------------
router.get("/likes",function(req,res){
	console.log("店铺的关注数量--------------");
	let master_id = req.session.seller._id;
	Attention.find({master:master_id}).count(function(err,data){
		if(err){
			return res.end(err);
		}
//		console.log(data);
		res.json({error:0,data:data});
	})
})
// 获取关注的店铺------买家--------------------------------------------
router.get("/buyerLikes",function(req,res){
	console.log("获取关注的店铺---------------------");
	let buyer_id = req.session.buyer._id;
	Attention.find({"queen":buyer_id }).populate("master").exec(function(err,data){
		if(err){
			return res.end(err);
		}
//		console.log(data);
		res.json({error:0,data:data});
	})
	
})
// 一开始刷新页面时就获取有没有被关注-------买家----------------------------
router.get("/getAttention",function(req,res){
	console.log("一开始刷新页面时就获取有没有被关注--------------------");
	let buyer_id = req.session.buyer._id;
	let master_id = req.query.masterid;
	Attention.findOne({"queen":buyer_id,"master":master_id}).exec(function(err,data){
		if(err){
			return res.end(err);
		}
//		console.log(data);
		res.json({error:0,data:data});
	})
})

// 我的收藏----------------------------------------
router.get("/getCollect",function(req,res){
	console.log("我的收藏-----------------");
	let buyer_id = req.session.buyer._id;

	if(req.session.buyer){
		Buyer.findOne({"_id":buyer_id}).exec(function(err,data){
			if(err){
				return res.end(err);
			}
			res.json({error:0,message:"success",data:data});
		})
	}else{
		res.json({error:1,message:"buyer is no exist",data:''});
	}
	
})

// 我的订单----------------------------------------
router.get("/getAllOrder",function(req,res){
	console.log("我的订单-----------------");
	let buyer_id = req.session.buyer._id;
	Order.find({"queen":buyer_id}).exec(function(err,data){
		if(err){
			return res.end(err);
		}
//		console.log(data);
		res.json({error:0,message:"success",data:data});
	})
})
// 我的订单删除----------------------------------------------
router.get("/delOrder",function(req,res){
	console.log("我的订单删除---------------------------");
	let id = req.query.id;
	console.log(id);
	Order.findOne({"_id":id}).exec(function(err,data){
		if(err){
			return res.end(err);
		}
		data.remove();
		data.save();
		Order.find().exec(function(err,data){
			if(err){
				return res.end(err);
			}
			res.json({error:0,data:data});
		})	
	})
})


// 我的待收货----------------------------------------
router.get("/getWait",function(req,res){
	console.log("我的待收货-----------------");
	let buyer_id = req.session.buyer._id;
	Wait.find({"queen":buyer_id}).exec(function(err,data){
		if(err){
			return res.end(err);
		}
//		console.log(data);
		res.json({error:0,message:"success",data:data});
	})
})

// 我的待收货删除----------------------------------------------
router.get("/delwait",function(req,res){
	console.log("我的待收货删除---------------------------");
	let id = req.query.id;
	console.log(id);
	Wait.findOne({"_id":id}).exec(function(err,data){
		if(err){
			return res.end(err);
		}
		data.remove();
		data.save();
		Wait.find().exec(function(err,data){
			if(err){
				return res.end(err);
			}
			res.json({error:0,data:data});
		})
	})
})



module.exports = router;