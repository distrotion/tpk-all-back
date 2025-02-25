const express = require("express");
const router = express.Router();
var mssql = require('../../function/mssql');

var mongodb = require('../../function/mongodb');
var httpreq = require('../../function/axios');
var axios = require('axios');
const fs = require('fs');
const path = require('path');

function base64ToPdf(base64String, outputFilePath) {
  const data = Buffer.from(base64String, 'base64');

  fs.writeFileSync(outputFilePath, data);
}




router.get('/10GETDATAFROMJOBBINGAQC/TEST', async (req, res) => {
  // console.log(mssql.qurey())
  res.json("TEST");
})




router.post('/10GETDATAFROMJOBBINGAQC/GETMASTER', async (req, res) => {
  //-------------------------------------
  console.log("--GETMASTER--");
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = [];
  // console.log("mongodb://"+input['IP']);
  let getdata01 = await mongodb.findURL("mongodb://" + input['IP'], "PATTERN", "PATTERN_01", {});
  let getdata02 = await mongodb.findURL("mongodb://" + input['IP'], "master_FN", "ITEMs", {});
  let getdata03 = await mongodb.findURL("mongodb://" + input['IP'], "master_IC", "ITEMs", {});
  let getdata04 = await mongodb.findURL("mongodb://" + input['IP'], "master_IP", "ITEMs", {});

  // console.log(getdata01);
  for (let i = 0; i < getdata01.length; i++) {
    let setout = {
      "CP": getdata01[i]['CP'],
      "FG": getdata01[i]['FG'],
      "CUSTOMER": getdata01[i]['CUSTOMER'],
      "PART": getdata01[i]['PART'],
      "PARTNAME": getdata01[i]['PARTNAME'],
      "MATERIAL": getdata01[i]['MATERIAL'],
    }
    // setout['FINAL'] = [];
    //INCOMMING
    //INPROCESS
    if(input['STEP'] === 'FINAL'){
      if (getdata01[i]['FINAL'] != undefined) {
        for (let j = 0; j < getdata01[i]['FINAL'].length; j++) {
  
          let itemsname = ''
          let itemsnameID = ''
          for (let s = 0; s < getdata02.length; s++) {
            if (getdata01[i]['FINAL'][j]["ITEMs"] === getdata02[s]['masterID']) {
              itemsname = getdata02[s]['ITEMs'];
              itemsnameID = getdata01[i]['FINAL'][j]["ITEMs"];
              break;
            }
          }
  
          setout[`ITEMs${j+1}`] = itemsname
          setout[`ITEMs${j+1}UID`] = itemsnameID
          // setout['FINAL'].push({
          //   "ITEMs": getdata01[i]['FINAL'][j]["ITEMs"],
          //   "ITEMsName": itemsname,
          // });
        }
  
      }
    }

    if(input['STEP'] === 'INCOMMING'){
      if (getdata01[i]['INCOMMING'] != undefined) {
        for (let j = 0; j < getdata01[i]['INCOMMING'].length; j++) {
  
          let itemsname = ''
          let itemsnameID = ''
          for (let s = 0; s < getdata03.length; s++) {
            if (getdata01[i]['INCOMMING'][j]["ITEMs"] === getdata03[s]['masterID']) {
              itemsname = getdata03[s]['ITEMs'];
              itemsnameID = getdata01[i]['INCOMMING'][j]["ITEMs"];
              break;
            }
          }
  
          setout[`ITEMs${j+1}`] = itemsname
          setout[`ITEMs${j+1}UID`] = itemsnameID
          // setout['FINAL'].push({
          //   "ITEMs": getdata01[i]['FINAL'][j]["ITEMs"],
          //   "ITEMsName": itemsname,
          // });
        }
  
      }
    }

    if(input['STEP'] === 'INPROCESS'){
      if (getdata01[i]['INPROCESS'] != undefined) {
        for (let j = 0; j < getdata01[i]['INPROCESS'].length; j++) {
  
          let itemsname = ''
          let itemsnameID = ''
          for (let s = 0; s < getdata04.length; s++) {
            if (getdata01[i]['INPROCESS'][j]["ITEMs"] === getdata04[s]['masterID']) {
              itemsname = getdata04[s]['ITEMs'];
              itemsnameID = getdata01[i]['INPROCESS'][j]["ITEMs"];
              break;
            }
          }
  
          setout[`ITEMs${j+1}`] = itemsname
          setout[`ITEMs${j+1}UID`] = itemsnameID
          // setout['FINAL'].push({
          //   "ITEMs": getdata01[i]['FINAL'][j]["ITEMs"],
          //   "ITEMsName": itemsname,
          // });
        }
  
      }
    }
   

    output.push(setout);
  }


  res.json(output);
});




module.exports = router;
