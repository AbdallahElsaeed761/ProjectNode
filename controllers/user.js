const User=require('../models/User');
const jwt=require('jsonwebtoken');
const {promisify}=require('util');
const ascnjwtsign=promisify(jwt.sign);
const create=(user)=>User.create(user);
const login=async({username,password})=>{
const user=await User.findOne({username}).exec();
if(!user){
    throw Error('Unauthenticated');
}
const validPass=user.validtedPassword(password);
if(!validPass){
    throw Error('Unauthenticated');
}
const token=await ascnjwtsign({
    username:user.username,
    id:user.id,
}, 'secret', { expiresIn: '1d' });
return {...user.toJSON(),token};
};
const getAll=()=>User.find({}).exec();

const editOne=(id,data)=>User.findByIdAndUpdate(id,data,{new:true}).exec();



//follow function
const follow = (id, targetid) => User.update(
    { 
        "_id": id 
    },    
    {        
        $push: {
            following: targetid,
        }
    }
    
);
//followes
const followes = (id, targetid) => User.update(
    { "_id": targetid },
    {
        $push: {
            followers: id,
        }
    }
);
//unfollow function
const unfollow = (id, targetid) => User.update(
    { "_id": id },
    {
        $pull: {
            following: targetid,
        }
    }
);
//unfollowes
const unfollowes = (id, targetid) => User.update(
    { "_id": targetid },
    {
        $pull: {
            followers: id,
        }
    }
);









module.exports={
    create,login,getAll,editOne,follow,followes,unfollow,unfollowes
}