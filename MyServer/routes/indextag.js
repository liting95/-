var express = require('express');
const router = express.Router();
const Seller = require("../models/seller");
const Buyer = require("../models/buyer");
const validator = require("validator");

const Good = require("../models/goods");
const Attention = require("../models/attention");


//---悬疑系列--------------------------------------------------------------------
router.get("/xuanyi",function(req,res){
	console.log("悬疑系列");

	Good.find({tag:"悬疑系列"}).populate("master").exec(function(err,datas){
		if(err){
			return res.end(err);
		}
		console.log(datas);
		res.json({error:0,message:"success",data:datas});
	})
})
// 价格升序
router.get("/xuanup",function(req,res){
	console.log("价格升序");
	Good.find({tag:"悬疑系列"}).sort({price:1}).exec(function(err,datas){
		if(err){
			return res.end(err);
		}
		console.log(datas);
		res.json({error:0,message:"success",data:datas});
	})
})

router.get("/xuandown",function(req,res){
	console.log("价格降序");
	Good.find({tag:"悬疑系列"}).sort({price:-1}).exec(function(err,datas){
		if(err){
			return res.end(err);
		}
		console.log(datas);
		res.json({error:0,message:"success",data:datas});
	})
})

//---科学人文--------------------------------------------------------------------
router.get("/kexue",function(req,res){
	console.log("科学人文");

	Good.find({tag:"科学人文"}).populate("master").exec(function(err,datas){
		if(err){
			return res.end(err);
		}
		console.log(datas);
		res.json({error:0,message:"success",data:datas});
	})
})
// 价格升序
router.get("/keup",function(req,res){
	console.log("价格升序");
	Good.find({tag:"科学人文"}).sort({price:1}).exec(function(err,datas){
		if(err){
			return res.end(err);
		}
		console.log(datas);
		res.json({error:0,message:"success",data:datas});
	})
})
router.get("/kedown",function(req,res){
	console.log("价格降序");
	Good.find({tag:"科学人文"}).sort({price:-1}).exec(function(err,datas){
		if(err){
			return res.end(err);
		}
		console.log(datas);
		res.json({error:0,message:"success",data:datas});
	})
})

//---青春文学--------------------------------------------------------------------
router.get("/qingchun",function(req,res){
	console.log("青春文学");
	var page = req.query.page;
	var page = parseInt(page);
	Good.find({tag:"青春文学"}).skip(3 * page).limit(3).populate("master").exec(function(err,datas){
		if(err){
			return res.end(err);
		}
		console.log(datas);
		res.json({error:0,message:"success",data:datas});
	})
})


// 价格升序
router.get("/qingup",function(req,res){
	console.log("价格升序");
	Good.find({tag:"青春文学"}).sort({price:1}).exec(function(err,datas){
		if(err){
			return res.end(err);
		}
		console.log(datas);
		res.json({error:0,message:"success",data:datas});
	})
})
router.get("/qingdown",function(req,res){
	console.log("价格降序");
	Good.find({tag:"青春文学"}).sort({price:-1}).exec(function(err,datas){
		if(err){
			return res.end(err);
		}
		console.log(datas);
		res.json({error:0,message:"success",data:datas});
	})
})

//---世界名著--------------------------------------------------------------------
router.get("/mingzhu",function(req,res){
	console.log("世界名著");
	var page = req.query.page;
	var page = parseInt(page);
	Good.find({tag:"世界名著"}).limit(3).skip(3 * page).populate("master").exec(function(err,datas){
		if(err){
			return res.end(err);
		}
		console.log(datas);
		res.json({error:0,message:"success",data:datas});
	})
})
// 价格升序
router.get("/mingup",function(req,res){
	console.log("价格升序");
	
	Good.find({tag:"世界名著"}).sort({price:1}).exec(function(err,datas){
		if(err){
			return res.end(err);
		}
		console.log(datas);
		res.json({error:0,message:"success",data:datas});
	})
})
router.get("/mingdown",function(req,res){
	console.log("价格降序");
	Good.find({tag:"世界名著"}).sort({price:-1}).exec(function(err,datas){
		if(err){
			return res.end(err);
		}
		console.log(datas);
		res.json({error:0,message:"success",data:datas});
	})
})

//---探索解秘--------------------------------------------------------------------
router.get("/tansuo",function(req,res){
	console.log("探索解密");

	Good.find({tag:"探索解密"}).populate("master").exec(function(err,datas){
		if(err){
			return res.end(err);
		}
		console.log(datas);
		res.json({error:0,message:"success",data:datas});
	})
})
// 价格升序
router.get("/tanup",function(req,res){
	console.log("价格升序");
	Good.find({tag:"探索解秘"}).sort({price:1}).exec(function(err,datas){
		if(err){
			return res.end(err);
		}
		console.log(datas);
		res.json({error:0,message:"success",data:datas});
	})
})
router.get("/tandown",function(req,res){
	console.log("价格降序");
	Good.find({tag:"探索解秘"}).sort({price:-1}).exec(function(err,datas){
		if(err){
			return res.end(err);
		}
		console.log(datas);
		res.json({error:0,message:"success",data:datas});
	})
})

