const MongoClient = require("mongodb").MongoClient;
const util = require("./service/utils/util");

const MONGODB_URI = process.env.DB_URL ;
let cachedDb = null;

async function connectToDatabase() {

  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(MONGODB_URI);
  const db = await client.db('email');
  cachedDb = db;
  return db
}

exports.handler = async (event) => {

  const db = await connectToDatabase();
  const bodyData = JSON.parse(event.body);
  const offset = new Date().getTimezoneOffset() * 60000;
  const currenttime = new Date(Date.now() - offset).toISOString()
  const temperature = bodyData.temperature;
  const humidity = bodyData.humidity;
  const dormlocation = bodyData.dormlocation;

  if (!temperature || !humidity || !dormlocation) {
    return util.buildResponse(401, {
      message: "All fields are required",
    });
  }

  const data = {
    savetime : currenttime,
    dormlocation : dormlocation,
    temperature: temperature,
    humidity: humidity,
  };

  const result = await db.collection("newsletter").insertOne(data);
  if(!result){
    return util.buildResponse(503, { message: "database server error" });
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify(result),
    // body:  result,
  };


  return response;
};