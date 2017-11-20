
const mongoose = require("mongoose");
// 导入数据库
const db = require("./db");
const shortid = require("shortid");
const Schema = mongoose.Schema;
const SellerSchema = new Schema({
    // 卖家id
    _id:{
        type:String,
        default:shortid.generate,
        unique:true
    },
    // 卖家用户名
    name:{
        type:String,
        require:true
    },
    // 卖家密码
    password:{
        type:String,
        require:true
    },
    // 卖家头像
    avatar:{
        type:String,
        default:"/images/sellerimgs/defaultavatar.jpg"
    },
    create_time:{
        type:Date,
        default:Date.now
    },
    // 卖家的商品
    goodList:{
        type:Number,
        default:0

    },
    // 卖家被关注
    beliked:{
        type:Number,
        default:0
    },
    // 描述
    desc:{
    	type:String,
    	default:"卖家很懒，什么也没有写"
    },
    connect:{
    	type:String,
    	
    }
})

const Seller = mongoose.model("seller",SellerSchema);
module.exports = Seller;