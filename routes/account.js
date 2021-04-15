const express = require('express');
const router = express.Router();
const User = require('../modules/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');

// router.get('/reg', (req,res) =>{
// res.send("Registration Page");
// });

router.post('/reg', (req,res) =>{
    let newUser = new User({
      name: req.body.name,
      email:req.body.email,
      login:req.body.login,
      password:req.body.password
    });

    User.addUser(newUser,(err,user)=>{
    if(err)
    res.json({success:false, msg:"Error"});
    else
      res.json({success:true, msg:"Success"});
    });
});

router.post('/auth', (req,res) =>{
  const login = req.body.login;
  const password = req.body.password;

  User.getUserByLogin(login, (err,user) =>{
if(err) throw err;
if(!user)
  return res.json({success:false, msq:"NOT FOUND"});

User.comparePass(password, user.password, (err,isMatch)=>{
if(err) throw err;
if(isMatch){
const token = jwt.sign(user.toJSON(), config.secret,{
  expiresIn: 3600*48
    });
res.json({
success:true,
token:'JWT' + token,
user:{
  id: user._id,
  name: user.name,
  login: user.login,
  email: user.email
    }
});

} else
  return res.json({success:false, msq:"FALSE PASSWORD"});

    });
  });
});

router.get('/dashboard', passport.authenticate('jwt',{session:false}), (req,res) =>{
res.send("Personal Page");
});

module.exports = router;
