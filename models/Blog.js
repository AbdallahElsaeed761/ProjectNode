const mongoose=require('mongoose');
const{ Schema }=mongoose;
const blogSchema=new Schema({
    title:{
        type:String,
        maxlength:256,
        required:true
    },
    tags:[String],
    body:{
        type:String,
        required:true,
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updateAt: Date,
    photo: String,
    auther: {
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    username: {
        type: String,
        maxLength: 256,
        //required: true
    },
    comments: [{
        body: String,
        commenter: String
    }],


});

const blogmodel=mongoose.model('Blog',blogSchema);
module.exports=blogmodel;
