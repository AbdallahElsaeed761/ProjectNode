const express=require('express');
const mongoose=require('mongoose');
const router=require('./routers');
//mongoose.connect('mongodb://localhost:27017/Project',{ useUnifiedTopology: true });
const { MONGODB_URI } = process.env;
mongoose.connect(MONGODB_URI,{ useUnifiedTopology: true } );
const app=express();

app.use(express.json());

app.use('/',router);



app.use((req,res,next)=>{
    res.status(404).json({err:'notFound'});
})
app.use((err,req,res,next)=>{

    console.log(err);[]
    if(err instanceof mongoose.Error.ValidationError){
        return res.status(422).json(err.errors);
    }
    if(err.code===11000){
        res.status(422).json({statusCode:'validation error'});
    }
    if(err.message==='UN_AUTHENTICATED'){
        res.status(401).json({statusCode:"UN_AUTHENTICATED"});
    }
    res.status(503).end();
})

const {PORT=3000}=process.env;

app.listen(PORT,()=>{
    console.log('App is up and ready',PORT)
})