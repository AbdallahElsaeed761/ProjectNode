const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
// const { options, delete } = require('../routers');
const{ Schema }=mongoose;
const userSchema=new Schema({
    username:{
        type:String,
        unique:true,
        maxlength:140,
        required:true,
    },
    password:{
        type: String,
        required:true,
    },
    firstname:{
        type:String,
        maxlength:140,

    },
    following: [{ 
        type:mongoose.Schema.ObjectId,
        ref: 'User' 
    }],
    followers: [{ 
        type:mongoose.Schema.ObjectId,
        ref: 'User'
    }],

    
},
{
    toJSON:{
        transform:(doc,ret,options)=>{
            delete ret.password;
            return ret;
        },
    },
});
userSchema.pre('save',function preSave(next){
    this.password=bcrypt.hashSync(this.password,8);
    next();
});
userSchema.pre('findOneAndUpdate',function preSave(next){
    if(!this._update.password){
        return;
    }
    this._update.password=bcrypt.hashSync(this._update.password,8);
    next();
});
userSchema.methods.validtedPassword=function validtedPassword(password){
    return bcrypt.compareSync(password,this.password);
}
const usermodel=mongoose.model('User',userSchema);
module.exports=usermodel;