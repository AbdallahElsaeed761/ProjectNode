const Blog=require('../models/Blog');
const create=(blog)=>{
return Blog.create(blog)

}
const getAll=(query)=>Blog.find({query}).exec();
const getById=(id)=>Blog.findById(id).exec();
const editOne=(id,body)=>Blog.findByIdAndUpdate(id,body,{new:true}).exec();
const deleteOne=(id)=>Blog.findByIdAndRemove(id).exec();
const getByTitle = ({title}) => Blog.find({title}).exec();
const getByTag = ({tags}) => Blog.find({tags}).exec();
const getByAuther = ({auther}) => Blog.find({auther}).exec();
const getNew = () => Blog.find().sort([['createdAT',-1]]).exec();

module.exports={
    create,getAll,getById,editOne,deleteOne,getByTitle,getByTag,getByAuther,getNew
}