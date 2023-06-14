// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");

// Set the region
AWS.config.update({ region: "ap-northeast-2" });

// Create DynamoDB document client
const dynamoDB = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

const tableName = process.env.DB_NAME;

// exports.getUser = async (username) => {
//   const params = {
//     TableName: userTable,
//     Key: {
//       username: username,
//     },
//   };
//   return await dynamoDB
//     .get(params)
//     .promise()
//     .then(
//       (response) => {
//         return response.Item;
//       },
//       (error) => {
//         console.log("Error fetching user", error);
//       }
//     );
// };

exports.saveData = async (data) => {
  const params = {
    TableName: tableName,
    Key: {
      time: data.time,
    },
    Item: data,
  };

  return await dynamoDB
    .put(params)
    .promise()
    .then(
      (response) => {
        return true;
      },
      (error) => {
        console.log("Error saving user", error);
      }
    );
};