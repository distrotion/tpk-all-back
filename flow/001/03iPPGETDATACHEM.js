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
    if (i === 0) {
      listset = listset + `('${datain[i]['Order']}','${datain[i]['Material']}','${datain[i]['Material description']}','${datain[i]['Batch']}','${datain[i]['MRP ctrlr']}','${datain[i]['ProdSched.']}','${datain[i]['Plant']}','${datain[i]['System Status']}','${datain[i]['Version']}','${datain[i]['Entered by']}','${datain[i]['Target qty']}','${datain[i]['Unit']}','${datain[i]['Bsc start']}')`
    } else {
      listset = listset + `,('${datain[i]['Order']}','${datain[i]['Material']}','${datain[i]['Material description']}','${datain[i]['Batch']}','${datain[i]['MRP ctrlr']}','${datain[i]['ProdSched.']}','${datain[i]['Plant']}','${datain[i]['System Status']}','${datain[i]['Version']}','${datain[i]['Entered by']}','${datain[i]['Target qty']}','${datain[i]['Unit']}','${datain[i]['Bsc start']}')`
    }

  }
  query = query + listset;

  console.log(query)

  let db = await mssqlR.qurey(query);

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
    // url: 'http://127.0.0.1:14090/DATAGW/PPI001GET',
    url: 'http://172.23.10.168:14090/DATAGW/PPI001GET',
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

  const axios = require('axios');
  let data = input;

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    // url: 'http://127.0.0.1:14090/DATAGW/PPI005SET',
    url: 'http://172.23.10.168:14090/DATAGW/PPI005SET',
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

  const axios = require('axios');
  let data = input

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    // url: 'http://127.0.0.1:14090/DATAGW/PPI003SET',
    url: 'http://172.23.10.168:14090/DATAGW/PPI003SET',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };

  await axios.request(config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      console.log(response.data);
      output = response.data
    })
    .catch((error) => {
      // console.log(error);
    });


  //-------------------------------------
  res.json(output);
});



module.exports = router;

