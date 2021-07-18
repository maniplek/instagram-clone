const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECTRET} = require('../keys')
const requireLogin = require('../middleware/requireLogin')





router.post('/signup', (req,res)=>{
    const {email , name , password} = req.body
    if(!email || !name || !password){
        return res.status(422).json({error:"enter all credentials "})
    }
    User.findOne({email:email})
     .then((savedUser)=>{
         if(savedUser){
             return res.status(422).json({error:'User arleady exist with that email...'});
         }
         bcrypt.hash(password ,12)
          .then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                name
            })
            user.save()
             .then(user=>{
                 res.json({message:'user successfuly saved...'});
             })
             .catch(err=>{
                 console.log(err)
             })
          })
         
     })
     .catch(err =>{
        console.log(err)
     })
     
})

 
router.post('/signin',(req,res)=>{
    const {email , password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"Please enter ur email and password"})
    }
    User.findOne({email:email})
     .then(savedUser=>{
         if(!savedUser) {
             return res.status(422).json({error:"Invalid email or password "})
         }
         bcrypt.compare(password,savedUser.password)
          .then(doMatch=>{
              if(doMatch){
                  //res.json({message:"Successfully signed in "});
                const token = jwt.sign({id:savedUser._id},JWT_SECTRET);
                res.json({token});
              }
              else{
                return res.status(422).json({error:"Invalid email or password "})
              }
          })
          .catch(err=>{
              console.log(err)
          })
     })
})

module.exports = router;