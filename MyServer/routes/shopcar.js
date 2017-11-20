var express = require('express');
const router = express.Router();
const Seller = require("../models/seller");
const Buyer = require("../models/buyer");
const validator = require("validator");

const Good = require("../models/goods");
const Car = require("../models/shopcar");

// 判断当前是否有用户登录
router.get("/getbuyer",function(req,res){
	if(req.session.buyer){
		res.json({error:0,message:"success"});
	}else{
		res.json({error:1,message:"failed"});
	}
})
// 查找属性checked为true的商品，计算  -----全选全不选没这个计算money，直接在方法中计算返回
router.get("/getCheck",function(req,res){
	console.log("查找属性checked为true的商品，计算---------------------");
	let buyer_id = req.session.buyer._id;
	let money = 0;
	let quantity = 0;
//	Buyer.findOne({"_id":buyer_id}).exec(function(err,buyer){
//		if(err){
//			return res.end(err);
//		}
//	})
	Car.find({queen:buyer_id,checked:true}).exec(function(err,cars){
		if(err){
			return res.end(err);
		}
		console.log(cars);
		cars.forEach(function(car){
			money += car.count * car.price;
			quantity += car.count;
		})
		res.json({error:0,message:"success",cars:cars,money:money,quantity:quantity});
	})
	
})

// 加入购物车
router.get("/shopcar",function(req,res){
	console.log("加入购物车------------------");
//	console.log(req.query);
	// 当前商品的id
	let id = req.query.id;
	let isCun = false; 
	if(req.session.buyer){
		let buyer_id = req.session.buyer._id;
		Buyer.findOne({"_id":buyer_id}).exec(function(err,buyer){
			if(err){
				return res.end(err);
			}
			Good.findOne({"_id":id}).exec(function(err,good){
				if(err){
					return res.end(err);
				}
				console.log(good);
				Car.find({queen:buyer_id}).exec(function(err,cars){
					if(err){
						return res.end(err);
					}
					cars.forEach(function(item){
						if(item.name == good.name){
							item.count++;
							isCun = true;
							console.log("进入相等--id------------------------");
							item.save();
							return;
						}
					})
					if(!isCun){
						console.log("不相等--id5555555------------------------");
						let car = new Car({
							name:good.name,
							price:good.price,
							tag:good.tag,
							desc:good.desc,
							master:good.master,
							photo:good.photo,
							queen:buyer_id,
						})
						car.save();
					}
					buyer.shopcar += 1;
					buyer.save();
					req.session.buyer = buyer;
					res.json({error:0,message:"add success"});
				})
			})
		})
	}else{
		res.json({error:1,message:"亲，还没有登录哦"});
	}
	
})

// 获得购物车中的数据----------------------------------------------
router.get("/allshop",function(req,res){
	console.log("获得购物车中的数据-----------------------");
	let buyer_id = req.session.buyer._id;
	
	Car.find({"queen":buyer_id}).exec(function(err,datas){
		if(err){
			return res.end(err);
		}
		let isOK = true;
		for(var i = 0;i < datas.length; i++){
			console.log(datas[i].checked);
			if(datas[i].checked == false){
				isOk = false;
				return res.json({error:0,message:"success",data:datas,checked:false});
			}
		}

		res.json({error:0,message:"success",data:datas,checked:true});
	})
})

// 购物车数量-- ------------------------------------------------------
router.get("/sub",function(req,res){
	console.log("购物车数量-- -------------------------");
//	console.log(req.query);
	let id = req.query.id;
	let buyer_id = req.session.buyer._id;
	Car.findOne({"_id":id}).exec(function(err,data){
		if(err){
			return res.end(err);
		}
		Buyer.findOne({"_id":buyer_id}).exec(function(err,buyer){
			if(err){
				return res.end(err);
			}
			buyer.shopcar = buyer.shopcar - 1;
			buyer.save();
			req.session.buyer = buyer;
		})
		data.count--;
		data.save().then((result)=>{
			Car.find({"queen":buyer_id}).exec(function(err,datas){
				if(err){
					return res.end(err);
				}
				res.json({error:0,message:"success",data:datas});
			})
		});
	})
})

