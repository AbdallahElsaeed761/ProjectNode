const express=require('express');
const auth = require('../middlewares/auth');

const {create,login,getAll,editOne,unfollow,unfollowes,follow,followes}=require('../controllers/user');
const router=express.Router();
router.post('/',async(req,res,next)=>{
    const {body}=req;
    try{
        const user=await create(body);
        res.json(user);
    }
    catch(e){
        next(e);
    }
});
router.post('/login',async(req,res,next)=>{
    const {body}=req;
    try{
        const user=await login(body);
        res.json(user);
    }
    catch(e){
        next(e);
    }
});
router.get('/',async(req,res,next)=>{
    const {body}=req;
    try{
        const user=await getAll(body);
        res.json(user);
    }
    catch(e){
        next(e);
    }
});
router.patch('/:id',async(req,res,next)=>{
    const {params:{id},body}=req;
    try{
        const user=await editOne(id,body);
        res.json(user);
    }
    catch(e){
        next(e);
    }

});

//follow
router.use(auth);
router.post('/follow/:followid', async (req, res, next) => {
    const { params: { followid }, user: { id } } = req;
    
    try {

        const userfollowID = await follow(id, followid);
        const userfollowIDes = await followes(id, followid);
        res.json({userfollowID,userfollowIDes});
    } catch (e) {
        next(e);
    }
});
//unFollowes
router.use(auth);
router.post('/unfollow/:followid', async (req, res, next) => {
    const { params: { followid }, user: { id } } = req;
    try {

        const userunfollowID = await unfollow(id, followid);
        const userunfollowIDes = await unfollowes(id, followid);
        res.json({userunfollowID,userunfollowIDes});
    } catch (e) {
        next(e);
    }
});


module.exports=router;