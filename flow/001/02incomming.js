const express = require("express");
const router = express.Router();
var mssqlR = require('../../function/mssqlR');
var mongodb = require('../../function/mongodb');
var httpreq = require('../../function/axios');
var axios = require('axios');


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
    if(i===0){
      listset = listset +`('${datain[i]['Order']}','${datain[i]['Material']}','${datain[i]['Material description']}','${datain[i]['Batch']}','${datain[i]['MRP ctrlr']}','${datain[i]['ProdSched.']}','${datain[i]['Plant']}','${datain[i]['System Status']}','${datain[i]['Version']}','${datain[i]['Entered by']}','${datain[i]['Target qty']}','${datain[i]['Unit']}','${datain[i]['Bsc start']}')` 
    }else{
      listset = listset +`,('${datain[i]['Order']}','${datain[i]['Material']}','${datain[i]['Material description']}','${datain[i]['Batch']}','${datain[i]['MRP ctrlr']}','${datain[i]['ProdSched.']}','${datain[i]['Plant']}','${datain[i]['System Status']}','${datain[i]['Version']}','${datain[i]['Entered by']}','${datain[i]['Target qty']}','${datain[i]['Unit']}','${datain[i]['Bsc start']}')` 
    }
  
  }
  query = query + listset;

  console.log(query)

  let db = await mssqlR.qurey(query);

  console.log(db)


  //-------------------------------------
  res.json(db);
});


module.exports = router;







let data =[

];
 