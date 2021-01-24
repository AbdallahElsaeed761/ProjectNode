const jwt=require('jsonwebtoken');
const {promisify}=require('util');
const User = require('../models/User');
const ascverify=promisify(jwt.verify);
const auth=async(req,res,next)=>{
    const {header:{Authorization}}=req;
    if(!Authorization)
    {
        next((new Error('un_authenticated')));
    }
    try{
    const {id}=await ascverify(Authorization,'secret');
    const user=await User.findById(id).exec();
    res.user=user;
    next();
    }
    catch(e){
        next((new Error('un_authenticated')));
    }

}
module.exports=auth;