const express=require('express');
const Task=require('../model/task');
const auth=require('../middleware/auth');
const router = new express.Router();
router.post('/tasks',auth,async (req,res)=>
{
  // const task = new Task(req.body);

const task = new Task({
  ...req.body,
  owner:req.user._id
});

   try {
    await  task.save();
    res.status(201).send(task);
   } catch (error) {
    res.status(500).send(error);
   }
  //  task.save().then(()=>
  //  {
  //   res.status(201).send(task);
  //  }).catch((err)=>{
  //   res.status(400);
  //    res.send(err);
  //  })
})

router.get('/tasks',auth,async (req,res)=>
{

  const match ={};
  const sort ={};

  if(req.query.completed)
  {
    match.completed=req.query.completed==='true'
  }

  if(req.query.sortBy)
  {
    const parts = req.query.sortBy.split(':');
    sort[parts[0]]=parts[1]==='desc'? -1 : 1;
  }
  try {
    //const task= await Task.find({owner:req.user._id});
    //use of populate
   // await req.user.populate('tasks').execPopulate();

    // filtering match is used for filtering // options object is used for pagination
    //sort indicate the sorting in ascending order and descending order,-1 descending and 1 ascending
    await req.user.populate({
      path:'tasks',
      match,
      options : {
         limit:parseInt(req.query.limit),
         skip:parseInt(req.query.skip),
         sort 
      }
   }).execPopulate();

    res.status(200).send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
  // User.find({}).then((success)=>
  // {
  //    res.send(success);
  // }).catch((err)=>
  // {
  //     res.status(500).send();
  // })
})

router.patch('/tasks/:id',auth,async (req,res)=>
{
  const updates=Object.keys(req.body);
  const allowupdates=['description','completed'];
  const isvalidoperation=updates.every((update)=>allowupdates.includes(update))

    if(!isvalidoperation)
    {
      res.status(400).send({error:'invalid opertion'});
    }

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        
        
       // const task = await Task.findById(req.params.id);

       // update the task by Id and the coressponding user login

       const task = await Task.findOne({_id:req.params.id,owner:req.user._id});

     

        if(!task)
        {
          return res.status(404).send();
        }

        updates. forEach((update)=> task[update]=req.body[update])
        await task.save();

         return res.status(200).send(task);

    } catch (error) 
    {
      res.status(400).send(error);
    }

  
})

router.delete('/tasks/:id', async(req,res)=> 
{ 
  try {
         const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id});

         if(!task)
         {
           return res.status(400).send();
         }

         res.status(200).send(task);
  } catch (error) 
  {
     res.status(404).send();
  }
})

router.get('/tasks/:id',auth, async(req,res)=> 
{ 
  const _id =req.params.id;
  try {
       //  const task = await Task.findByIdAndDelete(req.params.id);
         
       const task = await Task.findOne({_id,owner:req.user._id})
         if(!task)
         {
           return res.status(400).send();
         }

         res.status(200).send(task);
  } catch (error) 
  {
     res.status(404).send();
  }
})


module.exports=router;