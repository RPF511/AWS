const util = require("./service/utils/util");

const DB = require("./service/db/dbcontroller");
const auth = require("./service/utils/auth");


exports.handler = async (event) => {
  const data = JSON.parse(event.body);

  const token = await event.headers['authorization'];
  const username = data.username;
  if (!token || !username) {
      console.log(token+" "+username+" ");
      return util.buildResponse(401, {
        verified: false,
        message: "invalid request data : "+token+ " "+username,
      });
    
  }
  const verification = auth.verifyToken(username, token);
  if (!verification.verified) {
    return util.buildResponse(401, verification);
  }

  const command = data.command;
  if(command == "gsi"){
    const tablename = data.tablename;
    const gsiindexname = data.gsiindexname;
    const gsikey = data.gsikey;
    const gsivalue = data.gsivalue;
    if(!tablename || !gsiindexname || !gsikey || !gsivalue){
      return util.buildResponse(401, {
        verified: false,
        message: "invalid request data in gsi",
      });
    }

    return DB.getDataByGSI(tablename, gsiindexname, gsikey, gsivalue);
  }

  if(command == "partition"){
    const tablename = data.tablename;
    const partitionkey = data.partitionkey;
    const partitionvalue = data.partitionvalue;
    if(!tablename || !partitionkey || !partitionvalue){
      return util.buildResponse(401, {
        verified: false,
        message: "invalid request data in partition",
      });
    }

    return DB.getDataByPartitionKey(tablename, partitionkey, partitionvalue);
  }
  

  return util.buildResponse(401, {
    verified: false,
    message: "invalid command",
  });

};