//---儿童文学--------------------------------------------------------------------
router.get("/ertong",function(req,res){
	console.log("儿童文学");

	Good.find({tag:"儿童文学"}).populate("master").exec(function(err,datas){
		if(err){
			return res.end(err);
		}
		console.log(datas);
		res.json({error:0,message:"success",data:datas});
	})
})

// 价格升序
router.get("/erup",function(req,res){
	console.log("价格升序");
	Good.find({tag:"儿童文学"}).sort({price:1}).exec(function(err,datas){
		if(err){
			return res.end(err);
		}
		console.log(datas);
		res.json({error:0,message:"success",data:datas});
	})
})
router.get("/erdown",function(req,res){
	console.log("价格降序");
	Good.find({tag:"儿童文学"}).sort({price:-1}).exec(function(err,datas){
		if(err){
			return res.end(err);
		}
		console.log(datas);
		res.json({error:0,message:"success",data:datas});
	})
})


// 跳转商品的详情页面----买家所看的-------------------------------------------------
router.get("/shopdetails",function(req,res){
	console.log("111111111111");
	console.log(req.query);
	let id = req.query.id;
	let check = true ;
	if(req.session.buyer){
		let buyer_id = req.session.buyer._id;
		Buyer.findOne({"_id":buyer_id}).exec(function(err,buyer){
			
			Good.findOne({"_id":id}).populate("goodid").populate("master").exec(function(err,data){
				if(err){
					return res.end(err);
				}
		//		console.log("11111111111111");
				console.log(data);
				for(var i = 0;i < buyer.collect.length; i++){
					if( buyer.collect[i]._id == id ){
						console.log("3333333333333");
						console.log(buyer.collect[i].check_collect);
						check = false;
						break;
					}
				}
				console.log("sssssssssssssssssssss");
				res.json({error:0,message:"success",data:data,check:check});
			})
		})
	}else{
		Good.findOne({"_id":id}).populate("master").exec(function(err,data){
			if(err){
				return res.end(err);
			}
		//	console.log("11111111111111");
			console.log(data);
			console.log("sssssssssssssssssssss");
			res.json({error:0,message:"success",data:data,check:"1"});
		})
	}
	
})

// 商品被收藏时---收藏数量 + 1 -----------------------------------------
router.get("/xuanCollect",function(req,res){
//	console.log(req.query);
	let isOk = false; 
	let shopIndex ;
	let isShop = false;
	let id = req.query.id;  // 当前商品的id
	if(req.session.buyer){
		let buyer_id = req.session.buyer._id;

		Buyer.findOne({"_id":buyer_id}).exec(function(err,buyer){
			Good.findOne({"_id":id}).exec(function(err,data){
				if(err){
					return res.end(err);
				}
//				console.log("11111111111111");
//				console.log(data);
				console.log("buyer.collect.length = "+buyer.collect.length);
				// length <= 0,代表还没有收藏，直接push，将check_collect改为true
				if(buyer.collect.length <= 0 ){
					data.check_collect = true;
					data.collected++;
					data.save();
					buyer.collect.push(data);
					buyer.save();
					console.log("222222222222222222222222222222222222222222");
				}else{
					console.log("长度超过0----------------------------------------------");
					console.log("data._id= "+data._id);
					// length > 0,代表有收藏的商品，需进行遍历
					buyer.collect.forEach(function(good){
						console.log("good._id= "+good._id);
						if( good._id === data._id ){
							// 数量不用加 1-----------------------
//							data.collect = data.collect; //----
							// 将买家收藏列表中的check_collect改为false
							good.check_collect = false;
//							console.log(good.check_collect);  //false
							isOk = true;
							return;
						}else{
							// 当前点击收藏的商品的id与数据库中的不一样
							isOk = false;
						}
					})
//					buyer.save();
//					console.log(buyer);
					if( !isOk ){
						console.log("----------- isok =" + isOk);
						//被收藏的数量 + 1
						data.collected++;
						data.save();
						// 将被收藏的商品的--检测被收藏-属性改为true---push到当前买家
						// true：代表被收藏，前端根据这个变样式
						data.check_collect = true;
						buyer.collect.push(data);
//						buyer.save();
					}else{
						// id相等---------------------------------------
						// 删除收藏中的check_collect=false的商品
						buyer.collect.forEach(function(shop,index){
							if( shop.check_collect == false ){
//								shopIndex = index;
//								console.log(index);
//								console.log(shopIndex);
//								isShop = true;
								buyer.collect.splice(index,1);
							}
						})
//						if( isShop ){
//							buyer.collect.splice(shopIndex,1);
////						buyer.save();
//						}
					}
					buyer.save();
					console.log("33333333333333");
					console.log(data.check_collect);
				}
				// 更改session信息
				req.session.buyer = buyer;
				console.log(buyer);
				res.json({error:0,message:"success",data:buyer});
			})

		})
	}else{
		res.json({error:-1,message:"还没有登录，快去登录吧"});
	}
	
})





module.exports = router;