const express=require('express');
const {create ,getAll,getById,editOne,deleteOne,getByTitle,getByAuther,getNew,getByTag}=require('../controllers/blog');
const authMiddleware = require('../middlewares/auth');

const router=express.Router();

router.use(authMiddleware);
router.post('/', async (req, res, next) => {
    const { body, user: { _id } } = req;

    try {
        const blog = await create({ ...body, auther: _id });
        res.json(blog);
    } catch (e) {
        next(e);
    }
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