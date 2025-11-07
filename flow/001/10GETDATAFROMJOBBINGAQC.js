const express = require("express");
const router = express.Router();
var mssql = require('../../function/mssql');
var mssqlR = require('../../function/mssqlR');
var mongodb = require('../../function/mongodb');
var httpreq = require('../../function/axios');
var axios = require('axios');
const fs = require('fs');
const path = require('path');


function base64ToPdf(base64String, outputFilePath) {
  const data = Buffer.from(base64String, 'base64');

  fs.writeFileSync(outputFilePath, data);
}

Number.prototype.pad = function (n) {
  if (n === undefined)
    n = 2;

  return (new Array(n).join('0') + this).slice(-n);
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
    if (input['STEP'] === 'FINAL') {
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

          setout[`ITEMs${j + 1}`] = itemsname
          setout[`ITEMs${j + 1}UID`] = itemsnameID
          // setout['FINAL'].push({
          //   "ITEMs": getdata01[i]['FINAL'][j]["ITEMs"],
          //   "ITEMsName": itemsname,
          // });
        }

      }
    }

    if (input['STEP'] === 'INCOMMING') {
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

          setout[`ITEMs${j + 1}`] = itemsname
          setout[`ITEMs${j + 1}UID`] = itemsnameID
          // setout['FINAL'].push({
          //   "ITEMs": getdata01[i]['FINAL'][j]["ITEMs"],
          //   "ITEMsName": itemsname,
          // });
        }

      }
    }

    if (input['STEP'] === 'INPROCESS') {
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

          setout[`ITEMs${j + 1}`] = itemsname
          setout[`ITEMs${j + 1}UID`] = itemsnameID
          // setout['FINAL'].push({
          //   "ITEMs": getdata01[i]['FINAL'][j]["ITEMs"],
          //   "ITEMsName": itemsname,
          // });
        }

      }
    }


    output.push(setout);
  }


  return res.json(output);
});


router.post('/10GETDATAFROMJOBBINGAQC/GETDATA', async (req, res) => {
  //-------------------------------------
  console.log("--10GETDATAFROMJOBBINGAQC/GETDATA--");
  console.log(req.body);
  let input = req.body;
  //-------------------------------------

  // let output = datatest02;
  let output = {};

  // "ORD_ST_DATE_FR": "01.03.2025",
  // "ORD_ST_DATE_TO": "07.03.2025",
  const axios = require('axios');
  // let data = {

  //   "HEADER": {
  //     "PLANT": "1000",
  //     "ORD_ST_DATE_FR": "01.03.2025",
  //     "ORD_ST_DATE_TO": "10.03.2025",
  //     "ORDER_TYPE": "",
  //     "PROD_SUP": ""
  //   },
  //   "PROC_ORD": [
  //     {
  //       "PROCESS_ORDER": "",
  //       "MATERIAL": ""
  //     }
  //   ]
  // };
  let data = input;

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    // url: 'http://172.23.10.168:14090/DATAGW/PPI002GET',
    url: 'http://172.23.10.168:14090/DATAGW/PPI002GET',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };

  await axios.request(config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      output = response.data
    })
    .catch((error) => {
      // console.log(error);
    });


  //-------------------------------------
  return res.json(output);
});

router.post('/10GETDATAFROMJOBBINGAQC/GETDATAGOODNOGOOD', async (req, res) => {
  //-------------------------------------
  console.log("--10GETDATAFROMJOBBINGAQC/GETDATAGOODNOGOOD--");
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = [];
  if (input['PROCESS_ORDER'] != undefined) {


    let querySV = `SELECT * FROM [SAPHANADATA].[dbo].[HSGOODRECEIVE] where PROCESS_ORDER = '${input['PROCESS_ORDER']}' ORDER BY date desc`
    console.log(querySV);
    let db = await mssqlR.qurey(querySV);



    if (db['recordsets'] != undefined) {
      if (['recordsets'].length > 0) {
        output = db['recordsets'][0];
      }
    }
  }


  //-------------------------------------
  return res.json(output);
});


router.post('/10GETDATAFROMJOBBINGAQC/GETQCFNLIST', async (req, res) => {
  //-------------------------------------
  console.log("--10GETDATAFROMJOBBINGAQC/GETQCFNLIST--");
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = [];
  if (input['PROCESS_ORDER_LIST'] != undefined) {
    let StrOUT = ""
    for (let i = 0; i < input['PROCESS_ORDER_LIST'].length; i++) {

      if (i !== 0) {
        StrOUT = StrOUT + `,'` + input['PROCESS_ORDER_LIST'][i] + `'`
      } else {
        StrOUT = StrOUT + `'` + input['PROCESS_ORDER_LIST'][i] + `'`
      }


    }


    let querySV = `SELECT * FROM [SAPHANADATA].[dbo].[QCFNREC] where PROCESS_ORDER IN (${StrOUT}) ORDER BY date desc`
    console.log(querySV);
    let db = await mssqlR.qurey(querySV);



    if (db['recordsets'] != undefined) {
      if (['recordsets'].length > 0) {
        output = db['recordsets'][0];
      }
    }
    console.log(querySV);
  }


  //-------------------------------------
  return res.json(output);
});


router.post('/10GETDATAFROMJOBBINGAQC/GETGRLIST', async (req, res) => {
  //-------------------------------------
  console.log("--10GETDATAFROMJOBBINGAQC/GETGRLIST--");
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = [];
  if (input['PROCESS_ORDER_LIST'] != undefined) {
    let StrOUT = ""
    for (let i = 0; i < input['PROCESS_ORDER_LIST'].length; i++) {

      if (i !== 0) {
        StrOUT = StrOUT + `,'` + input['PROCESS_ORDER_LIST'][i] + `'`
      } else {
        StrOUT = StrOUT + `'` + input['PROCESS_ORDER_LIST'][i] + `'`
      }


    }


    let querySV = `SELECT * FROM [SAPHANADATA].[dbo].[HSGOODRECEIVE] where PROCESS_ORDER IN (${StrOUT}) ORDER BY date desc`
    console.log(querySV);
    let db = await mssqlR.qurey(querySV);



    if (db['recordsets'] != undefined) {
      if (['recordsets'].length > 0) {
        output = db['recordsets'][0];
      }
    }
    console.log(querySV);
  }


  //-------------------------------------
  return res.json(output);
});

router.post('/10GETDATAFROMJOBBINGAQC/POSTTOSTORE', async (req, res) => {
  //-------------------------------------
  console.log("--10GETDATAFROMJOBBINGAQC/POSTTOSTORE--");
  console.log(req.body);
  let input = req.body;
  //-------------------------------------

  // let output = datatest04;
  let output = {};

  const axios = require('axios');
  let data = input

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    // url: 'http://172.23.10.168:14090/DATAGW/PPI004SET',
    url: 'http://172.23.10.168:14090/DATAGW/PPI004SET',
    // url: 'http://172.23.10.168:14090/DATAGWTEST/PPI004SET',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };

  await axios.request(config)
    .then((response) => {
      console.log(response.data);
      output = response.data
      // if (output.length > 0) {
      //   console.log(output[0]['TYPE']);
      //   if (output[0]['TYPE'] != 'E') {

      //   }
      // }

    })
    .catch((error) => {
      // console.log(error);
    });

  //-------------------------------------
  res.json(output);
});

