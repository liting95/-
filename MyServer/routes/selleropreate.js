var express = require('express');
const router = express.Router();
const Seller = require("../models/seller");
const validator = require("validator");


var multer = require('multer');


// 磁盘存储路径配置
// destination：存储的文件夹路径
// filename：文件名称
var storages = multer.diskStorage({
    destination:'public/images/sellerimgs',
    filename: function (req, file, cb) {
    	var times = Date.now();
    	
	    cb(null, times +'.jpg');
	    
	    req.body.avatar = 'images/sellerimgs/' + times +'.jpg';
	    
	    console.log(req.body.avatar);
		console.log(times + ".jpg");
    }
})
  // 根据配置信息生成处理对象
var uploads = multer({ storage: storages });
// upload.array('文件名称',最大数量) 批量处理文件

//---商家修改头像--------------------------------------------------------------
router.post('/uploadtous',uploads.single('photo'),(req,res)=>{
    console.log("更改头像");
    console.log(req.body);
    Seller.findOne({"_id":req.session.seller._id}).exec(function(err,data){
    	if(err){
    		return res.end(err);
    	}
    	console.log(data);
    	data.avatar = req.body.avatar;
    	req.session.seller = data;
    	data.save().then((data)=>{
    		console.log(data);
    		res.json({error:0,message:"修改成功",data:data});
    	}).catch((err)=>{
    		console.log(err);
    	});
    	
    })

})

// 修改店铺名称------------------------------------
router.post("/editDianMing",function(req,res){
    console.log(req.body);
//  console.log(req.session.seller);
    let name = validator.trim(req.body.data);
    
    let id = req.session.seller._id;
    if(!validator.isLength(name,0)){
        res.json({error:-1,message:"内容不能为空"});
    }
    if(!validator.isLength(name,{max:10})){
        res.json({error:-2,message:"最多十个字符"});
    }
    Seller.findOne({"_id":id}).then((seller)=>{
        // console.log(seller);
        seller.name = name;
        seller.save();
        req.session.seller = seller;
//      console.log(seller);
        res.json({error:0,message:"修改成功",data:seller});
    }).catch((err)=>{
        // console.log(err);
        res.json({error:1,message:"修改失败",data:""});
    })
})


module.exports = router;