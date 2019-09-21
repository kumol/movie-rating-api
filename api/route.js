var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var Actor = require('../models/actor');
var Movie = require('../models/movie');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var checkAuth = require('../jwtherlper');
router.get("/actors",(req,res,next)=>{
    Actor.find().select("name birthday country _id").then((docs)=>{
        var response = {
            Actors:docs.map((result)=>{
                return{
                    name:result.name,
                    birthday:result.birthday,
                    country:result.country,
                    id:{
                        id:result.id,
                        message:'This Id to add actor to the movie'
                    }
                }
            })
        }    
        res.status(200).json(response);
    }).catch((err)=>{
        res.status(500).json({error:err});
    });
});
router.post('/actors',(req,res,next)=>{
    const actor = new Actor({
        _id : mongoose.Types.ObjectId(),
        name:req.body.name,
        birthday:req.body.birthday,
        country : req.body.country
    });
    actor.save().then((result)=>{
        res.json({
            name:result.name,
            birthday:result.birthday,
            country:result.country
        })
    }).catch((err)=>{
        res.status(500).json({
            error:err
        })
    }); 
});

router.post('/user/signup',(req,res,next)=>{
    var user = new User();
    user.userName=req.body.userName;
    user.password=req.body.password;
    User.findOne({userName:user.userName}).then((users)=>{
        if(!users){
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(user.password,salt,(err,hash)=>{
                    user.password=hash;
                    user.saltSecret=salt;
                    user.save().then((response)=>{
                        var token = jwt.sign({userName:user.username},"secret");
                        res.status(200).json(token)
                    }).catch((err)=>{
                        res.status(500).json({error:err})
                    })
                })
            })
        }else{
            res.status(400).json({message:"Duplicate User Found!"});
        }
    
    }).catch((err)=>{
        res.status(400).json({message:err});
    })
});
router.post("/user/login",(req,res,next)=>{
    var user = new User();
    user.userName=req.body.userName;
    user.password=req.body.password;
    User.findOne({userName:user.userName}).then((user)=>{
        bcrypt.compare(user.password,user.password).then((response)=>{
            var token = jwt.sign({userName:user.username},"secret");
            res.json({
                token:token
            })
        }).catch((err)=>{
            res.status(422).json({error:err});
        })
    }).catch((error)=>{
        res.status(422).json({error:error});
    })
});
router.post('/movies',(req,res,next)=>{
        const movie=new Movie({
            _id: mongoose.Types.ObjectId(),
            title: req.body.title,
            rating : req.body.rating,
            name : req.body.title,
            actor:req.body.actorId,
            year : req.body.year
        });
        movie.save().then((result)=>{
            res.json({
                message:"Movie added",
                createdMovie:{
                    title:result.title,
                    year:result.year,
                    rating:result.rating,
                    actors:result.actor
                }
            });
        }).catch((err)=>{
            res.status(201).json({
                message:'Actor not found',
                error:err
            });
        });
});
router.get('/movies',checkAuth.verifyJwtToken,(req,res,next)=>{
    Movie.find().select('title actor year rating').populate("actor","name country birthday").exec().then((docs)=>{
        var response = {
            coutn: docs.length,
            movie:docs.map((result)=>{
                return{
                    title:result.title,
                    year:result.year,
                    rating:result.rating,
                    actors:result.actor
                }

            })
        }    
        res.json(response);
    }).catch((err)=>{
        res.status(500).json({
            error:err
        })
    })
        
})
module.exports = router;