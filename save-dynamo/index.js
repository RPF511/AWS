const util = require("./service/utils/util");

const DB = require("./service/db/data");


exports.handler = async (event) => {
  console.log(" Request Event : ", event);
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

  // const dynamoUser = await userDB.getUser(username);
  // if (dynamoUser && dynamoUser.username) {
  //   return util.buildResponse(401, {
  //     message: "User already exists",
  //   });
  // }

  // const encryptedPassword = bcrypt.hashSync(password.trim(), 10);
  const data = {
    savetime : currenttime,
    dormlocation : dormlocation,
    temperature: temperature,
    humidity: humidity,
  };

  const savedUserResponse = await DB.saveData(data);
  if (!savedUserResponse) {
    return util.buildResponse(503, { message: "database server error" });
  }

  return util.buildResponse(200, data);
};
