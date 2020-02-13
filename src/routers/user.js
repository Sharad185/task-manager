const express=require('express');
const User=require('../model/user');
const auth=require('../middleware/auth');
const multer=require('multer');
const sharp=require('sharp');

const router = new express.Router();

router.post('/users', async (req,res)=>
{
   const user = new User(req.body);

// use of await concept
try{
  await user.save();
  const token=user.generateAuthToken();
  console.log(token);
  res.status(201).send(user);
}catch(e)
{
res.status(400).send(e);
}


  //  user.save().then(()=>
  //  {
  //   res.send(user);
  //  }).catch((err)=>{
  //   res.status(400);
  //    res.send(err);
  //  })
})


router.post('/users/login',async(req,res)=>{

  try 
  {
    const user = await User.findbyCredentials(req.body.email,req.body.password);
    const token=user.generateAuthToken();
    console.log(token);
   res.status(200).send({user});
    
  } catch (error) 
  {
    res.status(400).send(error);
  }

})
// to retrieve the full collection

router.get('/users/me',auth,async(req,res)=>
{

   res.send(req.user);


  // try{
  //   const user=await User.find({});
  //   res.status(201).send(user);
  // }catch(e)
  // {
  //  res.status(400).send(e);
  // }


  // User.find({}).then((success)=>
  // {
  //    res.send(success);
  // }).catch((err)=>
  // {
  //     res.status(500).send();
  // })
})

router.post('/users/logout',auth,async (req,res)=>
{
   try 
   {
     req.user.tokens=req.user.tokens.filter((token)=>{
       return token.token!=req.token;

     })

     await req.user.save();
     res.send();

   } catch (error) 
   {
     res.status(500).send();
   }



})


router.post('/users/logoutall',auth,async (req,res)=>
{
   try 
   {
     req.user.tokens=[];
     req.user.save();
     res.send();

   } catch (error) 
   {
    res.status(500).send();
   }



})
// to retrieve the collection by id

router.get('/users/:id',async (req,res)=>
{
 const _id = req.params.id;
 
 try {
  const sucess= await User.findById(_id);
  if(!sucess)
    {
        return res.status(404).send();
    }
     res.send(sucess);
 } catch (error) {
  res.status(500).send(error);
 }
  // User.findById(_id).then((success)=>
  // {
  //   if(!success)
  //   {
  //       return res.status(404).send();
  //   }
  //    res.send(success);
  // }).catch((err)=>
  // {
  //     res.status(500).send();
  // })
})

router.patch('/users/:id',async(req,res)=>
{
  const Updates = Object.keys(req.body);
  const allowupdates=['name','age','password']
  const isvalidoperation=Updates.every((update)=>allowupdates.includes(update))
  if(!isvalidoperation)
  {
    return res.status(400).send({error:"property not exist"})
  }
  try {

    //const user=await  User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});

    const user =await User.findById(req.params.id);

    Updates.forEach((update)=>user[update]=req.body[update]);

    user.save();

    //no user with ID then user has no value

    if(!user)
    {
      return res.status.send();
    }
       res.send(user);
    
  } catch (error) {
    res.status(400).send();
  }
});

router.delete('/users/me',auth,async (req,res)=>
{

try {
   await req.user.remove();
   res.send(req.user);
} catch (error)
 {
  res.status(500).send();
}

})

// uploading file

const uplaod = multer({
  //save file in database so remove dest
 // dest:'avatars',
  limits:{
    fileSize: 100000
  },
  fileFilter(req,file,cb)
  {
    if(!file.originalname.endsWith('jpg'))
    {
      return cb(new Error('Upload the jpg file'))
    }

    cb(undefined,true);
  }
});

router.post('/users/me/avatar',auth,uplaod.single('avatar'),async (req,res)=>{
// buffer variable is to create to store the resize image according to requirement.

  const buffer= await sharp(req.file.buffer).resize({width:120,height:120}).png().toBuffer();
  req.user.avtar=buffer;
  await req.user.save();
  res.send({sucess:'sucess'});
},(error,req,res,next)=>{

  //It is used for print message otherwise it will give long html message

  res.status(404).send({error:error.message});
})

// delete the user profile pic

router.delete('/users/me/avatar',auth,async (req,res)=>{

  req.user.avtar=undefined;
  await req.user.save();
  res.send({sucess:'sucessfully deleted'});
})

router.get('/users/:id/avatar',async (req,res)=>{

  try {
    
    const user = await User.findById(req.params.id);

    if(!user || !user.avtar)
    {
      throw new Error('user not exist');
    }
    res.set('Content-Type','image/png');
    res.send(user.avtar);
  } catch (error) 
  {
    res.status(404).send();
  }

  
})
module.exports=router;