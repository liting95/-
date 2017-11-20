// 没用到--------------------------------------------------
const mongoose = require("mongoose");
// 导入数据库
const db = require("./db");
const shortid = require("shortid");
const Schema = mongoose.Schema;
const AddressSchema = new Schema({
    _id:{
        type:String,
        default:shortid.generate,
        unique:true
    },
    // 收货人
    receiver:{
    	type:String,
    	ref:"buyer"
    },
    // 街道
    street:{
    	type:String
    },
    // 电话
    telphone:{
    	type:String,
    	
    },
    //  
    checked:{
    	type:Boolean,
    	default:false
    },
    // 邮编
    code:{
    	type:String,
    	default:453001
    }
    
})


const Address = mongoose.model("address",AddressSchema);
module.exports = Address;