router.post('/10GETDATAFROMJOBBINGAQC/AUTOSTORE', async (req, res) => {
  //-------------------------------------
  console.log("--10GETDATAFROMJOBBINGAQC/AUTOSTORE--");
  console.log(req.body);
  let input = req.body;
  //-------------------------------------

  // let output = datatest02;
  let output = {};

  try {

    Number.prototype.pad = function (n) {
      if (n === undefined)
        n = 2;

      return (new Array(n).join('0') + this).slice(-n);
    }
    let d = new Date(new Date().setDate(new Date().getDate()));

    let day = `${(d.getDate()).pad(2)}.${(d.getMonth() + 1).pad(2)}.${d.getFullYear()}`

    // "ORD_ST_DATE_FR": "01.03.2025",
    // "ORD_ST_DATE_TO": "07.03.2025",
    const axios = require('axios');

    let data = input;
    let plant = `${input['HEADER']['PLANT']}`;

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      // url: 'http://172.23.10.168:14090/DATAGW/PPI002GET',
      url: 'http://172.23.10.168:14090/DATAGW/PPI002GET',
      // url: 'http://172.23.10.168:14090/DATAGWTEST/PPI002GET',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    await axios.request(config)
      .then(async (response) => {
        // console.log(JSON.stringify(response.data));
        // output = response.data

        // output = response.data;
        //HEADER_INFO
        // for (let i = 0; i < response.data['PHASE_INFO'].length; i++) {

        for (let j = 0; j < response.data['HEADER_INFO'].length; j++) {
          // console.log(j)
          // console.log(response.data['HEADER_INFO'][j]['MATERIAL']);
          // if (response.data['PHASE_INFO'][i]['PROCESS_ORDER'] === response.data['HEADER_INFO'][j]['PROCESS_ORDER']) {
          // response.data['PHASE_INFO'][i]['FG'] = response.data['HEADER_INFO'][j]['MATERIAL'];
          // response.data['PHASE_INFO'][i]['UOM'] = response.data['HEADER_INFO'][j]['UOM'];
          // response.data['PHASE_INFO'][i]['SYSTEM_STATUS'] = response.data['HEADER_INFO'][j]['SYSTEM_STATUS'];


          //and  [STATUSCODE] IS NULL

          let querySV = `SELECT * FROM [SAPHANADATA].[dbo].[HSGOODRECEIVE] where PROCESS_ORDER = '00${response.data['HEADER_INFO'][j]['PROCESS_ORDER']}'  ORDER BY date`
          let db = await mssqlR.qurey(querySV);
          // setTimeout(() => {
          //   console.log(response.data['HEADER_INFO'][j]['PROCESS_ORDER']);
          // }, 500)
          console.log(response.data['HEADER_INFO'][j]['PROCESS_ORDER']);



          if (db['recordsets'] != undefined) {
            if (db['recordsets'].length > 0) {

              // output = db['recordsets'][0];
              if (`${response.data['HEADER_INFO'][j]['SYSTEM_STATUS']}`.includes("PCNF")) {
                //
              } else {
                ///------------------------
                // console.log(`${response.data['HEADER_INFO'][j]['SYSTEM_STATUS']}`);



                if ((`${response.data['HEADER_INFO'][j]['SYSTEM_STATUS']}`.includes("CNF")) && (`${response.data['HEADER_INFO'][j]['SYSTEM_STATUS']}`.includes("DLV") == false)) {

                  console.log(db['recordsets'][0][0])
                  if (db['recordsets'][0][0] != undefined) {

                    if (db['recordsets'][0][0][`PROCESS_ORDER`] === `00${response.data['HEADER_INFO'][j]['PROCESS_ORDER']}`) {
                      if (`${db['recordsets'][0][0]['GOOD']}` != '') {

                        let outdata = {
                          "PROCESSORDER": `${response.data['HEADER_INFO'][j]['PROCESS_ORDER']}`,
                          "POSTINGDATE": day,
                          "MATERIAL": `${response.data['HEADER_INFO'][j]['MATERIAL']}`,
                          "QUANTITY": `${db['recordsets'][0][0]['GOOD']}`,
                          "UNIT": `${response.data['HEADER_INFO'][j]['UOM']}`,
                          "QUANTITYSTATUS": "GOOD"
                        };
                        console.log(outdata);

                        let config = {
                          method: 'post',
                          maxBodyLength: Infinity,
                          url: 'http://172.23.10.168:14094/10GETDATAFROMJOBBINGAQC/POSTTOSTORE',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          data: outdata
                        };
                        await axios.request(config).then(async (SS) => {
                          //
                          if (SS.data['T_RETURN'].length > 0) {
                            output = SS.data['T_RETURN'][0]
                            if (`${SS.data['T_RETURN'][0]['TYPE']}` === `S`) {


                              let queryUP = `UPDATE [SAPHANADATA].[dbo].[HSGOODRECEIVE] SET  [STATUSCODE] = 'SEND' WHERE PROCESS_ORDER = '00${response.data['HEADER_INFO'][j]['PROCESS_ORDER']}';`
                              console.log(queryUP);
                              let dbss = await mssqlR.qurey(queryUP);
                            }
                          }

                        });
                      }

                      // if (`${db['recordsets'][0][0]['NOGOOD']}` != '') {

                      //   let outdata = {
                      //     "PROCESSORDER": `${response.data['HEADER_INFO'][j]['PROCESS_ORDER']}`,
                      //     "POSTINGDATE": day,
                      //     "MATERIAL": `${response.data['HEADER_INFO'][j]['MATERIAL']}`,
                      //     "QUANTITY": `${db['recordsets'][0][0]['NOGOOD']}`,
                      //     "UNIT": `${response.data['HEADER_INFO'][j]['UOM']}`,
                      //     "QUANTITYSTATUS": "NG"
                      //   };
                      //   console.log(outdata);

                      //   let config = {
                      //     method: 'post',
                      //     maxBodyLength: Infinity,
                      //     url: 'http://172.23.10.168:14094/10GETDATAFROMJOBBINGAQC/POSTTOSTORE',
                      //     headers: {
                      //       'Content-Type': 'application/json'
                      //     },
                      //     data: outdata
                      //   };
                      //   await axios.request(config).then(async (response) => {
                      //     //
                      //     console.log(response.data);
                      //   });
                      // }

                      // let queryUP = `UPDATE [SAPHANADATA].[dbo].[HSGOODRECEIVE] SET  [STATUSCODE] = 'SEND' WHERE PROCESS_ORDER = '00${response.data['HEADER_INFO'][j]['PROCESS_ORDER']}';`
                      // let dbss = await mssqlR.qurey(queryUP);




                    }

                  }
                } else {
                  //(`${response.data['HEADER_INFO'][j]['SYSTEM_STATUS']}`.includes("CNF")) &&
                  try {

                    if (db['recordsets'][0][0][`PROCESS_ORDER`] === `00${response.data['HEADER_INFO'][j]['PROCESS_ORDER']}`) {


                      if (`${db['recordsets'][0][0]['GOOD']}` != '' && `${db['recordsets'][0][0]['STATUSCODE']}` != 'SEND') {

                        if (`${db['recordsets'][0][0]['GOOD']}` != '') {

                          let outdata = {
                            "PROCESSORDER": `${response.data['HEADER_INFO'][j]['PROCESS_ORDER']}`,
                            "POSTINGDATE": day,
                            "MATERIAL": `${response.data['HEADER_INFO'][j]['MATERIAL']}`,
                            "QUANTITY": `${db['recordsets'][0][0]['GOOD']}`,
                            "UNIT": `${response.data['HEADER_INFO'][j]['UOM']}`,
                            "QUANTITYSTATUS": "GOOD"
                          };
                          console.log(outdata);


                          let config = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: 'http://172.23.10.168:14094/10GETDATAFROMJOBBINGAQC/POSTTOSTORE',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            data: outdata
                          };
                          await axios.request(config).then(async (SS) => {
                            //


                            if (SS.data['T_RETURN'].length > 0) {
                              output = SS.data['T_RETURN'][0]
                              if (`${SS.data['T_RETURN'][0]['TYPE']}` === `S`) {


                                let queryUP = `UPDATE [SAPHANADATA].[dbo].[HSGOODRECEIVE] SET  [STATUSCODE] = 'SEND' WHERE PROCESS_ORDER = '00${response.data['HEADER_INFO'][j]['PROCESS_ORDER']}';`
                                console.log(queryUP);
                                let dbss = await mssqlR.qurey(queryUP);
                              }
                            }


                          });
                        }
                      }
                    }
                  } catch (error) {

                  }

                }
              }

              if (db['recordsets'][0][0] != undefined) {

                if (db['recordsets'][0][0][`PROCESS_ORDER`] === `00${response.data['HEADER_INFO'][j]['PROCESS_ORDER']}`) {

                  if (`${db['recordsets'][0][0]['NOGOOD']}` != '' && `${db['recordsets'][0][0]['STATUSCODENG']}` != 'SEND') {

                    let outdata = {
                      "PROCESSORDER": `${response.data['HEADER_INFO'][j]['PROCESS_ORDER']}`,
                      "POSTINGDATE": day,
                      "MATERIAL": `${response.data['HEADER_INFO'][j]['MATERIAL']}`,
                      "QUANTITY": `${db['recordsets'][0][0]['NOGOOD']}`,
                      "UNIT": `${response.data['HEADER_INFO'][j]['UOM']}`,
                      "QUANTITYSTATUS": "NG"
                    };
                    console.log(outdata);

                    let config = {
                      method: 'post',
                      maxBodyLength: Infinity,
                      url: 'http://172.23.10.168:14094/10GETDATAFROMJOBBINGAQC/POSTTOSTORE',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      data: outdata
                    };

                    await axios.request(config).then(async (SS) => {
                      //

                      console.log(SS.data);

                      // console.log(response.data);
                      if (SS.data['T_RETURN'].length > 0) {
                        output = SS.data['T_RETURN'][0]
                        if (`${SS.data['T_RETURN'][0]['TYPE']}` === `S`) {


                          // let queryUP = `UPDATE [SAPHANADATA].[dbo].[HSGOODRECEIVE] SET  [STATUSCODE] = 'SEND' WHERE PROCESS_ORDER = '00${response.data['HEADER_INFO'][j]['PROCESS_ORDER']}';`
                          // console.log(queryUP);
                          // let dbss = await mssqlR.qurey(queryUP);
                          let queryUP = `UPDATE [SAPHANADATA].[dbo].[HSGOODRECEIVE] SET  [STATUSCODENG] = 'SEND' WHERE PROCESS_ORDER = '00${response.data['HEADER_INFO'][j]['PROCESS_ORDER']}';`
                          console.log(queryUP);
                          let dbsss = await mssqlR.qurey(queryUP);
                        }
                      }


                    });
                    // let queryUP = `UPDATE [SAPHANADATA].[dbo].[HSGOODRECEIVE] SET  [STATUSCODENG] = 'SEND' WHERE PROCESS_ORDER = '00${response.data['HEADER_INFO'][j]['PROCESS_ORDER']}';`
                    // let dbsss = await mssqlR.qurey(queryUP);
                  }
                }
              }

            }

            // }
            //SYSTEM_STATUS
          }

        }//"UOM"
        // }

        // for (let i = 0; i < response.data['PHASE_INFO'].length; i++) {
        //   console.log(response.data['PHASE_INFO'][i]['PROCESS_ORDER']);
        //   // console.log(response.data['PHASE_INFO'][i]['OPERATION']);
        //   // console.log(response.data['PHASE_INFO'][i]['FG']);
        //   let querySV = `SELECT * FROM [SAPHANADATA].[dbo].[HSGOODRECEIVE] where PROCESS_ORDER = '00${response.data['PHASE_INFO'][i]['PROCESS_ORDER']}' and  [STATUSCODE] IS NULL ORDER BY date`
        //   console.log(querySV);

        //   let db = await mssqlR.qurey(querySV);
        //   if (db['recordsets'] != undefined) {
        //     if (db['recordsets'].length > 0) {
        //       output = db['recordsets'][0];

        //       if (db['recordsets'][0].length > 0) {
        //         console.log(db['recordsets'][0])

        //         if (`${response.data['PHASE_INFO'][i]['OPERATION']}` === `0600`) {
        //           // console.log(`${response.data['PHASE_INFO'][i]['OPERATION']}`);
        //           console.log(`${response.data['PHASE_INFO'][i]['OPERATION']}`);
        //           console.log(db['recordsets'][0]);
        //           // console.log(`${db['recordsets'][0][0]['GOOD']}`);
        //           if (`${db['recordsets'][0][0]['GOOD']}` != '') {

        //             let outdata = {
        //               "PROCESSORDER": `${response.data['PHASE_INFO'][i]['PROCESS_ORDER']}`,
        //               "POSTINGDATE": day,
        //               "MATERIAL": `${response.data['PHASE_INFO'][i]['FG']}`,
        //               "QUANTITY": `${db['recordsets'][0][0]['GOOD']}`,
        //               "UNIT": `${response.data['PHASE_INFO'][i]['UOM']}`,
        //               "QUANTITYSTATUS": "GOOD"
        //             };
        //             console.log(outdata);

        //             let config = {
        //               method: 'post',
        //               maxBodyLength: Infinity,
        //               url: 'http://172.23.10.168:14094/10GETDATAFROMJOBBINGAQC/POSTTOSTORE',
        //               headers: {
        //                 'Content-Type': 'application/json'
        //               },
        //               data: outdata
        //             };
        //             await axios.request(config).then(async (response) => {
        //               //
        //               console.log(response.data);
        //             });
        //           }

        //           if (`${db['recordsets'][0][0]['NOGOOD']}` != '') {

        //             let outdata = {
        //               "PROCESSORDER": `${response.data['PHASE_INFO'][i]['PROCESS_ORDER']}`,
        //               "POSTINGDATE": day,
        //               "MATERIAL": `${response.data['PHASE_INFO'][i]['FG']}`,
        //               "QUANTITY": `${db['recordsets'][0][0]['NOGOOD']}`,
        //               "UNIT": `${response.data['PHASE_INFO'][i]['UOM']}`,
        //               "QUANTITYSTATUS": "NG"
        //             };
        //             console.log(outdata);

        //             let config = {
        //               method: 'post',
        //               maxBodyLength: Infinity,
        //               url: 'http://172.23.10.168:14094/10GETDATAFROMJOBBINGAQC/POSTTOSTORE',
        //               headers: {
        //                 'Content-Type': 'application/json'
        //               },
        //               data: outdata
        //             };
        //             await axios.request(config).then(async (response) => {
        //               //
        //               console.log(response.data);
        //             });
        //           }

        //           let queryUP = `UPDATE [SAPHANADATA].[dbo].[HSGOODRECEIVE] SET  [STATUSCODE] = 'SEND' WHERE PROCESS_ORDER = '00${response.data['PHASE_INFO'][i]['PROCESS_ORDER']}';`
        //           let dbss = await mssqlR.qurey(queryUP);
        //         }
        //       }
        //     }
        //   }

        // }
      })
      .catch((error) => {
        console.log(error);
      });

  } catch (error) {

  }


  //-------------------------------------
  return res.json(output);
});

