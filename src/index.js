const express = require('express');
const app =express();
require("./db/mongoose")
const userRouter=require('./routers/user');
const taskRouter =require('./routers/task');

const Task=require("./model/task");
const port=process.env.PORT || 3000;
// this command is use to get the json data from browser

app.use(express.json());

app.use(userRouter);
app.use(taskRouter)

app.listen(port,()=>
{
    console.log("Server is runing on port"+port)
});

const jwt = require('jsonwebtoken');

const myfunction = async ()=>
{
   const token= jwt.sign({_id:'ab123456'},'ilovemycountry');
   console.log("TOKEN"+token);

   const data = jwt.verify(token,'ilovemycountry');
   console.log(data);
}

myfunction();