// 购物车数量++ ------------------------------------------------------
router.get("/add",function(req,res){
	console.log("购物车数量++ --------------------------------");
//	console.log(req.query);
	let id = req.query.id;
	let buyer_id = req.session.buyer._id;
	Car.findOne({"_id":id}).exec(function(err,data){
		if(err){
			return res.end(err);
		}
		Buyer.findOne({"_id":buyer_id}).exec(function(err,buyer){
			if(err){
				return res.end(err);
			}
			buyer.shopcar = buyer.shopcar + 1;
			buyer.save();
			req.session.buyer = buyer;
		})
		data.count++;
		data.save().then((result)=>{
			Car.find({"queen":buyer_id}).exec(function(err,datas){
				if(err){
					return res.end(err);
				}
				res.json({error:0,message:"success",data:datas});
			})
		});

	})
})

// 购物车数量 --删除 ------------------------------------------------------
router.get("/del",function(req,res){
	console.log("购物车数量 --删除 ----------------");
	console.log(req.query);
	let id = req.query.id;
	let buyer_id = req.session.buyer._id;
	Car.findOneAndRemove({"_id":id}).exec(function(err,data){
		if(err){
			return res.end(err);
		}
		Buyer.findOne({"_id":buyer_id}).exec(function(err,buyer){
			if(err){
				return res.end(err);
			}
			buyer.shopcar = buyer.shopcar - data.count;
			buyer.save();
			req.session.buyer = buyer;
		})
		data.save();
		Car.find({"queen":buyer_id}).exec(function(err,datas){
			if(err){
				return res.end(err);
			}
			res.json({error:0,message:"success",data:datas});
		})

	})
})

// 购物车商品全选----------------------------------------------------------
router.get("/all",function(req,res){
	console.log("购物车商品全选-----------------");
	let buyer_id = req.session.buyer._id;
	let quantity = 0;
	let money = 0;
	Car.find({"queen":buyer_id}).exec(function(err,datas){
		if(err){
			return res.end(err);
		}
	// 不用buyer中的orderList属性，到时计算订单只需在shopcar集合中选checked为true即可
		datas.forEach(function(data){
			data.checked = true;
			data.save();
			money += data.count * data.price;
			return money;
		})

		Car.find({"queen":buyer_id}).exec(function(err,datas){
			if(err){
				return res.end(err);
			}
			console.log(datas);
			res.json({error:0,message:"success",data:datas,money:money});
				
		})
		
	})
	
})

// 购物车商品全部不选------------------------------------------------------------、
router.get("/unall",function(req,res){
	console.log("购物车商品全不选-----------------");
	let buyer_id = req.session.buyer._id;
	let checked = false;
	let quantity = 0;
	
	let money = 0;
	Car.find({"queen":buyer_id}).exec(function(err,datas){
		if(err){
			return res.end(err);
		}
		
		datas.forEach(function(data){
			data.checked = false;
			quantity += data.count;
			data.save();
			
		})
		Car.find({"queen":buyer_id}).exec(function(err,datas){
				if(err){
					return res.end(err);
				}
				console.log(datas);
				res.json({error:0,message:"success",data:datas,money:money});
				
		})
//		res.json({error:0,message:"success",data:datas,checked:false,money:money});
	})
})

// 购物车商品--单--个--选------------------------------------------------------------
router.get("/single",function(req,res){
	console.log("购物车商品--单--个--选----------------");
	console.log(req.query);
	// 当前用户的id
	let buyer_id = req.session.buyer._id;
	// 当前商品的id
	let id = req.query.id;
	// 当前商品的索引值index
	let index = req.query.index;
	let check;
	Car.findOne({"_id":id}).exec(function(err,data){
		if(err){
			return res.end(err);
		}
		data.checked = !data.checked;
		console.log(data);
		data.save().then((result)=>{
			console.log(result);
			console.log("111111111111111111111");
//			res.json({error:0,message:"success",data:data});
			Car.find({"queen":buyer_id}).exec(function(err,datas){
				if(err){
					return res.end(err);
				}
				
				console.log(datas);
				res.json({error:0,message:"success",data:datas});
				
			})
			
		}).catch((err)=>{
			console.log(err);
		});

//		res.json({error:0,message:"success",data:data,check:check});
	})
	
})





module.exports = router;