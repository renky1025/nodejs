var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var config = require('../config'); 
var db = mongoose.createConnection(config.db.mongodb);

db.on('error', function(error) {
    console.log(error);
});

// Schema 结构
var mongooseSchema = new mongoose.Schema({
    username : {type : String, default : '匿名用户'},
    title    : {type : String},
    content  : {type : String},
    time     : {type : Date, default: Date.now},
    age      : {type : Number}
});
var collectionName = "mongoose_mycollection";
// 添加 mongoose 实例方法
mongooseSchema.methods.findbyusername = function(username, callback) {
    return this.model(collectionName).find({username: username}, callback);
}
// 添加 mongoose 静态方法，静态方法在Model层就能使用
mongooseSchema.statics.findbytitle = function(title, callback) {
    return this.model(collectionName).find({title: title}, callback);
}
// model
var mongooseModel = db.model(collectionName, mongooseSchema);


/* GET users listing. */
router.get('/', function(req, res, next) {
    // 查询
    // 基于实例方法的查询
    var mongooseEntity = new mongooseModel({});
    mongooseEntity.findbyusername('model_demo_username2', function(error, result){
        if(error) {
            console.log(error);
        } else {
            res.render('userlist',{"title":"User List Page","userlist":result});
        }
        //关闭数据库链接
        db.close();
    });
});

router.get('/add', function(req, res, next) {
/*
// 增加记录 基于 entity 操作
var doc = {username : 'emtity_demo_username', title : 'emtity_demo_title', content : 'emtity_demo_content'};
var mongooseEntity = new mongooseModel(doc);
mongooseEntity.save(function(error) {
    if(error) {
        console.log(error);
    } else {
        console.log('saved OK!');
    }
    // 关闭数据库链接
    db.close();
});
*/
// 增加记录 基于model操作
var docs = [
                        {username : 'model_demo_username1', title : 'model_demo_title1', content : 'model_demo_content1'},
                        {username : 'model_demo_username2', title : 'model_demo_title2', content : 'model_demo_content2'},
                        {username : 'model_demo_username3', title : 'model_demo_title3', content : 'model_demo_content3'},
                        {username : 'model_demo_username4', title : 'model_demo_title4', content : 'model_demo_content4'},
                        {username : 'model_demo_username5', title : 'model_demo_title5', content : 'model_demo_content5'},
                        {username : 'model_demo_username6', title : 'model_demo_title6', content : 'model_demo_content6'},
                    
                    ];
        for(var i = 0; i < docs.length; i++) {
            (function (doc) {
/*                mongooseModel.create(doc, function(error){
                    if(error) {
                        console.log(error);
                    } else {
                        console.log('save ok');
                    }
                    if(i ==(docs.length-1)) db.close();*/
                    var mongooseEntity = new mongooseModel(doc);
                    mongooseEntity.save(function(error) {
                        if(error) {
                            console.log(error);
                        } else {
                            console.log('saved OK!:'+doc.username);
                        }
                    });
            })(docs[i]);
        }

    res.send('respond with a resource');
});
router.get('/edit', function(req, res, next) {
// 修改记录
//mongooseModel.update(conditions, update, options, callback);
var conditions = {username : 'model_demo_username1'};
var update     = {$set : {age : 27, title : 'model_demo_title_update'}};
var options    = {upsert : true};
mongooseModel.update(conditions, update, options, function(error){
    if(error) {
        console.log(error);
    } else {
        console.log('update ok!');
    }
    //关闭数据库链接
    db.close();
});
  res.send('respond with a resource');
});
router.get('/delete', function(req, res, next) {
	// 删除记录
	var conditions = {username: 'model_demo_username5'};
	mongooseModel.remove(conditions, function(error){
	    if(error) {
		res.send(error);
		console.log(error);
	    } else {
		res.send('delete ok!');
		console.log('delete ok!');
	    }
	    //关闭数据库链接
	    db.close();
	});
});
router.get('/find', function(req, res, next) {
/*
// 基于静态方法的查询
mongooseModel.findbytitle('emtity_demo_title', function(error, result){
    if(error) {
        console.log(error);
    } else {
        console.log(result);
    }
    //关闭数据库链接
    db.close();
});
*/
// mongoose find
    var criteria = {}; // 查询条件
    var fields   = {title : 1, content : 1, username : 1}; // 待返回的字段
    var options  = {};
    mongooseModel.find(criteria, fields, options, function(error, result){
        if(error) {
            console.log(error);
        } else {
           res.render('userlist',{"title":"User List Page","userlist":result});
        }
        //关闭数据库链接
        db.close();
    });
});
module.exports = router;
