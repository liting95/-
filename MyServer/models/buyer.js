
const mongoose = require("mongoose");
// 导入数据库
const db = require("./db");
const shortid = require("shortid");
const Schema = mongoose.Schema;
const BuyerSchema = new Schema({
    // 买家id
    _id:{
        type:String,
        default:shortid.generate,
        unique:true
    },
    // 买家用户名
    name:{
        type:String,
        require:true
    },
    // 买家密码
    password:{
        type:String,
        require:true
    },
    // 买家头像
    avatar:{
        type:String,
        default:"/images/buyerimgs/defaultavatar.jpg"
    },
    create_time:{
        type:Date,
        default:Date.now
    },
    // 买家购物车
    shopcar:{
        type:Number,
        default:0
    },
    // 买家收藏
    collect:{
        type:Array,
        // default:0
    },
    // 用来检测买家是否收藏商品
    check_collect:{
    	type:Boolean,
    	default:false
    },
    // 买家关注
    likes:{
        type:Number,
        default:0
    },
    // 买家关注                       ----meiyongdaomaosi
    check_like:{
    	type:Boolean,
    	default:false
    },
    // 买家确认要买的商品    ----meiyongdaomaosi
    orderList:{
        type:Array,
    },
    // 买家地址
    adressList:{
        type:Array,
    }
})

const Buyer = mongoose.model("buyer",BuyerSchema);
module.exports = Buyer;
