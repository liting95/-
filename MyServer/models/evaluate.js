const mongoose = require("mongoose");
// 导入数据库
const db = require("./db");
const shortid = require("shortid");
const Schema = mongoose.Schema;

const EvaluateSchema = new Schema({
	_id:{
        type:String,
        default:shortid.generate,
        unique:true
    },
    // 
    content:{
    	type:String,
    	
    },
    // 
    create_time:{
    	type:Date,
    	default:Date.now
    },
    
    // 卖家
    master:{
    	type:String,
    	ref:"seller"
    },
    // 买家
    queen:{
    	type:String,
    	ref:"buyer"
    },
    // 商品
    good:{
    	type:String,
    	ref:"goods"
    }
    
})



const Evaluate = mongoose.model("evalute",EvaluateSchema);
module.exports = Evaluate;