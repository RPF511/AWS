const DB = require("../db/dbcontroller");
const util = require("../utils/util");

const pageindex_user = {
    0: [],
    1: ["givenname", "familyname", "birth", "countrycode", "cellphone", "identity", "belong"],
    2: ["nationality", "residence", "region", "regionextra"],
    3: ["teamleader"],
    4: ["teamleader"],
    5: ["position"],
    6: ["position"],
    7: ["position"],
    8: ["position"],
    9: ["position"],
    10: ["vegan", "halal", "shirts", "marketingroute", "exjunction"],
    11: []
};
const pageindex_application = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: ["position"],
    6: ["position", "common0", "common1"],
    7: ["position", "planner0", "planner1", "url"],
    8: ["position", "designer0", "designer1", "url"],
    9: ["position", "devleoper0", "developer1", "url", "languagelist", "stacklist"],
    10: ["appextra"],
    11: []
}
const default_data = {
    "givenname": "",
    "familyname": "",
    "birth": "",
    "countrycode": "",
    "cellphone": "",
    "identity": "",
    "belong": "",
    "nationality": "",
    "residence": "",
    "region": "",
    "regionextra": "",
    "teamleader": "none",
    "position": "none",
    "vegan": false,
    "halal": false,
    "shirts": "XL",
    "marketingroute": [],
    "exjunction": [],
    "url": "",
    "common0": "",
    "common1": "",
    "planner0": "",
    "planner1": "",
    "designer0": "",
    "designer1": "",
    "devleoper0": "",
    "developer1": "",
    "languagelist": [],
    "stacklist": [],
    "appextra": ""
}

exports.getdata = async (currentpage, username) => {
    const useridx = pageindex_user[currentpage];
    const applicationidx = pageindex_application[currentpage];
    const usernameResponse = await DB.getDataByPartitionKey(process.env.TABLE_USER, "username", username);
    const applicationResponse = await DB.getDataByPartitionKey(process.env.TABLE_APPLICATION, "username", username);
    // console.log(usernameResponse.Count);
    // console.log(applicationResponse.Count);

    if (!applicationResponse.Count || !usernameResponse.Count) {
        return util.buildResponse(401, {
            verified: false,
            message: "user not exists",
        });
    }
    const userdata = await usernameResponse.Items[0];
    const applicationdata = await applicationResponse.Items[0];
    const userdatakeys = Object.keys(userdata);
    const applicationdatakeys = Object.keys(applicationdata);

    var result = {
        username: username,
        page: currentpage
    }
    for (var i = 0; i < useridx.length; i++) {
        if (userdatakeys.includes(useridx[i])) {
            result[useridx[i]] = userdata[useridx[i]]
        } else {
            result[useridx[i]] = default_data[useridx[i]]
        }
    }
    for (var i = 0; i < applicationidx.length; i++) {
        if (applicationdatakeys.includes(applicationidx[i])) {
            result[applicationidx[i]] = applicationdata[applicationidx[i]]
        } else {
            result[applicationidx[i]] = default_data[applicationidx[i]]
        }
    }
    // var isTeamError = false;
    if (currentpage === 4 && result.teamleader && result.teamleader !== "none") {
        const teamResponse = await DB.getDataByPartitionKey(process.env.TABLE_TEAM, "teamleader", result.teamleader);
        var teamdata = await teamResponse.Items;
        for(var i = 0; i<teamdata.length ; i++){
            var tempUserResponse = await DB.getDataByPartitionKey(process.env.TABLE_USER, "username", teamdata[i]["username"]);
            var tempUser = await tempUserResponse.Items[0];
            teamdata[i]["givenname"] = tempUser["givenname"];
            teamdata[i]["familyname"] = tempUser["familyname"];
            teamdata[i]["position"] = tempUser["position"];
        }
        result["teamdata"] = teamdata;
    }

    userdata["currentpage"] = currentpage
    console.log(userdata);
    const app_params = {
        TableName: process.env.TABLE_USER,
        Key: {
            username: userdata.username,
        },
        Item: userdata,
    };
    const appResponse = await DB.saveData(app_params);
    console.log(appResponse);
    if (!appResponse) {
        return {
            verified: false, 
            message: "database save error" 
        }
    }

    return result
}