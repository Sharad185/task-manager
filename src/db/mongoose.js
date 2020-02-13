const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://taskapp:Sharad185!!@cluster0-rrdbm.mongodb.net/task-manager-api?retryWrites=true&w=majority',{useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false})


// _v store the version of document