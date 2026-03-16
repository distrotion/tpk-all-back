const express = require("express");
const router = express.Router();
var mssql = require('../../function/mssql');
var mssqlR = require('../../function/mssqlR');
var mongodb = require('../../function/mongodb');
var httpreq = require('../../function/axios');
var axios = require('axios');
const fs = require('fs');
const path = require('path');
const { callSAPAPI } = require('../../function/sapCaller');


function base64ToPdf(base64String, outputFilePath) {
  const data = Buffer.from(base64String, 'base64');
  fs.writeFileSync(outputFilePath, data);
}

// ─── SAP Post Logger ──────────────────────────────────────────────────────────
const SAP_LOG_DIR = path.join(__dirname, '..', '..', 'logs', 'autostore');
if (!fs.existsSync(SAP_LOG_DIR)) fs.mkdirSync(SAP_LOG_DIR, { recursive: true });

const SAP_CSV_HEADER = 'datetime,process_order,material,quantity,qty_status,sap_type,sap_message,status,error\n';

function csvEsc(val) {
  const s = String(val ?? '');
  return (s.includes(',') || s.includes('"') || s.includes('\n'))
    ? '"' + s.replace(/"/g, '""') + '"'
    : s;
}

function writeSAPLog(processOrder, material, quantity, qtyStatus, sapType, sapMessage, status, errMsg = '') {
  try {
    const now      = new Date();
    const dateStr  = now.toISOString().slice(0, 10);
    const datetime = now.toISOString().replace('T', ' ').slice(0, 23);
    const filePath = path.join(SAP_LOG_DIR, `${dateStr}.csv`);
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, SAP_CSV_HEADER, 'utf8');
    const line = [
      csvEsc(datetime), csvEsc(processOrder), csvEsc(material),
      csvEsc(quantity),  csvEsc(qtyStatus),    csvEsc(sapType),
      csvEsc(sapMessage), csvEsc(status),       csvEsc(errMsg),
    ].join(',') + '\n';
    fs.appendFileSync(filePath, line, 'utf8');
  } catch (e) {
    console.error('writeSAPLog error:', e.message);
  }
}
// ─────────────────────────────────────────────────────────────────────────────

