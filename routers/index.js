const express=require('express');
const blog=require('./blog');
const user=require('./user');
const authmiddlware=require('../middlewares/auth');
const router=express.Router();


router.use('/blogs',blog);
router.use('/users',user);


module.exports=router
