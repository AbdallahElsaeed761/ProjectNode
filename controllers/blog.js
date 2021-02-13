const Blog=require('../models/Blog');
const User=require('../models/User');

const create=(blog)=>{
return Blog.create(blog)

}
const getAll=(query)=>Blog.find({query}).exec();
const getById=(id)=>Blog.findById(id).exec();
const editOne=(id,body)=>Blog.findByIdAndUpdate(id,body,{new:true}).exec();
const deleteOne=(id)=>Blog.findByIdAndRemove(id).exec();
const getByTitle = ({title}) => Blog.find({title}).exec();
const getByTag = ({tags}) => Blog.find({tags}).exec();
//const getByAuther = ({auther}) => Blog.find({auther}).exec();
const getByAuther = ({ id }) => Blog.find({ auther:id }).exec();
const getNew = () => Blog.find().sort([['createdAT',-1]]).exec();

const gets = (id) => Blog.find({auther:id}).exec();
const getmyFblog = async (following) =>{
    const userids= await User.find({ username: { $in: following } }).exec();

    return Blog.find({auther:{$in: userids}}).populate('auther').exec()}
//const getFollowing=(id)=>User.findById(id).populate('following','firstname lastname photo').exec();
//const allPosts = [];

// const getmyFblog= (following, callback)=>{
//     Blog.find({auther:following.id}).exec((err, posts)=>{
//         if(err)
//             throw err;
//         else
            
//             return posts;
            
//     });
// };


const searchBlog = async (searched) => {
    if (!searched) {// return blogs of user who he is following
        const blogs = {};
        return blogs;
    }
    else {
        const blogs = await Blog.find({
            $or: [{ tags: new RegExp(searched, 'i') },
            { title: new RegExp(searched, 'i') },
            { username: new RegExp(searched, 'i') }]
        }).exec();
        return blogs;
    }
}
const pushComment = ({ id, Comment }) => Blog.findByIdAndUpdate(
    id,
    {
        $push: {
            comments: Comment,
        }
    }
    , { new: true }).exec();



module.exports={
    create,getAll,getById,editOne,deleteOne,getByTitle,getByTag,getByAuther,getNew,gets,getmyFblog,searchBlog,pushComment
}

