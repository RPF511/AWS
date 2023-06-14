const util = require("./service/utils/util");

const DB = require("./service/db/data");


exports.handler = async (event) => {
  console.log(" Request Event : ", event);
  const bodyData = JSON.parse(event.body);
  // const offset = new Date().getTimezoneOffset() * 60000;
  // const currenttime = new Date(Date.now() - offset).toISOString()
  let timemin = bodyData.timemin;
  let timemax = bodyData.timemax;
  let dormlocation = bodyData.dormlocation;

  if (!timemin) {
    timemin = "";
  };
  if (!timemax) {
    timemax = "";
  };
  if (!dormlocation) {
    dormlocation = "";
  };

  const dynamoData = await DB.getData(dormlocation,timemin,timemax);
  if (!dynamoData) {
    return util.buildResponse(401, {
      message: "no data",
    });
  }

  

  return util.buildResponse(200, dynamoData);
};
