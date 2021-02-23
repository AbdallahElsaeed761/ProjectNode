const User=require('../models/User');
const jwt=require('jsonwebtoken');
const {promisify}=require('util');
const ascnjwtsign=promisify(jwt.sign);
const create=(user)=>User.create(user);
const login=async({username,password})=>{
    console.log(username,password);
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

const editOne=(id,data)=>{
    console.log(id,data);
    return User.findByIdAndUpdate(id,data,{new:true}).exec();}


// const getById= (id) => User.findById(id).exec();
const getById= (username) => User.findById(username).exec();

const searchUser = async(searched) => {
    const users = await User.find({ username: new RegExp(searched, 'i') }).exec();
    return users;
};



//follow function
// const follow = (id, targetid) => User.update(
//     { 
//         "_id": id 
//     },    
//     {        
//         $push: {
//             following: targetid,
//         }
//     }
    
// );
// //followes
// const followes = (id, targetid) => User.update(
//     { "_id": targetid },
//     {
//         $push: {
//             followers: id;
//         }
//     }
// );
// //unfollow function
// const unfollow = (id, targetid) => User.update(
//     { "_id": id },
//     {
//         $pull: {
//             following: targetid,
//         }
//     }
// );
const getFollowing=(id)=>User.findById(id).populate('following','firstname lastname photo').exec();
const getFollowers=(id)=>User.findById(id).populate('followers','firstname lastname photo').exec();

//unfollowes
// const unfollowes = (id, targetid) => User.update(
//     { "_id": targetid },
//     {
//         $pull: {
//             followers: id,
//         }
//     }
// );


    const pushfollowID = async(username, targetusername)=>{
    const loggedUser = await User.findOne({username:username}).exec();
    
    if (targetusername != username && !loggedUser.following.find(item => item == targetusername )){
        User.updateOne({username:username },{ $push : {following: targetusername } } ,{new:true}).exec();
        User.updateOne({username:targetusername}, { $push: { followers: username } }, { new: true }).exec();
        return {"status":"followed"}
    } else {
        return {"status":"can't follow"}
    }
}
const unfollowID = (username, targetusername)=>{
User.updateOne({username:username },{ $pull : {following: targetusername } } ,{new:true}).exec();
User.updateOne({username:targetusername}, { $pull: { followers: username } }, { new: true }).exec();
    return {"status":"unfollowed"}
}











module.exports={
    create,login,getAll,editOne,getById,pushfollowID,unfollowID,getFollowing,getFollowers,searchUser
}
//follow,followes,unfollow,unfollowes,
