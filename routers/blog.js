const express=require('express');
const {create ,getAll,getById,editOne,deleteOne,getByTitle,getByAuther,getNew,getByTag}=require('../controllers/blog');
const authMiddleware = require('../middlewares/auth');
const multer=require('multer');
const path=require('path');
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

// router.use(authMiddleware);
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
router.get('/:id',async(req,res,next)=>{
    const {params:{id}}=req
    try{
        const blog=await getById(id);
        res.json(blog);
        }
        catch(e){
            next(e);
        }
    
});
router.patch('/:id',async(req,res,next)=>{
    const {params:{id},body}=req;
    try{
        const blog=await editOne(id,body);
        res.json(blog);
        }
        catch(e){
            next(e);
        }
    
});
router.delete('/:id',async(req,res,next)=>{
    const {params:{id}}=req;
    try{
        const blog=await deleteOne(id);
       // res.json(blog);
        res.send('object is deleted');
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
router.get('/auther/:auther', async (req, res, next) => {
    const { params: { auther } } = req;
    try {
        const blogs = await getByAuther({ auther });
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


//get newly blogs
router.get('/new', async (req, res, next) => {

    try {
        const blog = await getNew();
        res.json(blog);

    } catch (e) {
        next(e);

    }
});











module.exports=router;