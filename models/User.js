const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
// const { options, delete } = require('../routers');
const{ Schema }=mongoose;
const userSchema=new Schema({
    firstname:{
        type:String,
        maxlength:140,

    },
    lastname:{
        type:String,
        maxlength:140,

    },
    email:{
        type:String,
        maxlength:200,

    },
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
    photo: {
        type:String,
        default:"../static/download.jpg-1611523975212.jpg",
    },

    
    following: [{ 
        type:Schema.Types.ObjectId,
        ref: 'User' 
    }],
    followers: [{ 
        type:Schema.Types.ObjectId,
        ref: 'User'
    }],
    Blog:{
    type:  Schema.Types.ObjectId,
    ref: 'Blog',
    
    }
    
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
// userSchema.pre('findOneAndUpdate',function preSave(next){
//     if(!this._update.password){
//         return;
//     }
//     this._update.password=bcrypt.hashSync(this._update.password,8);
//     console.log("dfdg");
//     next();
// });
userSchema.pre('findOneAndUpdate', function preSave(next) {
    if (!this._update.password) {
        next();
    }
    this._update.password = bcrypt.hashSync(this._update.password, 8);
    next();
});

userSchema.methods.validtedPassword=function validtedPassword(password){
    return bcrypt.compareSync(password,this.password);
}
const usermodel=mongoose.model('User',userSchema);
module.exports=usermodel;