// callSAPAPI — imported from ../../function/sapCaller (logs to logs/sap/YYYY-MM-DD_APINAME.csv)

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
  output = await callSAPAPI('PPI002GET', input) ?? {};


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
    let db = await mssqlR.qureyR(querySV);



    if (db['recordsets'] != undefined) {
      if (db['recordsets'].length > 0) {
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
    let db = await mssqlR.qureyR(querySV);



    if (db['recordsets'] != undefined) {
      if (db['recordsets'].length > 0) {
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
    let db = await mssqlR.qureyR(querySV);



    if (db['recordsets'] != undefined) {
      if (db['recordsets'].length > 0) {
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

  output = await callSAPAPI('PPI004SET', input) ?? {};

  //-------------------------------------
  res.json(output);
});

router.post('/10GETDATAFROMJOBBINGAQC/AUTOSTORE', async (req, res) => {
  //-------------------------------------
  console.log("--10GETDATAFROMJOBBINGAQC/AUTOSTORE--");
  console.log(req.body);
  let input = req.body;
  //-------------------------------------

  let output = {};

  // helper: call PPI004SET via central caller (logs to logs/sap/) + autostore detail log
  async function postToSAP(outdata) {
    const result = await callSAPAPI('PPI004SET', outdata);
    const ret    = result?.['T_RETURN']?.[0] ?? {};
    writeSAPLog(
      outdata['PROCESSORDER'], outdata['MATERIAL'],
      outdata['QUANTITY'],     outdata['QUANTITYSTATUS'],
      ret['TYPE'] ?? '', ret['MESSAGE'] ?? '',
      result ? 'OK' : 'ERROR'
    );
    return result;
  }

  try {
    const d = new Date();
    const day = `${(d.getDate()).pad(2)}.${(d.getMonth() + 1).pad(2)}.${d.getFullYear()}`;

    // Step 1: ดึง HEADER_INFO จาก SAP ก่อน
    const sapData = await callSAPAPI('PPI002GET', input);
    if (!sapData || !sapData['HEADER_INFO'] || sapData['HEADER_INFO'].length === 0) {
      return res.json(output);
    }

    const headerList = sapData['HEADER_INFO'];

    // Step 2: batch SELECT 1 ครั้ง แทนที่จะ query ทีละ order
    const inClause = headerList.map(h => `'00${h['PROCESS_ORDER']}'`).join(',');
    const dbBatch = await mssqlR.qureyR(
      `SELECT * FROM [SAPHANADATA].[dbo].[HSGOODRECEIVE] WHERE PROCESS_ORDER IN (${inClause}) ORDER BY date`
    );

    // Step 3: สร้าง map PROCESS_ORDER → DB row (O(1) lookup)
    const dbMap = {};
    if (dbBatch['recordsets'] && dbBatch['recordsets'].length > 0) {
      for (const row of dbBatch['recordsets'][0]) {
        dbMap[row['PROCESS_ORDER']] = row;
      }
    }

    // Step 4: process แต่ละ order โดยใช้ map แทน query
    for (const hdr of headerList) {
      console.log(hdr['PROCESS_ORDER']);
      const row = dbMap[`00${hdr['PROCESS_ORDER']}`];
      if (!row) continue;

      const systemStatus = `${hdr['SYSTEM_STATUS']}`;

      // ส่ง GOOD qty
      if (!systemStatus.includes("PCNF")) {
        const goodNeeded = `${row['GOOD']}` !== '' && `${row['GOOD']}` !== '0';
        const goodNotSent = systemStatus.includes("CNF") && !systemStatus.includes("DLV")
          ? true
          : `${row['STATUSCODE']}` !== 'SEND';

        if (goodNeeded && goodNotSent) {
          const outdata = {
            "PROCESSORDER": `${hdr['PROCESS_ORDER']}`,
            "POSTINGDATE": day,
            "MATERIAL": `${hdr['MATERIAL']}`,
            "QUANTITY": `${row['GOOD']}`,
            "UNIT": `${hdr['UOM']}`,
            "QUANTITYSTATUS": "GOOD"
          };
          console.log(outdata);
          const sapResult = await postToSAP(outdata);
          if (sapResult && sapResult['T_RETURN'] && sapResult['T_RETURN'].length > 0) {
            output = sapResult['T_RETURN'][0];
            if (`${sapResult['T_RETURN'][0]['TYPE']}` === 'S') {
              const queryUP = `UPDATE [SAPHANADATA].[dbo].[HSGOODRECEIVE] SET [STATUSCODE] = 'SEND' WHERE PROCESS_ORDER = '00${hdr['PROCESS_ORDER']}';`;
              console.log(queryUP);
              await mssqlR.qureyR(queryUP);
            }
          }
        }
      }

      // ส่ง NG qty
      if (`${row['NOGOOD']}` !== '' && `${row['NOGOOD']}` !== '0' && `${row['STATUSCODENG']}` !== 'SEND') {
        const outdata = {
          "PROCESSORDER": `${hdr['PROCESS_ORDER']}`,
          "POSTINGDATE": day,
          "MATERIAL": `${hdr['MATERIAL']}`,
          "QUANTITY": `${row['NOGOOD']}`,
          "UNIT": `${hdr['UOM']}`,
          "QUANTITYSTATUS": "NG"
        };
        console.log(outdata);
        const sapResult = await postToSAP(outdata);
        if (sapResult && sapResult['T_RETURN'] && sapResult['T_RETURN'].length > 0) {
          output = sapResult['T_RETURN'][0];
          if (`${sapResult['T_RETURN'][0]['TYPE']}` === 'S') {
            const queryUP = `UPDATE [SAPHANADATA].[dbo].[HSGOODRECEIVE] SET [STATUSCODENG] = 'SEND' WHERE PROCESS_ORDER = '00${hdr['PROCESS_ORDER']}';`;
            console.log(queryUP);
            await mssqlR.qureyR(queryUP);
          }
        }
      }
    }

  } catch (error) {
    console.log(error);
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
          let querySV = `INSERT INTO [SAPHANADATA].[dbo].[QCFNREC] ([PROCESS_ORDER], [QCFN], [STATUS],[MSGreturn]) VALUES ('${data['ORDERID']}','${output['ExportParameter']['INACT_NEW']}','NOK','${JSON.stringify(output)}')`
          console.log(querySV);
          let dbss = await mssqlR.qureyR(querySV);
        } else {
          let querySV = `INSERT INTO [SAPHANADATA].[dbo].[QCFNREC] ([PROCESS_ORDER], [QCFN], [STATUS],[MSGreturn]) VALUES ('${data['ORDERID']}','${output['ExportParameter']['INACT_NEW']}','OK','${JSON.stringify(output)}')`
          console.log(querySV);
          let dbss = await mssqlR.qureyR(querySV);
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

async function postQtyToSAP(headerInfo, quantity, quantityStatus, postingDate, processOrderDB, statusField) {
  const outdata = {
    "PROCESSORDER": `${headerInfo['PROCESS_ORDER']}`,
    "POSTINGDATE": postingDate,
    "MATERIAL": `${headerInfo['MATERIAL']}`,
    "QUANTITY": `${quantity}`,
    "UNIT": `${headerInfo['UOM']}`,
    "QUANTITYSTATUS": quantityStatus
  };
  console.log(outdata);
  const sapData = await callSAPAPI('PPI004SET', outdata);
  let result = null;
  if (sapData?.['T_RETURN']?.length > 0) {
    result = sapData['T_RETURN'][0];
    if (`${result['TYPE']}` === 'S') {
      const queryUP = `UPDATE [SAPHANADATA].[dbo].[HSGOODRECEIVE] SET [${statusField}] = 'SEND' WHERE PROCESS_ORDER = '${processOrderDB}';`;
      console.log(queryUP);
      await mssqlR.qureyR(queryUP);
    }
  }
  return result;
}

router.post('/10GETDATAFROMJOBBINGAQC/AUTOSTORE_N', async (req, res) => {
  //-------------------------------------
  console.log("--10GETDATAFROMJOBBINGAQC/AUTOSTORE_N--");
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = [];

  if (input[`DATESTART`] == undefined || input[`DATEEND`] == undefined) {
    return res.json(output);
  }

  try {
    let querySV = `SELECT * FROM [SAPHANADATA].[dbo].[HSGOODRECEIVE] where date between '${input[`DATESTART`]}' and '${input[`DATEEND`]}' and ([STATUSCODE] IS NULL OR [STATUSCODENG] IS NULL) ORDER BY date`
    let db = await mssqlR.qureyR(querySV);

    if (db['recordsets'] == undefined || db['recordsets'].length === 0) {
      return res.json(output);
    }

    let dataUDlist = db['recordsets'][0];
    const now = new Date();
    const postingDate = `${now.getDate().pad(2)}.${(now.getMonth() + 1).pad(2)}.${now.getFullYear()}`;

    // pre-compute date ranges (10 ช่วง x 25 วัน)
    const baseDate = new Date(input[`DATEEND`]);
    const dateRanges = Array.from({ length: 10 }, (_, j) => {
      const dateFrom = new Date(baseDate); dateFrom.setDate(baseDate.getDate() - (j + 1) * 25);
      const dateTo   = new Date(baseDate); dateTo.setDate(baseDate.getDate() - j * 25);
      return { dateFrom, dateTo };
    });

    // Phase 1: ค้นหา SAP header info — ส่ง PROC_ORD ทุก record ในคำขอเดียวต่อ 1 window
    // จาก N×10 GETDATA calls → max 10 calls
    const headerMap = {}; // { DB_PROCESS_ORDER: headerInfo }

    for (let j = 0; j < dateRanges.length; j++) {
      const notFoundYet = dataUDlist.filter(r => !headerMap[r['PROCESS_ORDER']]);
      if (notFoundYet.length === 0) break;

      const { dateFrom, dateTo } = dateRanges[j];
      const sapPayload = {
        "HEADER": {
          "PLANT": `${input['PLANT']}`,
          "ORD_ST_DATE_FR": `${dateFrom.getDate().pad(2)}.${(dateFrom.getMonth() + 1).pad(2)}.${dateFrom.getFullYear()}`,
          "ORD_ST_DATE_TO": `${dateTo.getDate().pad(2)}.${(dateTo.getMonth() + 1).pad(2)}.${dateTo.getFullYear()}`,
          "ORDER_TYPE": "",
          "PROD_SUP": ""
        },
        "PROC_ORD": notFoundYet.map(r => ({ "PROCESS_ORDER": `${r['PROCESS_ORDER']}`, "MATERIAL": "", "COMPONENT": "" }))
      };
      console.log(`GETDATA window [j=${j}]: ${notFoundYet.length} orders`);

      const sapRes = await callSAPAPI('PPI002GET', sapPayload);
      if (sapRes?.['HEADER_INFO']?.length > 0) {
        for (const h of sapRes['HEADER_INFO']) {
          // SAP คืน PROCESS_ORDER โดยไม่มี prefix "00", DB เก็บแบบมี "00"
          const dbKey = dataUDlist.find(r => r['PROCESS_ORDER'] === `00${h['PROCESS_ORDER']}` || r['PROCESS_ORDER'] === h['PROCESS_ORDER']);
          if (dbKey && !headerMap[dbKey['PROCESS_ORDER']]) {
            headerMap[dbKey['PROCESS_ORDER']] = h;
          }
        }
      }
    }

    // Phase 2: ส่งข้อมูลแต่ละ record — GOOD และ NG parallel ต่อ record
    for (const record of dataUDlist) {
      const headerInfo = headerMap[record['PROCESS_ORDER']];
      if (!headerInfo) {
        console.log(`SAP not found: ${record['PROCESS_ORDER']}`);
        output.push({ PROCESS_ORDER: record['PROCESS_ORDER'], STATUS: 'SAP_NOT_FOUND' });
        continue;
      }

      const goodNeeded = `${record['GOOD']}` !== '' && `${record['GOOD']}` !== '0' && `${record['STATUSCODE']}` !== 'SEND';
      const ngNeeded   = `${record['NOGOOD']}` !== '' && `${record['NOGOOD']}` !== '0' && `${record['STATUSCODENG']}` !== 'SEND';

      const [goodResult, ngResult] = await Promise.all([
        goodNeeded ? postQtyToSAP(headerInfo, record['GOOD'], 'GOOD', postingDate, record['PROCESS_ORDER'], 'STATUSCODE') : Promise.resolve(null),
        ngNeeded   ? postQtyToSAP(headerInfo, record['NOGOOD'], 'NG', postingDate, record['PROCESS_ORDER'], 'STATUSCODENG') : Promise.resolve(null),
      ]);

      output.push({ PROCESS_ORDER: record['PROCESS_ORDER'], GOOD: goodResult, NG: ngResult });
    }

  } catch (error) {
    console.log(error);
  }

  //-------------------------------------
  return res.json(output);
});


// let sapdatatest = {}
module.exports = router;


