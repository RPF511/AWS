// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");

// Set the region
AWS.config.update({ region: "ap-northeast-2" });

// Create DynamoDB document client
const dynamoDB = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

// const tablename = process.env.TABLE_NAME;

exports.saveData = async (params) => {
  

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

exports.getDataByGSI = async (tablename, gsiindexname, gsikey, gsivalue) => {
  const params = {
    TableName: tablename,
    IndexName: gsiindexname,
    KeyConditionExpression: "#gsiname = :valuename",
    ExpressionAttributeNames: {
      "#gsiname": gsikey
    },
    ExpressionAttributeValues: {
      ":valuename": gsivalue
    },
    ScanIndexForward: false
  };
  return await dynamoDB
    .query(params)
    .promise()
    .then(
      (response) => {
        return response;
      },
      (error) => {
        console.log("Error fetching user", error);
      }
    );
}

exports.getDataByPartitionKey = async (tablename, partitionkey,partitionvalue) => {
  const params = {
    TableName: tablename,
    KeyConditionExpression: "#partitionkey = :partitionvalue",
    ExpressionAttributeNames: {
      "#partitionkey": partitionkey
    },
    ExpressionAttributeValues: {
      ":partitionvalue": partitionvalue
    },
    ScanIndexForward: false
  };
  return await dynamoDB
    .query(params)
    .promise()
    .then(
      (response) => {
        return response;
      },
      (error) => {
        console.log("Error fetching user", error);
      }
    );
}

// exports.deleteByKey = async (keyname) => {

//   const items = await getItems(keyname);
//   const params = prepareRequestParams(items.Items, keyname);
//   // console.log(params);
//   params.forEach((i) => {
//     console.log(i["sortparam"])
//     console.log(i)
//   });
//   const chunks = await sliceInChunks(params);
//   const res = await deleteItems(chunks);

//   return res;
// };

// async function getItems(keyname) {
//   let data = await dynamoDB
//     .query({
//       TableName: tablename,
//       KeyConditionExpression: "valuename = :valuename",
//       ExpressionAttributeValues: {
//         ":valuename": keyname
//       },
//       ScanIndexForward: false // 오름차순 
//     })
//     .promise();
//   return data;
// }

// function prepareRequestParams(items, keyname) {
//   const requestParams = items.map((i) => ({
//     DeleteRequest: {
//       Key: {
//         valuename: keyname,
//         sortparam: i['sortparam'],
//       },
//     },
//   }));

//   return requestParams;
// }

// async function sliceInChunks(arr) {
//   let i;
//   let j;
//   const CHUNK_SIZE = 25; // DynamoDB BatchWriteItem limit
//   const chunks = [];

//   for (i = 0, j = arr.length; i < j; i += CHUNK_SIZE) {
//     chunks.push(arr.slice(i, i + CHUNK_SIZE));
//   }

//   return chunks;
// }

// async function deleteItems(chunks) {
//   const promises = chunks.map(async function (chunk) {
//     const params = { RequestItems: { [tablename]: chunk } };
//     const res = await dynamoDB.batchWrite(params).promise();
//     return res;
//   });

//   return await Promise.all(promises);
// }