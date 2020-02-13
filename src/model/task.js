const mongoose=require('mongoose');

const TaskSchema=new mongoose.Schema({

    description : {type : String ,required:true,trim:true} ,
    completed : {type : String ,default:false},
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'user'
        

    }
    
},{timestamps:true})
const Task=mongoose.model('Task',TaskSchema);

module.exports=Task;