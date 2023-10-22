const util = require("./service/utils/util");

const DB = require("./service/db/dbcontroller");
const auth = require("./service/utils/auth");

const AWS = require("aws-sdk");

exports.handler = async (event) => {
    const data = JSON.parse(event.body);

    const token = await event.headers['authorization'];
    const username = data.username;
    const teamleader = data.teamleader;
    if (!token || !username || !teamleader) {
        console.log(token + " " + username);
            return util.buildResponse(401, {
                verified: false,
                message: "invalid request data",
            });

    }
    const verification = auth.verifyToken(username, token);
    if (!verification.verified) {
        return util.buildResponse(401, verification);
    }


    const bucket = process.env.BUCKET_NAME;
    const actions = data.actions;
    if (!actions || !data.filename) {
        return util.buildResponse(404, { "message": "no user" });
    }

    const filename = teamleader+"/"+data.filename;
    const contenttype = "application/pdf";
    


    const s3 = new AWS.S3();
    var params = {
        Bucket: bucket,
        Key: filename,
        Expires: parseInt(process.env.EXPIRATION)
    };
    if(actions === "putObject"){
        params["ContentType"] = contenttype
    }
    else{
        if(actions !== "getObject"){
            return util.buildResponse(401, { "message": "invalid actions"});
        }
    }
    console.log(params);
    const url = await s3.getSignedUrlPromise(actions, params);
    
    if(url){
        return util.buildResponse(200, { "url": url });

    }else{
        return util.buildResponse(503, { "message": "File not Exists" , "url" : url});
    }


    

    // s3.getSignedUrl(actions, params, function (err, url) {
    //     if (err) return callback(err);
    //     callback(null, {
    //         statusCode: 200,
    //         headers: { 'Access-Control-Allow-Origin': '*' },
    //         body: url
    //     });
    // });
};
