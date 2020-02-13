const mogodb = require('mongodb');
const mogoclient = mogodb.MongoClient
const ObjectId = mogodb.ObjectID

//Writing the short hand syntax

// const {mogoclient,ObjectId}=require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager'
// Object id is the constructor function which will gove the id
const id = new ObjectId();

console.log(id);
mogoclient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
  if (error) {
    return console.log("Unable to connect to database");

  }

  console.log("Connected sucessfully!!");

  // it will give the refrence of database
  const db = client.db(databaseName);
  //collection same as table name user and insertone to create the name of column
  //then after register the callback for error

  db.collection('users').updateOne({ "_id": ObjectId("5dc9b3afd4dd69171c8ac242") },
    {
      //  $set:
      // {
      //   name:"Abhinav"
      // }

      $inc:
      {
        class: 1
      }
    }).then((result) => {
      console.log("result  " + result);
    }).catch((error) => {
      console.log("error " + error);
    })
});