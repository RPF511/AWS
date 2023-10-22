
const MongoClient = require("mongodb").MongoClient;
const util = require("./service/utils/util");

const MONGODB_URI = process.env.DB_URL ;
const dbname = process.env.DB_NAME;
const collectionname = process.env.DB_COLLECTION;
let cachedDb = null;

async function connectToDatabase() {

  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(MONGODB_URI);
  const db = await client.db(dbname);
  cachedDb = db;
  return db;
}

exports.handler = async (event) => {

  const db = await connectToDatabase();
  const bodyData = JSON.parse(event.body);
  const dormlocation = bodyData.dormlocation;

  if (!dormlocation) {
    return util.buildResponse(401, {
      message: "All fields are required",
    });
  }
// return db.listCollections().toArray();
const collection = await db.collection(collectionname);
console.log(collection);
var query = {"dormlocation" : dormlocation};
if (dormlocation==="all"){
  query={};
}
    const options = {
      // sort returned documents in ascending order by title (A->Z)
      sort: { savetime: 1 },
      projection: { _id: 0, savetime: 1, dormlocationimdb: 1 , temperature : 1, humidity :1},
    };

  const result = await collection.find(query, options).toArray();

  const response = {
    statusCode: 200,
    body: JSON.stringify(result)
    // body:  result,
  };


  return response;
};


// const mongoose = require('mongoose');
// const util = require("./service/utils/util");

// let conn = null;

// const uri = process.env.DB_URL;
// const dbname = process.env.DB_NAME;
// const collectionname = process.env.DB_COLLECTION;

// exports.handler = async function(event, context) {
//   const bodyData = JSON.parse(event.body);
//   const dormlocation = bodyData.dormlocation;
//   // Make sure to add this so you can re-use `conn` between function calls.
//   // See https://www.mongodb.com/blog/post/serverless-development-with-nodejs-aws-lambda-mongodb-atlas
//   context.callbackWaitsForEmptyEventLoop = false;

//   // Because `conn` is in the global scope, Lambda may retain it between
//   // function calls thanks to `callbackWaitsForEmptyEventLoop`.
//   // This means your Lambda function doesn't have to go through the
//   // potentially expensive process of connecting to MongoDB every time.
//   if (conn == null) {
//     conn = mongoose.createConnection(uri, {
//       // and tell the MongoDB driver to not wait more than 5 seconds
//       // before erroring out if it isn't connected
//       serverSelectionTimeoutMS: 5000
//     });

//     // `await`ing connection after assigning to the `conn` variable
//     // to avoid multiple function calls creating new connections
//     await conn.asPromise();
//     // conn.model(dbname, new mongoose.Schema({ savetime: String, dormlocation : String, temperature: String, humidiy:String }),collectionname);
//   }
//   console.log(conn);
//   const M = conn.model(collectionname, new mongoose.Schema({ savetime: String, dormlocation : String, temperature: String, humidiy:String }));
//   console.log(M);

//   const doc = await M.find({});
//   //   .where('dormlocation').equals(dormlocation)
//   // ;
//   // const doc = await M.findOne();
//   console.log(doc);

//   return conn;
// };