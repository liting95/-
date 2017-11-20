var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
  
// });

// module.exports = router;

exports.index = (req,res,next)=>{
    res.render('index', { 
        title: 'Express' 
    });
}

exports.login = function(req,res){
  console.log(111111111111);
  res.render("login",{
    title:"登录",
  })
}