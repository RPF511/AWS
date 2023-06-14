// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");

// Set the region
AWS.config.update({ region: "ap-northeast-2" });

// Create DynamoDB document client
const dynamoDB = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

const tableName = process.env.DB_NAME;

exports.getData = async (dormlocation,timemin,timemax) => {
  let expression = "";
  let attribute = {};
  if(dormlocation){
    if(expression){
      expression += " and ";
    }
    expression += "dormlocation = :dormlocation";
    attribute[":dormlocation"] = dormlocation;
  }
  if(timemin){
    if(expression){
      expression += " and ";
    }
    expression += "savetime > :timemin";
    attribute[":timemin"] = timemin;
  }
  if(timemax){
    if(expression){
      expression += " and ";
    }
    expression += "savetime < :timemax";
    attribute[":timemax"] = timemax;
  }
  const params = {
    TableName: tableName,
    IndexName: "savetime",
    KeyConditionExpression: expression,
    ExpressionAttributeValues: attribute,
    ScanIndexForward: true
  }
  console.log(params);
  return await dynamoDB
    .query(params)
    .promise()
    .then(
      (data) => {
        return data;
      },
      (error) => {
        console.log("Error fetching user", error);
        return null;
      }
    );
};

// exports.saveData = async (data) => {
//   const params = {
//     TableName: tableName,
//     Key: {
//       time: data.time,
//     },
//     Item: data,
//   };

//   return await dynamoDB
//     .put(params)
//     .promise()
//     .then(
//       (response) => {
//         return true;
//       },
//       (error) => {
//         console.log("Error saving user", error);
//       }
//     );
// };