const express=require('express');
const {create ,getAll,getId,editOne,deleteOne,getByTitle,getByAuther,getNew,getByTag,gets,getmyFblog,searchBlog,pushComment}=require('../controllers/blog');
const authMiddleware = require('../middlewares/auth');
const multer=require('multer');
const Blog=require('../models/Blog');
const User=require('../models/User');
const {getById}=require('../controllers/user');
const path=require('path');
const { type } = require('os');
const { types } = require('util');
const storage = multer.diskStorage({
    // destination: path.join(__dirname,"..","static","images"),
    destination:function(req,file,cb){
        cb(null, 'static/');

    },
    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
    }
});




const router=express.Router();

//router.use(authMiddleware);
router.post('/',authMiddleware,async (req, res, next) => {
    console.log(req.user);
const upload = multer({ storage: storage }).single("photo");

    upload(req,res,  function(err){
        console.log(req.user);
        const { body, user:{id} } = req;
        if(req.file!=undefined)
        body.photo= req.file.path;
    
        create({ ...body, auther: id }).then(blog=>res.json(blog)).catch(e=>next(e));
        // res.json(blog);
    
    
    });
    
});

router.get('/', async(req,res,next)=>{
    try{
    const blog=await getAll();
    res.json(blog);
    }
    catch(e){
        next(e);
    }

});
//get newly blogs
router.get('/new', async (req, res, next) => {

    try {
        const blog = await getNew();
        res.json(blog);

    } catch (e) {
        next(e);

    }
});
router.get('/myblogs',authMiddleware, async (req, res, next) => {
    const { user: { _id } } = req;
    
    try {

        const blog = await gets(_id);
        res.json(blog);
    } catch (e) {
        next(e);
    }
});
/*
router.get('/home',authMiddleware, async (req, res, next) => {
    const { user: { following } } = req;
    console.log(following)
    try {
        const blogs = await getmyFblog(following);
        res.json(blogs);
        console.log("inner try"+blogs)
    } catch (e) {
        next(e);
    }
});
*/
router.get('/home',authMiddleware,async(req,res,next)=>{
    
    userId = req.user.id;          // populate
   // const posts= await userController.getUserPosts(result._id);
   try{
     
    const {following} =   await  User.findById(userId);
    console.log(following);
    const Blogs =await Blog.find({auther:{$in:following}}).populate('auther');
    res.json({Blogs});
   }
  catch(e){
    next(e)
  }
})
router.get('/get/:id',authMiddleware,async(req , res ,next)=>{
    const {id}=req.params;
       try{
           const found    = await User.findById(id);
           if(found){
           const result = await getById(id);
           const Blogs= await gets(id);
           res.json({result,Blogs})
           }
           return res.json({'msg':'id is invalid'})
         }
          catch(e){
          next(e);
          } 
    });
    
router.get('/:id',async(req,res,next)=>{
    const {params:{id}}=req
    try{
        const blog=await getId(id);
        res.json(blog);
        }
        catch(e){
            next(e);
        }
    
});

router.patch('/addComment',authMiddleware, async (req, res, next) => {
    const { body:{id, Comment},user:{username} } = req;
    Comment.commenter = username;
    try {
        const user = await pushComment({ id, Comment});
        res.json(user);
    } catch (e) {
        console.log(e)
        next(e);
    }
});
// router.patch('/:id',async(req,res,next)=>{
//     const {params:{id},body}=req;
//     try{
//         const blog=await editOne(id,body);
//         res.json(blog);
//         }
//         catch(e){
//             next(e);
//         }
    
// });

router.patch('/:id',authMiddleware,async (req, res, next) => {
    
    
const upload = multer({ storage: storage }).single("photo");

    upload(req,res,  function(err){
        console.log(req.user);
        const { params:{id},body} = req;
        if(req.file!=undefined)
        body.photo= req.file.path;
    
        editOne(id,body).then(blog=>res.json(blog)).catch(e=>next(e));
        // res.json(blog);
    
    
    });
    
});

router.delete('/:id',async(req,res,next)=>{
    const {params:{id}}=req;
    try{
        const blog=await deleteOne(id);
       // res.json(blog);
        res.json({Msg:'object is deleted'});
    }catch(e){
        next(e)
    }
});

/**/ 
//get data bt title
router.get('/title/:title', async (req, res, next) => {
    const { params: { title } } = req;
    try {
        const blogs = await getByTitle({ title });
        res.json(blogs);
    } catch (e) {
        next(e);
    }
});

//get by auther
// router.get('/auther/:auther', async (req, res, next) => {
//     const { params: { auther } } = req;
//     try {
//         const blogs = await getByAuther({ auther });
//         res.json(blogs);
//     } catch (e) {
//         next(e);
//     }
// });
router.get('/auther/:id', async (req, res, next) => {
    const { params: { id } } = req;
    try {
        const blogs = await getByAuther({ id });
        res.json(blogs);
    } catch (e) {
        next(e);
    }
});

//get data by tag
router.get('/tags/:tags', async (req, res, next) => {
    const { params: { tags } } = req;
    try {
        const blogs = await getByTag({ tags });
        res.json(blogs);
    } catch (e) {
        next(e);
    }
});



router.get('/search/:searched', async (req, res, next)=>{
    const { params: { searched } } = req;
    try {
        const results = await searchBlog(searched);
        res.json(results);
    } catch (e) {
        next(e);
    }
});



module.exports=router;