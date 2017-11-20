var express = require('express');
const router = express.Router();
const Seller = require("../models/seller");
const validator = require("validator");

const Good = require("../models/goods");

var multer = require('multer');


// 磁盘存储路径配置
// destination：存储的文件夹路径
// filename：文件名称
var storageg = multer.diskStorage({
    destination:'public/images/goodsimgs',
    filename: function (req, file, cb) {
    	var time = Date.now();
      	cb(null, file.fieldname + '-' + time +'.jpg');
      	
//    	if ( req.body.xu instanceof Array){
//          req.body.xu = req.body.xu[0]-0;
//      }else{
//          req.body.xu = req.body.xu-0;
//      }
	
      	req.body.avatar += "images/goodsimgs/" + file.fieldname + '-' + time +'.jpg,';
      	console.log(req.body.avatar);
    }
})
  // 根据配置信息生成处理对象
var uploadg = multer({ storage: storageg })
// upload.array('文件名称',最大数量) 批量处理文件
router.post('/uploadg',uploadg.array('photo',4),(req,res)=>{
    console.log("商品图像");
    console.log(req.body);
    let avatar = req.body.avatar;
//  console.log(avatar);
    avatar = avatar.slice(9);
//  console.log(avatar);
    avatar = avatar.slice(0,-1);
//  console.log(avatar);
    let goodImg = avatar.split(",");
    console.log(goodImg);
    
	Seller.findOne({"_id":req.session.seller._id}).exec(function(err,data){
    	if(err){
    		return res.end(err);
    	}
    	console.log("*************Seller****************");
    	console.log(data);
    	// 商品数量加1
    	data.goodList += 1;
    	data.save();
    	console.log(data);
    	req.session.seller = data;
    	req.body.master = req.session.seller._id;
    	
    	let good = new Good(req.body);
    	good.photo = goodImg;
//  	good.save();
//  	console.log(good);

    	good.save().then((data)=>{
//  		console.log(data);
    		res.json({error:0,message:"添加成功",data:data});
    	}).catch((err)=>{
    		console.log(err);
    	});
    	
    })
})

// 跳转---商品详情页面---------------------------------------------
router.get("/tixiang",function(req,res){
	console.log(1111111111111);
	console.log(req.query);
	let seller = req.session.seller._id;
	let id = req.query.id;
	Good.find({master:seller,change:true}).exec(function(err,data){
		if(err){
			return res.end(err);
		}
//		console.log(data);
		data.forEach(function(item){
			item.change = false;
			item.save();
		})
		Good.findOne({"_id":id}).exec(function(err,data){
			if(err){
				return res.end(err);
			}
			data.change = true;
			data.save().then((result)=>{
				res.json({error:0,message:"successs"});
			}).catch((err)=>{
				res.json({error:1,message:"failed"});
			})
		})
		
	})
})

// 商品详情页面-----------------------------------------------------
router.get("/details",function(req,res){
//	console.log(req.query);
	console.log(req.params);
	let seller = req.session.seller._id;
	console.log(seller);
	Good.findOne({master:seller,change:true}).exec(function(err,data){
		if(err){
			return res.end(err);
		}
//		console.log(data);
		res.json({error:0,message:"success",data:data});
	})
})

// 商品编辑页面-----------------------------------------------------
router.get("/edit",function(req,res){
	console.log("商品编辑页面");
//	console.log(req.body);
	let seller = req.session.seller._id;
	console.log(seller);
	Good.findOne({master:seller,change:true}).exec(function(err,data){
		if(err){
			return res.end(err);
		}
//		console.log(data);
		res.json({error:0,message:"success",data:data});
	})
	
})

router.post("/edit",function(req,res){
	console.log(req.body);
	let name = req.body.params.name;
	let price = req.body.params.price;
	let stock = req.body.params.stock;
	let desc = req.body.params.desc;
	let seller = req.session.seller._id;
//	console.log(seller);
	Good.findOne({master:seller,change:true}).exec(function(err,data){
		if(err){
			return res.end(err);
		}
//		console.log(data);
		data.name = name;
		data.price = price;
		data.stock = stock;
		data.desc = desc;
		data.save().then((result)=>{
//			console.log(result);
			res.json({error:0,message:"success",data:data});			
		}).catch((err)=>{
//			console.log(err);
			res.json({error:1,message:"failed",data:""});			
		})

	})
})
// 商品删除页面-----------------------------------------------------
router.get("/remove",function(req,res){
	console.log("商品删除页面");
//	console.log(req.query);
	let goodid = req.query.goodid;
	Good.findOneAndRemove({"_id":goodid}).exec(function(err,data){
		if(err){
			return res.end(err);
		}
//		console.log(data);
		res.json({error:0,message:"deleted success"});
	})
})




module.exports = router;  