router.post('/10GETDATAFROMJOBBINGAQC/QCFN', async (req, res) => {
  //-------------------------------------
  console.log("--10GETDATAFROMJOBBINGAQC/QCFN--");
  console.log(req.body);
  let input = req.body;
  //-------------------------------------

  // let output = datatest04;


  let output = {};

  const axios = require('axios');
  // let data = JSON.stringify({
  //   "BAPI_NAME": "ZFMPP_QCFN_IN",
  //   "ORDERID": "2510000050",
  //   "PERNR_ID": "99"
  // });
  let data = input;

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://tp-portal.thaiparker.co.th/API_QcReport/ZBAPI_QC_INTERFACE',
    headers: {
      // 'token': '8e0647c4-7723-4252-9e09-cfcc54c94475',
      'token': '761a0f38-be2b-49e5-ae04-4860cab1e1d2',
      //
      //
      //
      'Content-Type': 'application/json'
    },
    data: data
  };

  await axios.request(config)
    .then(async (response) => {
      // console.log(JSON.stringify(response.data));
      output = response.data;
      // console.log(response);
      // console.log(response['data']['ExportParameter']);
      if (output['ExportParameter'] != undefined) {
        if (output['ExportParameter']['INACT_NEW'] === 'E') {
          let querySV = `INSERT INTO [SAPHANADATA].[dbo].[QCFNREC] ([PROCESS_ORDER], [QCFN], [STATUS],[MSGreturn]) VALUES ('${data['ORDERID']}','${output['ExportParameter']['INACT_NEW']}','NOK','${output}')`
          console.log(querySV);
          let dbss = await mssqlR.qurey(querySV);
        } else {
          let querySV = `INSERT INTO [SAPHANADATA].[dbo].[QCFNREC] ([PROCESS_ORDER], [QCFN], [STATUS],[MSGreturn]) VALUES ('${data['ORDERID']}','${output['ExportParameter']['INACT_NEW']}','OK','${output}')`
          console.log(querySV);
          let dbss = await mssqlR.qurey(querySV);
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });


  //-------------------------------------
  return res.json(output);
});

router.post('/10GETDATAFROMJOBBINGAQC/GENFLODER', async (req, res) => {
  //-------------------------------------
  console.log("--10GETDATAFROMJOBBINGAQC/GENFLODER--");
  console.log(req.body);
  let input = req.body;
  //-------------------------------------

  let output = {};

  if (input['MONTH'] != undefined && input['ORDER'] != undefined) {
    // var dir = `C:\\Users\\Administrator\\Desktop\\${input['name']}`;
    var dir = `\\\\172.20.10.150\\sap_s4hana\\S4PRD\\HSORDERSHEET_PP\\${input['MONTH']}\\${input['ORDER']}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }


  // let output = {};

  // const axios = require('axios');
  // let data = JSON.stringify({
  //   "BAPI_NAME": "ZFMPP_QCFN_IN",
  //   "ORDERID": "2510000050",
  //   "PERNR_ID": "99"
  // });
  // let data = input;
  // function createFolder(folder){
  //   makeDir(folder)
  //   }

  // createFolder("\\172.20.10.150\\sap_s4hana\\S4PRD\\TEST");
  // var dir = '\\\\172.20.10.150\\sap_s4hana\\S4PRD\\TEST';



  //-------------------------------------
  res.json(output);
});


router.post('/10GETDATAFROMJOBBINGAQC/SAPSETLOT', async (req, res) => {
  //-------------------------------------
  console.log("--10GETDATAFROMJOBBINGAQC/SAPSETLOT--");
  // console.log(req.body);
  let input = req.body;
  //-------------------------------------

  // let output = datatest02;
  // input = sapdatatest;
  let outputset = [];
  //-------------------------------------
  let buff = []

  let output = []
  let output2 = []
  let output3 = []
  let output4 = []
  let output5 = []
  let output6 = []
  let output7 = []
  let output8 = []
  let output9 = []

  //-------
  let input1 = input['HEADER_INFO']
  let input2 = input['COMPONENT_INFO']

  for (let i = 0; i < input2.length; i++) {
    let dataout1 = {};
    dataout1 = input2[i];
    // output.push(dataout1);

    for (let j = 0; j < input1.length; j++) {
      let dataout2 = {};
      dataout2 = input1[j];
      // output2.push(dataout2);
      if ((dataout2['PROCESS_ORDER'] === dataout1['PROCESS_ORDER'])) {



        // dataout2['ITEM_com']= dataout1['ITEM'];
        // dataout2['MATERIAL_com']= dataout1['MATERIAL'];
        // dataout2['MATERIAL_TEXT_com']= dataout1['MATERIAL_TEXT'];
        // dataout2['REQ_QTY_com']= dataout1['REQ_QTY'];
        // dataout2['UOM_com']= dataout1['UOM'];
        // dataout2['ITEM_CATE_com']= dataout1['ITEM_CATE'];
        // dataout2['NO_OF_BATCH_com']= dataout1['NO_OF_BATCH'];
        // dataout2['BATCH_com']= dataout1['BATCH'];
        // dataout2['BATCH_QTY_com']= dataout1['BATCH_QTY'];
        // dataout2['BATCH_UOM_com']= dataout1['BATCH_UOM'];
        // dataout2['STGE_LOC_com']= dataout1['STGE_LOC'];
        // dataout2['MVT_TYPE_com']= dataout1['MVT_TYPE'];
        // dataout2['OPERATION_com']= dataout1['OPERATION'];
        // dataout2['CUST_VEND_LOT_com']= dataout1['CUST_VEND_LOT'];
        // dataout2['CUST_VEND_LOT_com']= i;

        if (dataout1['CUST_VEND_LOT'] !== '?') {

          output3.push({
            "PROCESS_ORDER": dataout2['PROCESS_ORDER'],
            "ORDER_TYPE": dataout2['ORDER_TYPE'],
            "ORDER_TYPE_DESC": dataout2['ORDER_TYPE_DESC'],
            "PLANT": dataout2['PLANT'],
            "MATERIAL": dataout2['MATERIAL'],
            "MATERIAL_TEXT": dataout2['MATERIAL_TEXT'],
            "TOTAL_QTY": dataout2['TOTAL_QTY'],
            "UOM": dataout2['UOM'],
            "PROD_SUP": dataout2['PROD_SUP'],
            "PROD_SUP_DESC": dataout2['PROD_SUP_DESC'],
            "BASIC_START_DATE": dataout2['BASIC_START_DATE'],
            "BASIC_FINISH_DATE": dataout2['BASIC_FINISH_DATE'],
            "ORDER_SEQ_NO": dataout2['ORDER_SEQ_NO'],

            "BATCH": dataout2['BATCH'],
            "STGE_LOC": dataout2['STGE_LOC'],
            "INSP_LOT": dataout2['INSP_LOT'],
            "SYSTEM_STATUS": dataout2['SYSTEM_STATUS'],
            "USER_STATUS": dataout2['USER_STATUS'],
            "USER_STATUS_DESC": dataout2['USER_STATUS_DESC'],
            "OLD_MATERIAL": dataout2['OLD_MATERIAL'],



            //
            "ITEM_com": dataout1['ITEM'],
            "MATERIAL_com": dataout1['MATERIAL'],
            "MATERIAL_TEXT_com": dataout1['MATERIAL_TEXT'],
            "REQ_QTY_com": dataout1['REQ_QTY'],
            "UOM_com": dataout1['UOM'],
            "ITEM_CATE_com": dataout1['ITEM_CATE'],
            "NO_OF_BATCH_com": dataout1['NO_OF_BATCH'],
            "BATCH_com": dataout1['BATCH'],
            "BATCH_QTY_com": dataout1['BATCH_QTY'],
            "BATCH_UOM_com": dataout1['BATCH_UOM'],
            "STGE_LOC_com": dataout1['STGE_LOC'],
            "MVT_TYPE_com": dataout1['MVT_TYPE'],
            "OPERATION_com": dataout1['OPERATION'],
            "CUST_VEND_LOT_com": dataout1['CUST_VEND_LOT'],

          });
        } else {

          output4.push({
            "PROCESS_ORDER": dataout2['PROCESS_ORDER'],
            "ORDER_TYPE": dataout2['ORDER_TYPE'],
            "ORDER_TYPE_DESC": dataout2['ORDER_TYPE_DESC'],
            "PLANT": dataout2['PLANT'],
            "MATERIAL": dataout2['MATERIAL'],
            "MATERIAL_TEXT": dataout2['MATERIAL_TEXT'],
            "TOTAL_QTY": dataout2['TOTAL_QTY'],
            "UOM": dataout2['UOM'],
            "PROD_SUP": dataout2['PROD_SUP'],
            "PROD_SUP_DESC": dataout2['PROD_SUP_DESC'],
            "BASIC_START_DATE": dataout2['BASIC_START_DATE'],
            "BASIC_FINISH_DATE": dataout2['BASIC_FINISH_DATE'],
            "ORDER_SEQ_NO": dataout2['ORDER_SEQ_NO'],

            "BATCH": dataout2['BATCH'],
            "STGE_LOC": dataout2['STGE_LOC'],
            "INSP_LOT": dataout2['INSP_LOT'],
            "SYSTEM_STATUS": dataout2['SYSTEM_STATUS'],
            "USER_STATUS": dataout2['USER_STATUS'],
            "USER_STATUS_DESC": dataout2['USER_STATUS_DESC'],
            "OLD_MATERIAL": dataout2['OLD_MATERIAL'],



            //
            "ITEM_com": dataout1['ITEM'],
            "MATERIAL_com": dataout1['MATERIAL'],
            "MATERIAL_TEXT_com": dataout1['MATERIAL_TEXT'],
            "REQ_QTY_com": dataout1['REQ_QTY'],
            "UOM_com": dataout1['UOM'],
            "ITEM_CATE_com": dataout1['ITEM_CATE'],
            "NO_OF_BATCH_com": dataout1['NO_OF_BATCH'],
            "BATCH_com": dataout1['BATCH'],
            "BATCH_QTY_com": dataout1['BATCH_QTY'],
            "BATCH_UOM_com": dataout1['BATCH_UOM'],
            "STGE_LOC_com": dataout1['STGE_LOC'],
            "MVT_TYPE_com": dataout1['MVT_TYPE'],
            "OPERATION_com": dataout1['OPERATION'],
            "CUST_VEND_LOT_com": dataout1['CUST_VEND_LOT'],

          });
        }

      }
    }
  }

  for (let i = 0; i < input1.length; i++) {
    for (let j = 0; j < output4.length; j++) {
      if (output4[j]['BATCH'] === input1[i]['BATCH']) {
        input1[i]['order2'] = output4[j]['PROCESS_ORDER']
        output5.push(input1[i]);
      }
    }
  }

  for (let i = 0; i < input2.length; i++) {
    for (let j = 0; j < output5.length; j++) {
      if (output5[j]['PROCESS_ORDER'] === input2[i]['PROCESS_ORDER']) {
        input2[i]['order2'] = output5[j]['order2']
        output6.push(input2[i]);
        break;
      }
    }
  }

  //------------------------------------------------------------------------------

  for (let i = 0; i < output6.length; i++) {
    let dataout1 = {};
    dataout1 = output6[i];
    // output.push(dataout1);


    for (let j = 0; j < input1.length; j++) {
      let dataout2 = {};
      dataout2 = input1[j];
      // output2.push(dataout2);
      if ((dataout2['PROCESS_ORDER'] === dataout1['order2'])) {
        console.log(dataout1['CUST_VEND_LOT']);


        // dataout2['ITEM_com']= dataout1['ITEM'];
        // dataout2['MATERIAL_com']= dataout1['MATERIAL'];
        // dataout2['MATERIAL_TEXT_com']= dataout1['MATERIAL_TEXT'];
        // dataout2['REQ_QTY_com']= dataout1['REQ_QTY'];
        // dataout2['UOM_com']= dataout1['UOM'];
        // dataout2['ITEM_CATE_com']= dataout1['ITEM_CATE'];
        // dataout2['NO_OF_BATCH_com']= dataout1['NO_OF_BATCH'];
        // dataout2['BATCH_com']= dataout1['BATCH'];
        // dataout2['BATCH_QTY_com']= dataout1['BATCH_QTY'];
        // dataout2['BATCH_UOM_com']= dataout1['BATCH_UOM'];
        // dataout2['STGE_LOC_com']= dataout1['STGE_LOC'];
        // dataout2['MVT_TYPE_com']= dataout1['MVT_TYPE'];
        // dataout2['OPERATION_com']= dataout1['OPERATION'];
        // dataout2['CUST_VEND_LOT_com']= dataout1['CUST_VEND_LOT'];
        // dataout2['CUST_VEND_LOT_com']= i;

        if (dataout1['CUST_VEND_LOT'] !== '?') {

          output3.push({
            "PROCESS_ORDER": dataout2['PROCESS_ORDER'],
            "ORDER_TYPE": dataout2['ORDER_TYPE'],
            "ORDER_TYPE_DESC": dataout2['ORDER_TYPE_DESC'],
            "PLANT": dataout2['PLANT'],
            "MATERIAL": dataout2['MATERIAL'],
            "MATERIAL_TEXT": dataout2['MATERIAL_TEXT'],
            "TOTAL_QTY": dataout2['TOTAL_QTY'],
            "UOM": dataout2['UOM'],
            "PROD_SUP": dataout2['PROD_SUP'],
            "PROD_SUP_DESC": dataout2['PROD_SUP_DESC'],
            "BASIC_START_DATE": dataout2['BASIC_START_DATE'],
            "BASIC_FINISH_DATE": dataout2['BASIC_FINISH_DATE'],
            "ORDER_SEQ_NO": dataout2['ORDER_SEQ_NO'],

            "BATCH": dataout2['BATCH'],
            "STGE_LOC": dataout2['STGE_LOC'],
            "INSP_LOT": dataout2['INSP_LOT'],
            "SYSTEM_STATUS": dataout2['SYSTEM_STATUS'],
            "USER_STATUS": dataout2['USER_STATUS'],
            "USER_STATUS_DESC": dataout2['USER_STATUS_DESC'],
            "OLD_MATERIAL": dataout2['OLD_MATERIAL'],

            //
            "ITEM_com": dataout1['ITEM'],
            "MATERIAL_com": dataout1['MATERIAL'],
            "MATERIAL_TEXT_com": dataout1['MATERIAL_TEXT'],
            "REQ_QTY_com": dataout1['REQ_QTY'],
            "UOM_com": dataout1['UOM'],
            "ITEM_CATE_com": dataout1['ITEM_CATE'],
            "NO_OF_BATCH_com": dataout1['NO_OF_BATCH'],
            "BATCH_com": dataout1['BATCH'],
            "BATCH_QTY_com": dataout1['BATCH_QTY'],
            "BATCH_UOM_com": dataout1['BATCH_UOM'],
            "STGE_LOC_com": dataout1['STGE_LOC'],
            "MVT_TYPE_com": dataout1['MVT_TYPE'],
            "OPERATION_com": dataout1['OPERATION'],
            "CUST_VEND_LOT_com": dataout1['CUST_VEND_LOT'],

          });

        } else {
          output3.push({
            "PROCESS_ORDER": dataout2['PROCESS_ORDER'],
            "ORDER_TYPE": dataout2['ORDER_TYPE'],
            "ORDER_TYPE_DESC": dataout2['ORDER_TYPE_DESC'],
            "PLANT": dataout2['PLANT'],
            "MATERIAL": dataout2['MATERIAL'],
            "MATERIAL_TEXT": dataout2['MATERIAL_TEXT'],
            "TOTAL_QTY": dataout2['TOTAL_QTY'],
            "UOM": dataout2['UOM'],
            "PROD_SUP": dataout2['PROD_SUP'],
            "PROD_SUP_DESC": dataout2['PROD_SUP_DESC'],
            "BASIC_START_DATE": dataout2['BASIC_START_DATE'],
            "BASIC_FINISH_DATE": dataout2['BASIC_FINISH_DATE'],
            "ORDER_SEQ_NO": dataout2['ORDER_SEQ_NO'],

            "BATCH": dataout2['BATCH'],
            "STGE_LOC": dataout2['STGE_LOC'],
            "INSP_LOT": dataout2['INSP_LOT'],
            "SYSTEM_STATUS": dataout2['SYSTEM_STATUS'],
            "USER_STATUS": dataout2['USER_STATUS'],
            "USER_STATUS_DESC": dataout2['USER_STATUS_DESC'],
            "OLD_MATERIAL": dataout2['OLD_MATERIAL'],

            //
            "ITEM_com": dataout1['ITEM'],
            "MATERIAL_com": dataout1['MATERIAL'],
            "MATERIAL_TEXT_com": dataout1['MATERIAL_TEXT'],
            "REQ_QTY_com": dataout1['REQ_QTY'],
            "UOM_com": dataout1['UOM'],
            "ITEM_CATE_com": dataout1['ITEM_CATE'],
            "NO_OF_BATCH_com": dataout1['NO_OF_BATCH'],
            "BATCH_com": dataout1['BATCH'],
            "BATCH_QTY_com": dataout1['BATCH_QTY'],
            "BATCH_UOM_com": dataout1['BATCH_UOM'],
            "STGE_LOC_com": dataout1['STGE_LOC'],
            "MVT_TYPE_com": dataout1['MVT_TYPE'],
            "OPERATION_com": dataout1['OPERATION'],
            "CUST_VEND_LOT_com": dataout1['CUST_VEND_LOT'],

          });
        }


      }
    }
  }






  //-------------------------------------
  return res.json(output3);
});

router.post('/10GETDATAFROMJOBBINGAQC/SAPSETLOT2', async (req, res) => {
  //-------------------------------------
  console.log("--10GETDATAFROMJOBBINGAQC/SAPSETLOT2--");
  // console.log(req.body);
  let input = req.body;
  //-------------------------------------

  // let output = datatest02;
  // input = sapdatatest;
  let outputset = [];
  //-------------------------------------
  let buff = []

  let output = []
  let output2 = []
  let output3 = []
  let output4 = []
  let output5 = []
  let output6 = []
  let output7 = []
  let output8 = []
  let output9 = []

  //-------
  let input1 = input['HEADER_INFO']
  let input2 = input['COMPONENT_INFO']

  for (let i = 0; i < input2.length; i++) {
    let dataout1 = {};
    dataout1 = input2[i];
    // output.push(dataout1);

    for (let j = 0; j < input1.length; j++) {
      let dataout2 = {};
      dataout2 = input1[j];
      // output2.push(dataout2);
      if ((dataout2['PROCESS_ORDER'] === dataout1['PROCESS_ORDER'])) {



        // dataout2['ITEM_com']= dataout1['ITEM'];
        // dataout2['MATERIAL_com']= dataout1['MATERIAL'];
        // dataout2['MATERIAL_TEXT_com']= dataout1['MATERIAL_TEXT'];
        // dataout2['REQ_QTY_com']= dataout1['REQ_QTY'];
        // dataout2['UOM_com']= dataout1['UOM'];
        // dataout2['ITEM_CATE_com']= dataout1['ITEM_CATE'];
        // dataout2['NO_OF_BATCH_com']= dataout1['NO_OF_BATCH'];
        // dataout2['BATCH_com']= dataout1['BATCH'];
        // dataout2['BATCH_QTY_com']= dataout1['BATCH_QTY'];
        // dataout2['BATCH_UOM_com']= dataout1['BATCH_UOM'];
        // dataout2['STGE_LOC_com']= dataout1['STGE_LOC'];
        // dataout2['MVT_TYPE_com']= dataout1['MVT_TYPE'];
        // dataout2['OPERATION_com']= dataout1['OPERATION'];
        // dataout2['CUST_VEND_LOT_com']= dataout1['CUST_VEND_LOT'];
        // dataout2['CUST_VEND_LOT_com']= i;

        if (dataout1['CUST_VEND_LOT'] !== '?') {

          output3.push({
            "PROCESS_ORDER": dataout2['PROCESS_ORDER'],
            "ORDER_TYPE": dataout2['ORDER_TYPE'],
            "ORDER_TYPE_DESC": dataout2['ORDER_TYPE_DESC'],
            "PLANT": dataout2['PLANT'],
            "MATERIAL": dataout2['MATERIAL'],
            "MATERIAL_TEXT": dataout2['MATERIAL_TEXT'],
            "TOTAL_QTY": dataout2['TOTAL_QTY'],
            "UOM": dataout2['UOM'],
            "PROD_SUP": dataout2['PROD_SUP'],
            "PROD_SUP_DESC": dataout2['PROD_SUP_DESC'],
            "BASIC_START_DATE": dataout2['BASIC_START_DATE'],
            "BASIC_FINISH_DATE": dataout2['BASIC_FINISH_DATE'],
            "ORDER_SEQ_NO": dataout2['ORDER_SEQ_NO'],

            "BATCH": dataout2['BATCH'],
            "STGE_LOC": dataout2['STGE_LOC'],
            "INSP_LOT": dataout2['INSP_LOT'],
            "SYSTEM_STATUS": dataout2['SYSTEM_STATUS'],
            "USER_STATUS": dataout2['USER_STATUS'],
            "USER_STATUS_DESC": dataout2['USER_STATUS_DESC'],
            "OLD_MATERIAL": dataout2['OLD_MATERIAL'],



            //
            "ITEM_com": dataout1['ITEM'],
            "MATERIAL_com": dataout1['MATERIAL'],
            "MATERIAL_TEXT_com": dataout1['MATERIAL_TEXT'],
            "REQ_QTY_com": dataout1['REQ_QTY'],
            "UOM_com": dataout1['UOM'],
            "ITEM_CATE_com": dataout1['ITEM_CATE'],
            "NO_OF_BATCH_com": dataout1['NO_OF_BATCH'],
            "BATCH_com": dataout1['BATCH'],
            "BATCH_QTY_com": dataout1['BATCH_QTY'],
            "BATCH_UOM_com": dataout1['BATCH_UOM'],
            "STGE_LOC_com": dataout1['STGE_LOC'],
            "MVT_TYPE_com": dataout1['MVT_TYPE'],
            "OPERATION_com": dataout1['OPERATION'],
            "CUST_VEND_LOT_com": dataout1['CUST_VEND_LOT'],

          });
        } else {

          output4.push({
            "PROCESS_ORDER": dataout2['PROCESS_ORDER'],
            "ORDER_TYPE": dataout2['ORDER_TYPE'],
            "ORDER_TYPE_DESC": dataout2['ORDER_TYPE_DESC'],
            "PLANT": dataout2['PLANT'],
            "MATERIAL": dataout2['MATERIAL'],
            "MATERIAL_TEXT": dataout2['MATERIAL_TEXT'],
            "TOTAL_QTY": dataout2['TOTAL_QTY'],
            "UOM": dataout2['UOM'],
            "PROD_SUP": dataout2['PROD_SUP'],
            "PROD_SUP_DESC": dataout2['PROD_SUP_DESC'],
            "BASIC_START_DATE": dataout2['BASIC_START_DATE'],
            "BASIC_FINISH_DATE": dataout2['BASIC_FINISH_DATE'],
            "ORDER_SEQ_NO": dataout2['ORDER_SEQ_NO'],

            "BATCH": dataout2['BATCH'],
            "STGE_LOC": dataout2['STGE_LOC'],
            "INSP_LOT": dataout2['INSP_LOT'],
            "SYSTEM_STATUS": dataout2['SYSTEM_STATUS'],
            "USER_STATUS": dataout2['USER_STATUS'],
            "USER_STATUS_DESC": dataout2['USER_STATUS_DESC'],
            "OLD_MATERIAL": dataout2['OLD_MATERIAL'],



            //
            "ITEM_com": dataout1['ITEM'],
            "MATERIAL_com": dataout1['MATERIAL'],
            "MATERIAL_TEXT_com": dataout1['MATERIAL_TEXT'],
            "REQ_QTY_com": dataout1['REQ_QTY'],
            "UOM_com": dataout1['UOM'],
            "ITEM_CATE_com": dataout1['ITEM_CATE'],
            "NO_OF_BATCH_com": dataout1['NO_OF_BATCH'],
            "BATCH_com": dataout1['BATCH'],
            "BATCH_QTY_com": dataout1['BATCH_QTY'],
            "BATCH_UOM_com": dataout1['BATCH_UOM'],
            "STGE_LOC_com": dataout1['STGE_LOC'],
            "MVT_TYPE_com": dataout1['MVT_TYPE'],
            "OPERATION_com": dataout1['OPERATION'],
            "CUST_VEND_LOT_com": dataout1['CUST_VEND_LOT'],

          });
        }

      }
    }
  }

  for (let i = 0; i < input1.length; i++) {
    for (let j = 0; j < output4.length; j++) {
      if (output4[j]['BATCH'] === input1[i]['BATCH']) {
        input1[i]['order2'] = output4[j]['PROCESS_ORDER']
        output5.push(input1[i]);
      }
    }
  }

  for (let i = 0; i < input2.length; i++) {
    for (let j = 0; j < output5.length; j++) {
      if (output5[j]['PROCESS_ORDER'] === input2[i]['PROCESS_ORDER']) {
        input2[i]['order2'] = output5[j]['order2']
        output6.push(input2[i]);
        break;
      }
    }
  }

  //------------------------------------------------------------------------------

  for (let i = 0; i < output6.length; i++) {
    let dataout1 = {};
    dataout1 = output6[i];
    // output.push(dataout1);


    for (let j = 0; j < input1.length; j++) {
      let dataout2 = {};
      dataout2 = input1[j];
      // output2.push(dataout2);
      if ((dataout2['PROCESS_ORDER'] === dataout1['order2'])) {
        console.log(dataout1['CUST_VEND_LOT']);


        // dataout2['ITEM_com']= dataout1['ITEM'];
        // dataout2['MATERIAL_com']= dataout1['MATERIAL'];
        // dataout2['MATERIAL_TEXT_com']= dataout1['MATERIAL_TEXT'];
        // dataout2['REQ_QTY_com']= dataout1['REQ_QTY'];
        // dataout2['UOM_com']= dataout1['UOM'];
        // dataout2['ITEM_CATE_com']= dataout1['ITEM_CATE'];
        // dataout2['NO_OF_BATCH_com']= dataout1['NO_OF_BATCH'];
        // dataout2['BATCH_com']= dataout1['BATCH'];
        // dataout2['BATCH_QTY_com']= dataout1['BATCH_QTY'];
        // dataout2['BATCH_UOM_com']= dataout1['BATCH_UOM'];
        // dataout2['STGE_LOC_com']= dataout1['STGE_LOC'];
        // dataout2['MVT_TYPE_com']= dataout1['MVT_TYPE'];
        // dataout2['OPERATION_com']= dataout1['OPERATION'];
        // dataout2['CUST_VEND_LOT_com']= dataout1['CUST_VEND_LOT'];
        // dataout2['CUST_VEND_LOT_com']= i;

        if (dataout1['CUST_VEND_LOT'] !== '?') {

          output3.push({
            "PROCESS_ORDER": dataout2['PROCESS_ORDER'],
            "ORDER_TYPE": dataout2['ORDER_TYPE'],
            "ORDER_TYPE_DESC": dataout2['ORDER_TYPE_DESC'],
            "PLANT": dataout2['PLANT'],
            "MATERIAL": dataout2['MATERIAL'],
            "MATERIAL_TEXT": dataout2['MATERIAL_TEXT'],
            "TOTAL_QTY": dataout2['TOTAL_QTY'],
            "UOM": dataout2['UOM'],
            "PROD_SUP": dataout2['PROD_SUP'],
            "PROD_SUP_DESC": dataout2['PROD_SUP_DESC'],
            "BASIC_START_DATE": dataout2['BASIC_START_DATE'],
            "BASIC_FINISH_DATE": dataout2['BASIC_FINISH_DATE'],
            "ORDER_SEQ_NO": dataout2['ORDER_SEQ_NO'],

            "BATCH": dataout2['BATCH'],
            "STGE_LOC": dataout2['STGE_LOC'],
            "INSP_LOT": dataout2['INSP_LOT'],
            "SYSTEM_STATUS": dataout2['SYSTEM_STATUS'],
            "USER_STATUS": dataout2['USER_STATUS'],
            "USER_STATUS_DESC": dataout2['USER_STATUS_DESC'],
            "OLD_MATERIAL": dataout2['OLD_MATERIAL'],

            //
            "ITEM_com": dataout1['ITEM'],
            "MATERIAL_com": dataout1['MATERIAL'],
            "MATERIAL_TEXT_com": dataout1['MATERIAL_TEXT'],
            "REQ_QTY_com": dataout1['REQ_QTY'],
            "UOM_com": dataout1['UOM'],
            "ITEM_CATE_com": dataout1['ITEM_CATE'],
            "NO_OF_BATCH_com": dataout1['NO_OF_BATCH'],
            "BATCH_com": dataout1['BATCH'],
            "BATCH_QTY_com": dataout1['BATCH_QTY'],
            "BATCH_UOM_com": dataout1['BATCH_UOM'],
            "STGE_LOC_com": dataout1['STGE_LOC'],
            "MVT_TYPE_com": dataout1['MVT_TYPE'],
            "OPERATION_com": dataout1['OPERATION'],
            "CUST_VEND_LOT_com": dataout1['CUST_VEND_LOT'],

          });

        } else {
          // output3.push({
          //   "PROCESS_ORDER": dataout2['PROCESS_ORDER'],
          //   "ORDER_TYPE": dataout2['ORDER_TYPE'],
          //   "ORDER_TYPE_DESC": dataout2['ORDER_TYPE_DESC'],
          //   "PLANT": dataout2['PLANT'],
          //   "MATERIAL": dataout2['MATERIAL'],
          //   "MATERIAL_TEXT": dataout2['MATERIAL_TEXT'],
          //   "TOTAL_QTY": dataout2['TOTAL_QTY'],
          //   "UOM": dataout2['UOM'],
          //   "PROD_SUP": dataout2['PROD_SUP'],
          //   "PROD_SUP_DESC": dataout2['PROD_SUP_DESC'],
          //   "BASIC_START_DATE": dataout2['BASIC_START_DATE'],
          //   "BASIC_FINISH_DATE": dataout2['BASIC_FINISH_DATE'],
          //   "ORDER_SEQ_NO": dataout2['ORDER_SEQ_NO'],

          //   "BATCH": dataout2['BATCH'],
          //   "STGE_LOC": dataout2['STGE_LOC'],
          //   "INSP_LOT": dataout2['INSP_LOT'],
          //   "SYSTEM_STATUS": dataout2['SYSTEM_STATUS'],
          //   "USER_STATUS": dataout2['USER_STATUS'],
          //   "USER_STATUS_DESC": dataout2['USER_STATUS_DESC'],
          //   "OLD_MATERIAL": dataout2['OLD_MATERIAL'],

          //   //
          //   "ITEM_com": dataout1['ITEM'],
          //   "MATERIAL_com": dataout1['MATERIAL'],
          //   "MATERIAL_TEXT_com": dataout1['MATERIAL_TEXT'],
          //   "REQ_QTY_com": dataout1['REQ_QTY'],
          //   "UOM_com": dataout1['UOM'],
          //   "ITEM_CATE_com": dataout1['ITEM_CATE'],
          //   "NO_OF_BATCH_com": dataout1['NO_OF_BATCH'],
          //   "BATCH_com": dataout1['BATCH'],
          //   "BATCH_QTY_com": dataout1['BATCH_QTY'],
          //   "BATCH_UOM_com": dataout1['BATCH_UOM'],
          //   "STGE_LOC_com": dataout1['STGE_LOC'],
          //   "MVT_TYPE_com": dataout1['MVT_TYPE'],
          //   "OPERATION_com": dataout1['OPERATION'],
          //   "CUST_VEND_LOT_com": dataout1['CUST_VEND_LOT'],

          // });
        }


      }
    }
  }






  //-------------------------------------
  return res.json(output3);
});

router.post('/10GETDATAFROMJOBBINGAQC/AUTOSTORE_N', async (req, res) => {
  //-------------------------------------
  console.log("--10GETDATAFROMJOBBINGAQC/AUTOSTORE_N--");
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = [];

  if (input[`DATESTART`] != undefined && input[`DATEEND`] != undefined) {

    // let output = datatest02;


    try {

      // let querySV = `SELECT * FROM [SAPHANADATA].[dbo].[HSGOODRECEIVE] where date between '2025/05/20' and '2025/05/30' and [STATUSCODE] IS NULL ORDER BY date`
      let querySV = `SELECT * FROM [SAPHANADATA].[dbo].[HSGOODRECEIVE] where date between '${input[`DATESTART`]}' and '${input[`DATEEND`]}' and [STATUSCODE] IS NULL ORDER BY date`
      let db = await mssqlR.qurey(querySV);

      //and [STATUSCODE] IS NULL ORDER BY date

      if (db['recordsets'] != undefined) {
        if (['recordsets'].length > 0) {
          let dataUDlist = db['recordsets'][0];
          // console.log(output);
          for (let i = 0; i < dataUDlist.length; i++) {
            console.log(dataUDlist[i][`PROCESS_ORDER`]);
            // console.log(input[`DATEEND`]);
            for (let j = 0; j < 10; j++) {
              //input[`DATEEND`]
              // console.log(j);

              //var d = new Date(new Date().setDate(new Date().getDate()-10));
              var mydate = new Date(`${input[`DATEEND`]}`);
              // console.log(mydate.toDateString());
              // console.log(`---------------`);
              var mydatestart = new Date(new Date(`${input[`DATEEND`]}`).setDate(new Date(`${input[`DATEEND`]}`).getDate() - (j + 0) * 25));
              // console.log(`${mydatestart.getDate().pad(2)}.${(mydatestart.getMonth() + 1).pad(2)}.${mydatestart.getFullYear().pad(2)}`);
              var mydateend = new Date(new Date(`${input[`DATEEND`]}`).setDate(new Date(`${input[`DATEEND`]}`).getDate() - (j + 1) * 25));
              // console.log(`${mydateend.getDate().pad(2)}.${(mydateend.getMonth() + 1).pad(2)}.${mydateend.getFullYear().pad(2)}`);

              test = {
                "HEADER": {
                  "PLANT": `${input[`PLANT`]}`,
                  "ORD_ST_DATE_FR": `${mydateend.getDate().pad(2)}.${(mydateend.getMonth() + 1).pad(2)}.${mydateend.getFullYear().pad(2)}`,
                  "ORD_ST_DATE_TO": `${mydatestart.getDate().pad(2)}.${(mydatestart.getMonth() + 1).pad(2)}.${mydatestart.getFullYear().pad(2)}`,
                  "ORDER_TYPE": "",
                  "PROD_SUP": ""
                },
                "PROC_ORD": [
                  {
                    "PROCESS_ORDER": `${dataUDlist[i][`PROCESS_ORDER`]}`,
                    "MATERIAL": "",
                    "COMPONENT": ""
                  }
                ]
              };
              // console.log(test);
              //
              let config = {
                method: 'post',
                maxBodyLength: Infinity,
                // url: 'http://172.23.10.168:14090/DATAGW/QMI002GET',
                url: 'http://172.23.10.168:14094/10GETDATAFROMJOBBINGAQC/GETDATA',
                headers: {
                  'Content-Type': 'application/json'
                },
                data: test
              };

              let datasetp = [];
              let datasetpPHASE_INFO = [];

              await axios.request(config)
                .then((response) => {
                  // console.log(JSON.stringify(response.data));
                  // console.log((response.data));
                  let datasap = response.data
                  if (datasap['HEADER_INFO'].length > 0) {
                    // console.log(datasap['HEADER_INFO']);
                    datasetp = datasap['HEADER_INFO'];
                    datasetpPHASE_INFO = datasap['PHASE_INFO'];
                  }
                })
                .catch((error) => {
                  // console.log(error);
                });

              if (datasetp.length > 0) {
                console.log(datasetp[0]);
                console.log(dataUDlist[i])
                // let setdataapp = datasetp[0]
                // console.log(`${datasetp[0]['SYSTEM_STATUS']}`)
                // console.log(`${datasetp[0]['SYSTEM_STATUS']}`)
                //  console.log(`${datasetpPHASE_INFO}`)
                for (let s = 0; s < datasetpPHASE_INFO.length; s++) {
                  if (datasetpPHASE_INFO[s]['OPERATION'] === '0600') {
                    console.log(datasetpPHASE_INFO[s])
                  }

                }
                if (`${datasetp[0]['SYSTEM_STATUS']}`.includes("PCNF")) {
                  console.log(`------>>NOK`)
                } else {
                  console.log(`------>>OK`)
                }
                break;
              }



            }

          }
        }
      }

    } catch (error) {

    }



    output = []
  }


  //-------------------------------------
  return res.json(output);
});


// let sapdatatest = {}
module.exports = router;


