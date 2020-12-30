const exp=require('express')
const jwt=require('jsonwebtoken');
const router=exp.Router()
router.use(exp.json())
function verifyToken(token,userid)   //function used to verify access token
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

//to get all the distinct categories in a document
router.get('/getcategories',(req,res,next)=>{
    verifyToken(req.body.token,req.body.userid);
        let dbo=req.app.locals.dbObject.db('expenses')
        dbo.collection('category').findOne({userid:req.body.userid},(err,obj)=>{
            if(err)
            next(err)
            else
            {
            data=[]
            for(var key in obj)
             if(key!="_id" && key!="userid")
              data.push(key)
            res.send({categories:data})
            }
        })

})

//to add category for a document
router.post('/addcategory',(req,res,next)=>{
   verifyToken(req.body.token,req.body.userid);
    let dbo=req.app.locals.dbObject.db('expenses');
    //finding document based on userid and adds given category to it
    dbo.collection('category').findOne({userid:req.body.userid},(err,obj)=>{
     if(err)
     next(err)
     if(obj!=null)
     {
         var y=req.body.category
         if(obj[y])
         res.send({msg:"this category is already there"})
         else{
         dbo.collection('category').updateOne({userid:req.body.userid},{$set:{[y]:[]}},(err,obj)=>{
             if(err)
             next(err);
             else 
             res.send({msg:"added category successfully"})
         })}
     }
     else
     {
        var y=req.body.category
        var obj1={
            userid:req.body.userid,
            food:[],
            travel:[],
            shopping:[],
            others:[],
            [y]:[]
        }

        dbo.collection('category').insertOne(obj1,(err,obj)=>{
            if(err)
            next(err)
            else
            res.send({msg:"added category successfully"})
        }) 
     }
    })
})

//to delete category from a document
router.post('/deletecategory',(req,res,next)=>{
    verifyToken(req.body.token,req.body.userid); //function to verify access token
    let x=req.body.category
    if(x==="food" || x==="travel"|| x==="shopping")
    res.send({msg:"this category cant be deleted"})
    else{
    let dbo=req.app.locals.dbObject.db('expenses')
    //finding document based on userid and deleting given category from it
    dbo.collection('category').findOne({userid:req.body.userid},(err,obj)=>{
        if(err)
        next(err)
        if(obj[[x]]){
    dbo.collection('category').updateOne({userid:req.body.userid},{$unset:{[x]:1}},(err,obj)=>{
        if(err)
         next(err)
        else
         res.send({msg:"deleted successfully"})
    })}
    else 
    {
        res.send({msg:"No such category exixts"})
    }
})
}
})

//to add expenses to user
router.post('/addexpenses',(req,res,next)=>{
    verifyToken(req.body.token,req.body.userid)
    var x={

        amount:req.body.amount,
        day:req.body.day,
        month:req.body.month
    }
    
    let dbo=req.app.locals.dbObject.db('expenses')
    //finding the category based on user objectid and adding expenes to it
    dbo.collection('category').findOne({userid:req.body.userid},(err,obj)=>{
        if(err)
        next(err)
        if(obj!=null)
        {
            var y=req.body.category
            console.log(obj[y])
            dbo.collection('category').updateOne({userid:req.body.userid},{$push:{[y]:x}},(err,obj1)=>{
               if(err)
               next(err)
               else 
               res.send({msg:"expenses added successfully"})
            })
        }
        else 
        {
            var p={
            userid:req.body.userid,
            food:[],
            travel:[],
            shopping:[],
            others:[],
            }
            var y=req.body.category
            p[y].push(x)
            dbo.collection('category').insertOne(p,(err,obj1)=>{
                if(err)
                next(err)
                else{
                 res.send({msg:"expenses added successfully"})
                }

            })
        }
    })

})

//if there are any logical errors in code
router.use((err,req,res,next)=>{
res.send({msg:"error"})
})
module.exports=router