var express = require('express');
var app = express();
var router = require('./api/route');
var port = process.env.port || 3000;
var mongoose = require("mongoose");
mongoose.connect("mongodb://admin:admin@ds227459.mlab.com:27459/example",(err)=>{
    if(!err){
        console.log("Database connected Successfully");
    }else{
        console.log(err);
    }
})
app.listen(port,()=>{
    console.log('Server starts at port',port);
})
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.json());
app.use('/api',router);