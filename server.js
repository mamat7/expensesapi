const exp=require('express'); 
const app=exp();    //to create express app
const user=require('./api/userapi')
const category=require('./api/category')
const display=require('./api/show')
const mc=require('mongodb').MongoClient
const path=require('path')
app.listen(3000,()=>{console.log("server is listening on port 3000");});  //to make server on port 3000
app.use(exp.static(path.join("__dirname",'public')));
app.use('/user/profile',user);
app.use('/user/category',category);
app.use('/user/dashboard',display);


app.use((req,res,next)=>{
    res.send({message:"invalid url"})
})
var dbObject;
//to create connection with the database
var dbUrl="mongodb+srv://mamatha:mamatha777@cluster0.ynela.mongodb.net/<dbname>?retryWrites=true&w=majority";
mc.connect(dbUrl,{useNewUrlParser:true,useUnifiedTopology:true},(err,client)=>{
    if(err)
    {
        console.log("Err in db connect ",err);
    }
    app.locals.dbObject=client;
    console.log('connected to mongodb');
    
    
});


