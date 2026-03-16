const express = require("express");
const router = express.Router();
var mssqlR = require('../../function/mssqlR');
var mongodb = require('../../function/mongodb');
var httpreq = require('../../function/axios');
var axios = require('axios');
const { callSAPAPI } = require('../../function/sapCaller');


router.get('/TEST', async (req, res) => {
  // console.log(mssql.qurey())
  res.json("TEST");
});



router.post('/INC/inputdata', async (req, res) => {
  //-------------------------------------
  console.log("--INC/inputdata--");
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let datain = data;
  let query = `INSERT INTO [SOI8_INVs].[dbo].[incomming] ([Order]
      ,[Material]
      ,[Material_Description]
      ,[Batch]
      ,[MRP_ctrlr]
      ,[ProdSched]
      ,[Plant]
      ,[System_Status]
      ,[Version]
      ,[Entered_by]
      ,[Target_qty]
      ,[Unit]
      ,[Bsc_start]) VALUES `
  let listset = ''
  for (let i = 0; i < datain.length; i++) {
    if (i === 0) {
      listset = listset + `('${datain[i]['Order']}','${datain[i]['Material']}','${datain[i]['Material description']}','${datain[i]['Batch']}','${datain[i]['MRP ctrlr']}','${datain[i]['ProdSched.']}','${datain[i]['Plant']}','${datain[i]['System Status']}','${datain[i]['Version']}','${datain[i]['Entered by']}','${datain[i]['Target qty']}','${datain[i]['Unit']}','${datain[i]['Bsc start']}')`
    } else {
      listset = listset + `,('${datain[i]['Order']}','${datain[i]['Material']}','${datain[i]['Material description']}','${datain[i]['Batch']}','${datain[i]['MRP ctrlr']}','${datain[i]['ProdSched.']}','${datain[i]['Plant']}','${datain[i]['System Status']}','${datain[i]['Version']}','${datain[i]['Entered by']}','${datain[i]['Target qty']}','${datain[i]['Unit']}','${datain[i]['Bsc start']}')`
    }

  }
  query = query + listset;

  console.log(query)

  let db = await mssqlR.qureyR(query);

  console.log(db)


  //-------------------------------------
  res.json(db);
});

router.post('/03iPPGETDATACHEM/GETDATA', async (req, res) => {
  //-------------------------------------
  console.log("--03iPPGETDATACHEM/GETDATA--");
  console.log(req.body);
  let input = req.body;
  //-------------------------------------

  // let output = datatest02;
  let output = {};

  // "ORD_ST_DATE_FR": "01.03.2025",
  // "ORD_ST_DATE_TO": "07.03.2025",
  output = await callSAPAPI('PPI001GET', input) ?? {};


  //-------------------------------------
  res.json(output);
});


router.post('/03iPPGETDATACHEM/SETI005DATA', async (req, res) => {
  //-------------------------------------
  console.log("--03iPPGETDATACHEM/SETI005DATA--");
  console.log(req.body);
  let input = req.body;
  //-------------------------------------

  // let output = datatest01;
  let output = {};

  output = await callSAPAPI('PPI005SET', input) ?? {};


  //-------------------------------------
  res.json(output);
});

router.post('/03iPPGETDATACHEM/SETI003DATA', async (req, res) => {
  //-------------------------------------
  console.log("--03iPPGETDATACHEM/SETI003DATA--");
  console.log(req.body);
  let input = req.body;
  //-------------------------------------

  // let output = datatest01;
  let output = {};

  output = await callSAPAPI('PPI003SET', input) ?? {};


  //-------------------------------------
  res.json(output);
});



module.exports = router;

