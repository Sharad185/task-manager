const jwt = require ('jsonwebtoken');
const User=require('../model/user');

const auth =async (req,res,next)=>
{
    try 
    {
       const token=req.header('Authorization').replace('Bearer ','');
       console.log(token);

       const decoded=jwt.verify(token,'ilovemycountry');
       console.log(token);
       //'token.token':token to check user did not logout
       const user = await User.findOne({ _id : decoded._id,'tokens.token':token})
       console.log(user);


       if(!user)
       {
           throw new Error;
       }
        req.token=token;
        req.user=user;
        next();
    } catch (error) 
    {
        res.status(401).send({error:"Please authenticate user"});
    }
}

module.exports=auth;