exports.checkData = (data) => {
    var english = /^[A-Za-z]*$/;
    var number = /^[0-9]*$/;
    var errstring = "";
    const nationlist = ["Korea","Japan","China", "India"];
    const identitylist = ["HighSchool", "College", "University", "OfficeWorker", "Freelancer"];
    const positionlist = ["Developer", "Designer", "ProductManager"];

    if(!english.test(data.givenname) || !english.test(data.familyname)){
        errstring += "name not english\n";
    }


    if(! nationlist.includes(data.nationality)){
        errstring += "invalid nationality\n";
    }

    if((data.nationality!="Korea")&&(data.region||data.regionextra)){
        errstring += "no additional regional data in countries other than Korea\n";
    }
    
    if(!number.test(data.cellphone) || !(data.cellphone.length == 11 || data.cellphone.length == 10) ){
        errstring += "invalid phone number\n";
    }

    if(! identitylist.includes(data.identity)){
        errstring += "invalid identity\n";
    }
    if(! positionlist.includes(data.position)){
        errstring += "invalid position\n";
    }

    return errstring;

};