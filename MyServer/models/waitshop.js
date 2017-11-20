
const mongoose = require("mongoose");
const db = require("./db");

const shortid = require("shortid");
const Schema = mongoose.Schema;

const WaitSchema = new Schema({
    // 商品id
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
    // 商品名
    name:{
        type:String,
        require:true
    },
    // 商品id
    good:{
    	type:String,
    	ref:"goods"
    },
    // 价格
    price:{
        type:Number,
    },
    // 数量
    count:{
    	type:Number,
    	default:1
    },
    // 商品分类
    tag:{
        type:String,
    },
    // 商品介绍
    desc:{
        type:String,
    },
    // 用来检测是否被选中
    checked:{
        type:Boolean,
        default:false,
    },
    // 用来看买家收藏
    collected:{
        type:Number,
        default:0,
    },
    // 先push用来检测买家是否收藏商品
    check_collect:{
    	type:Boolean,
    	default:false
    },
    // 商品图片
    photo:{
        type:Array,
        default:['/images/goodsimgs/defaultavatar.jpg']
    },
    // 库存
    stock:{
    	type:Number,
    	default:50
    },
    // 修改 -- 跳详情
    change:{
    	type:Boolean,
    	default:false
    },
    deleted:{
    	type:Boolean,
    	default:false
    }
})

const Wait = mongoose.model("waitshop",WaitSchema);
module.exports = Wait;