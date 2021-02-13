const express=require('express');
const auth = require('../middlewares/auth');

const {create,login,getAll,editOne,getById,pushfollowID,unfollowID,unfollow,unfollowes,follow,followes,getFollowing,getFollowers,searchUser}=require('../controllers/user');
const router=express.Router();
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now());
    }
});
//register+ path.extname(file.originalname))
router.post('/', async (req, res, next) => {
    const upload = multer({ storage: storage }).single("photo");
    const { body } = req;
    console.log(body);
    upload(req, res, function (err) {
        console.log(req.user);
        const { body } = req;
        if (req.file != undefined)
            body.photo = req.file.path;

        create({ ...body }).then(blog => res.json(blog)).catch(e => next(e));

    });

});

// router.post('/',async(req,res,next)=>{
//     const {body}=req;
//     try{
//         const user=await create(body);
//         res.json(user);
//     }
//     catch(e){
//         next(e);
//     }
// });
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
router.use(auth);
router.get('/following', async (req, res, next) => {
    const { user: { id } } = req;
    
    try {

        const users = await getFollowing(id);
        res.json(users);
    } catch (e) {
        next(e);
    }
});

router.get('/followers',auth, async (req, res, next) => {
    const { user: { _id } } = req;
    
    try {

        const users = await getFollowers(_id);
        res.json(users);
    } catch (e) {
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
// router.patch('/:id',auth,async(req,res,next)=>{
//     const {params:{id},body}=req;
//     try{
//         const user=await editOne(id,body);
//         res.json(user);
//     }
//     catch(e){
//         next(e);
//     }

// });
router.patch('/:id' , auth  , async( req , res , next )=>{
    const{ params: { id } , body } = req;
    const upload = multer({ storage: storage }).single("photo");
    upload(req, res,async function (err) {
        
        const { body } = req;
        if (req.file != undefined)
            body.photo = req.file.path;
            try{
                const user = await editOne(id , body);
                res.json(user);
            }catch(e){
                next(e);
            }
        

    });

});
/**/ 

router.get('/mypage',auth, async (req, res, next) => {
    const { user } = req;
    try {
        res.json(user);
    } catch (e) {
        next(e);
    }
});


//getById
router.get('/:username', async (req, res, next) => {
    const { params: { username }, body } = req;
    try {
        const users = await getById(username, body);
        res.json(users);
    } catch (e) {
        next(e);
    }
});
// router.get('/:id', async (req, res, next) => {
//     const { params: { id }, body } = req;
//     try {
//         const users = await getById(id, body);
//         res.json(users);
//     } catch (e) {
//         next(e);
//     }
// });


//follow
/*
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
*/
router.get('/follow/:fusername',auth,async(req,res,next)=>{
    const {user: { username }, params: { fusername } } = req;
    try {
    const userfollowID = await pushfollowID(username,fusername);
    res.json(userfollowID);
    } catch (e) {
    next(e);
    }
})
router.get('/unfollow/:fusername',auth,async(req,res,next)=>{
    const {user: { username }, params: { fusername } } = req;
    try { 
        // debugger;
    const userfollowID = await unfollowID(username,fusername);
    res.json(userfollowID);
    } catch (e) {
    next(e);
    }
})

router.get('/search/:searched',auth, async (req, res, next) => {
    const { params: { searched } } = req;
    try {
        const results = await searchUser(searched);
        res.json(results);
    } catch (e) {
        next(e);
    }
})


module.exports=router;