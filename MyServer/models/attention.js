const mongoose = require("mongoose");
// 导入数据库
const db = require("./db");
const shortid = require("shortid");
const Schema = mongoose.Schema;

const AttentionSchema = new Schema({
	_id:{
        type:String,
        default:shortid.generate,
        unique:true
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
    // liked; 看是否被关注
    liked:{
    	type:Boolean,
    	default:false
    }
})



const Attention = mongoose.model("attention",AttentionSchema);
module.exports = Attention;