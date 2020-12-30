const exp=require('express')
const jwt=require('jsonwebtoken');
const app = require('../app');
const router=exp.Router()
router.use(exp.json())
function verifyToken(token,userid)  //function to verify access token
{  

    jwt.verify(token,"abcdef",(err,verifiedtoken)=>{
        if(err)
        next(err)
        else
        {    
              if(userid===verifiedtoken.userid){
            
              }
              else
               res.send({msg:"not a valid token"})
        }
    })

}


//to send details of expenses of a user
router.get('/expensesdetail',(req,res,err)=>
{
    verifyToken(req.body.token,req.body.userid)
    let dbo=req.app.locals.dbObject.db('expenses')
    dbo.collection('category').findOne({userid:req.body.userid},(err,obj)=>{
        if(err)
        next(err)
        if(obj!=null)
        {
            x={}
            for(var keys in obj)
            {
                if(keys!="_id" && keys!="userid" && obj[keys].length!=0)
                 x[keys]=obj[keys]
            }
            res.send(x)
        }
        else
        {
            res.send({msg:"Havent added any expenses"})
        }

    })
})

//to send details of expenses of a user on specific day
router.get('/filterbyday',(req,res,err)=>{
    verifyToken(req.body.token,req.body.userid)
    let dbo=req.app.locals.dbObject.db('expenses') 
    dbo.collection('category').findOne({userid:req.body.userid},(err,obj)=>{
        if(err)
        next(err)
        if(obj!=null)
        {
            x={}
            for(var keys in obj)
            {
                if(keys!="_id" && keys!="userid" && obj[keys].length!=0)
                 {
                     console.log(obj[keys])
                     for(var i in obj[keys])
                     {
                         console.log(i)
                         if(obj[keys][i]['day']===req.body.day)
                          x[keys]=obj[keys][i];
                     }
                 }
            }
            res.send(x)
        }
        else
        {
            res.send({msg:"Havent added any expenses"})
        }

    })
    
}) 


//to send details of expenses of user for specific category
router.get('/filterbycategory',(req,res,err)=>{
    verifyToken(req.body.token,req.body.userid)
    let dbo=req.app.locals.dbObject.db('expenses') 
    dbo.collection('category').findOne({userid:req.body.userid},(err,obj)=>{
        if(err)
        next(err)
        if(obj!=null)
        {
            x={}
            for(var keys in obj)
            {
                if(keys===req.body.category)
                 {
                     x[keys]=obj[keys];
                 }
            }
            res.send(x)
        }
        else
        {
            res.send({msg:"Havent added any expenses"})
        }

    })
    
}) 


//to send details of expenses of user if amount is in given range
router.get('/filterbyamount',(req,res,err)=>{
    verifyToken(req.body.token,req.body.userid)
    let dbo=req.app.locals.dbObject.db('expenses') 
    dbo.collection('category').findOne({userid:req.body.userid},(err,obj)=>{
        if(err)
        next(err)
        if(obj!=null)
        {
            x={}
            for(var keys in obj)
            {
                if(keys!="_id" && keys!="userid" && obj[keys].length!=0)
                 {
                     
                     for(var i in obj[keys])
                     {
                         if(obj[keys][i]['amount']>=req.body.lowrange && obj[keys][i]['amount']<=req.body.highrange)
                          x[keys]=obj[keys][i];
                     }
                 }
            }
            res.send(x)
        }
        else
        {
            res.send({msg:"Havent added any expenses"})
        }

    })
    
}) 


//if there is any logical error in code
app.use((err,req,res,next)=>{
    res({msg:"error"})
})
module.exports=router