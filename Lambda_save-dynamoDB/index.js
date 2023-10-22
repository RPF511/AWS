const util = require("./service/utils/util");

const DB = require("./service/db/dbcontroller");
const auth = require("./service/utils/auth");


exports.handler = async (event) => {
  const data = JSON.parse(event.body);

  const token = await event.headers['authorization'];
  const username = data.username;
  if (!token || !username) {
    if (page !== 0) {
      console.log(token + " " + username);
      return util.buildResponse(401, {
        verified: false,
        message: "invalid request data",
      });
    }

  }
  const verification = auth.verifyToken(username, token);
  if (!verification.verified) {
    return util.buildResponse(401, verification);
  }

  const userresponse = await DB.getDataByPartitionKey(process.env.TABLE_USER, "username", username);
  var userdata = userresponse.Items[0];
  if (!userdata) {
    return util.buildResponse(404, { "message": "no user" });
  }

  const datalist = Object.keys(data);

  for(var i = 0; i < datalist.length ; i++) {
    var tempkey = datalist[i];

    if(tempkey === "username"){continue;}

    if(tempkey==="password"){
      return util.buildResponse(401, { "message": "invalid key" });
    }


    if(typeof(data[tempkey]) === typeof(userdata[tempkey])|| typeof(userdata[tempkey]) === "undefined"){
      if(typeof(data[tempkey]) === 'string' &&(data[tempkey].includes("/script") || data[tempkey].includes("</")|| data[tempkey].includes("< /") || data[tempkey].includes("userToken"))){
        return util.buildResponse(400, { "message": "security alert" });
      }
      userdata[tempkey] = data[tempkey];
    }else{
      return util.buildResponse(401, { "message": "invalid datatype" });
    }
  }



  const userparams = {
    TableName: process.env.TABLE_USER,
    Key: {
      username: userdata.username,
    },
    Item: userdata,
  };
  const userdbResponse = await DB.saveData(userparams);
  if (!userdbResponse) {
    return util.buildResponse(503, { message: "team database server error" });
  }

  delete userdata.password;
  
  return userdata;



};
