const exp=require('express')
const jwt=require('jsonwebtoken');
const router=exp.Router()
ObjectId = require('mongodb').ObjectID;
router.use(exp.json())

//to display profile of user
router.get('/display',(req,res,next)=>{
    //to verify access token which verifies user identity
    jwt.verify(req.body.token,"abcdef",(err,verifiedtoken)=>{
        
        
        if(err){
            next(err)
        }
        else
        {
            var userid=verifiedtoken.userid
            console.log(userid,req.body.userid)
            if(userid===req.body.userid)
            {

                let dbo=req.app.locals.dbObject.db('expenses');
                //to find document which have the respective id
                dbo.collection('user').findOne({_id:ObjectId(req.body.userid)},(err,obj)=>
                {
                    if(err)
                     next(err)
                    if(obj!=null)
                    {
                        res.send({msg:'success',name:obj.name,email:obj.email,dob:obj.dob})
                    }
                    else
                    {
                        res.send({msg:'user not exist'})
                    }
                })  

            }
            else
            {
                res.send({msg:'not a valid tokens'})
            }
        }
    })
    console.log("in profile");
})


//to register user
router.post('/signup',(req,res,next)=>{
    let dbo=req.app.locals.dbObject.db('expenses');
    //to insert document in collection
    dbo.collection('user').insertOne({name:req.body.name,email:req.body.email,dob:req.body.dob},(err,result)=>{
        if(err)
         next(err);
        else{
            //creatting signature which helps to verify user identity
            jwt.sign({userid:result.insertedId},"abcdef",{expiresIn: 604800},(err,signedToken)=>{
                if(err){
                    next(err);
                }
                console.log('sign up successfully')
                res.send({msg:'success',token:signedToken,userid:result.insertedId}); //sending token and objectid to store in localstorage
            });
           
           
        }
    })
})

//if there is any logical errors in code
router.use((err,req,res,next)=>{
console.log('error:',err)
res.send({msg:err})
})
module.exports=router