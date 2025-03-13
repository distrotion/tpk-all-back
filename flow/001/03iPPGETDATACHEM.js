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

  // let output = datatest01;
  let output = {};

  const axios = require('axios');
  let data = JSON.stringify({
    "datestart": "01.03.2025",
    "dateend": "10.03.2025"
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://127.0.0.1:14090/DATAGW/PPI001GET',
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
    url: 'http://127.0.0.1:14090/DATAGW/PPI005SET',
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
  // let output = {};

  // const axios = require('axios');
  // let data = JSON.stringify({
  
  // });

  // let config = {
  //   method: 'post',
  //   maxBodyLength: Infinity,
  //   url: 'http://127.0.0.1:14090/DATAGW/PPI003SET',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   data: data
  // };

  // await axios.request(config)
  //   .then((response) => {
  //     // console.log(JSON.stringify(response.data));
  //     output = response.data
  //   })
  //   .catch((error) => {
  //     // console.log(error);
  //   });


  //-------------------------------------
  res.json(output);
});



module.exports = router;


let datatest01 = {
  "HEADER_INFO": [
    {
      "PROCESS_ORDER": "1010000024",
      "ORDER_TYPE": "ZC01",
      "ORDER_TYPE_DESC": "Normal Order",
      "PLANT": "1000",
      "MATERIAL": "11002223",
      "MATERIAL_TEXT": "PREPALENE 21TP|25KG",
      "TOTAL_QTY": 1000.0,
      "UOM": "KG",
      "PROD_SUP": "C11",
      "PROD_SUP_DESC": "Powder",
      "BASIC_START_DATE": "06.03.2025",
      "BASIC_FINISH_DATE": "06.03.2025",
      "ORDER_SEQ_NO": 0,
      "BATCH": "2503065",
      "STGE_LOC": "4211",
      "INSP_LOT": 0,
      "SYSTEM_STATUS": "REL  PRC  BASC BCRQ GMPS MACM SETC",
      "OLD_MATERIAL": "PL-21TP|BAG 25 KG",
      "MTART": "ZCFG",
      "MTBEZ": "TP-C Finished Goods",
      "LINK_PROC_ORDER": "Manual Create"
    },
    {
      "PROCESS_ORDER": "1010000023",
      "ORDER_TYPE": "ZC01",
      "ORDER_TYPE_DESC": "Normal Order",
      "PLANT": "1000",
      "MATERIAL": "12001028",
      "MATERIAL_TEXT": "PL-21TP|SM",
      "TOTAL_QTY": 1000.0,
      "UOM": "KG",
      "PROD_SUP": "C11",
      "PROD_SUP_DESC": "Powder",
      "BASIC_START_DATE": "06.03.2025",
      "BASIC_FINISH_DATE": "06.03.2025",
      "ORDER_SEQ_NO": 0,
      "BATCH": "2503065",
      "STGE_LOC": "C402",
      "INSP_LOT": 30000000012,
      "SYSTEM_STATUS": "REL  PRC  BASC BCRQ GMPS ILAS MACM SETC",
      "OLD_MATERIAL": "PL-21TP|SM",
      "MTART": "ZCSM",
      "MTBEZ": "TP-C Semi-Finished Goods",
      "LINK_PROC_ORDER": ""
    },
    {
      "PROCESS_ORDER": "1010000025",
      "ORDER_TYPE": "ZC01",
      "ORDER_TYPE_DESC": "Normal Order",
      "PLANT": "1000",
      "MATERIAL": "12000952",
      "MATERIAL_TEXT": "NOX 307-TP|SM",
      "TOTAL_QTY": 3950.0,
      "UOM": "KG",
      "PROD_SUP": "C13",
      "PROD_SUP_DESC": "Nox Rust Oil",
      "BASIC_START_DATE": "06.03.2025",
      "BASIC_FINISH_DATE": "06.03.2025",
      "ORDER_SEQ_NO": 0,
      "BATCH": "2503061",
      "STGE_LOC": "C404",
      "INSP_LOT": 30000000013,
      "SYSTEM_STATUS": "REL  PRC  BASC BCRQ GMPS ILAS MACM SETC",
      "OLD_MATERIAL": "NOX 307-TP|SM 1%",
      "MTART": "ZCSM",
      "MTBEZ": "TP-C Semi-Finished Goods",
      "LINK_PROC_ORDER": ""
    },
    {
      "PROCESS_ORDER": "1010000030",
      "ORDER_TYPE": "ZC01",
      "ORDER_TYPE_DESC": "Normal Order",
      "PLANT": "1000",
      "MATERIAL": "12000305",
      "MATERIAL_TEXT": "FR-165TSV-2|(SM)",
      "TOTAL_QTY": 10000.0,
      "UOM": "KG",
      "PROD_SUP": "C15",
      "PROD_SUP_DESC": "Rolling Oil",
      "BASIC_START_DATE": "06.03.2025",
      "BASIC_FINISH_DATE": "06.03.2025",
      "ORDER_SEQ_NO": 0,
      "BATCH": "2503061",
      "STGE_LOC": "C404",
      "INSP_LOT": 30000000015,
      "SYSTEM_STATUS": "REL  PRC  BASC BCRQ GMPS ILAS MACM SETC",
      "OLD_MATERIAL": "FR-165TSV-2|(SM)",
      "MTART": "ZCSM",
      "MTBEZ": "TP-C Semi-Finished Goods",
      "LINK_PROC_ORDER": ""
    }
  ],
  "COMPONENT_INFO": [
    {
      "PROCESS_ORDER": "1010000023",
      "ITEM": "10",
      "MATERIAL": "13000193",
      "MATERIAL_TEXT": "TL5",
      "REQ_QTY": 900.0,
      "UOM": "KG",
      "ITEM_CATE": "L",
      "NO_OF_BATCH": "1",
      "BATCH": "241121A",
      "BATCH_QTY": 900.0,
      "BATCH_UOM": "KG",
      "STGE_LOC": "4110",
      "MVT_TYPE": "261",
      "OPERATION": "0010"
    },
    {
      "PROCESS_ORDER": "1010000023",
      "ITEM": "20",
      "MATERIAL": "13000202",
      "MATERIAL_TEXT": "TL7|BASF",
      "REQ_QTY": 100.0,
      "UOM": "KG",
      "ITEM_CATE": "L",
      "NO_OF_BATCH": "1",
      "BATCH": "240821A",
      "BATCH_QTY": 100.0,
      "BATCH_UOM": "KG",
      "STGE_LOC": "4600",
      "MVT_TYPE": "261",
      "OPERATION": "0010"
    },
    {
      "PROCESS_ORDER": "1010000024",
      "ITEM": "10",
      "MATERIAL": "12001028",
      "MATERIAL_TEXT": "PL-21TP|SM",
      "REQ_QTY": 1000.0,
      "UOM": "KG",
      "ITEM_CATE": "L",
      "NO_OF_BATCH": "1",
      "BATCH": "",
      "BATCH_QTY": 0,
      "BATCH_UOM": "",
      "STGE_LOC": "",
      "MVT_TYPE": "261",
      "OPERATION": "0020"
    },
    {
      "PROCESS_ORDER": "1010000024",
      "ITEM": "20",
      "MATERIAL": "92000013",
      "MATERIAL_TEXT": "PAPER BAG BLANK 25 KG",
      "REQ_QTY": 40.0,
      "UOM": "BAG",
      "ITEM_CATE": "L",
      "NO_OF_BATCH": "1",
      "BATCH": "241125A",
      "BATCH_QTY": 40.0,
      "BATCH_UOM": "BAG",
      "STGE_LOC": "4500",
      "MVT_TYPE": "261",
      "OPERATION": "0010"
    },
    {
      "PROCESS_ORDER": "1010000025",
      "ITEM": "10",
      "MATERIAL": "13000109",
      "MATERIAL_TEXT": "RM30S",
      "REQ_QTY": 300.2,
      "UOM": "KG",
      "ITEM_CATE": "L",
      "NO_OF_BATCH": "1",
      "BATCH": "241126A",
      "BATCH_QTY": 300.2,
      "BATCH_UOM": "KG",
      "STGE_LOC": "4110",
      "MVT_TYPE": "261",
      "OPERATION": "0010"
    },
    {
      "PROCESS_ORDER": "1010000025",
      "ITEM": "20",
      "MATERIAL": "13000103",
      "MATERIAL_TEXT": "RM16E",
      "REQ_QTY": 790.0,
      "UOM": "KG",
      "ITEM_CATE": "L",
      "NO_OF_BATCH": "1",
      "BATCH": "241206A",
      "BATCH_QTY": 790.0,
      "BATCH_UOM": "KG",
      "STGE_LOC": "4800",
      "MVT_TYPE": "261",
      "OPERATION": "0010"
    },
    {
      "PROCESS_ORDER": "1010000025",
      "ITEM": "30",
      "MATERIAL": "13000103",
      "MATERIAL_TEXT": "RM16E",
      "REQ_QTY": 2715.625,
      "UOM": "KG",
      "ITEM_CATE": "L",
      "NO_OF_BATCH": "1",
      "BATCH": "241206A",
      "BATCH_QTY": 2715.63,
      "BATCH_UOM": "KG",
      "STGE_LOC": "4800",
      "MVT_TYPE": "261",
      "OPERATION": "0010"
    },
    {
      "PROCESS_ORDER": "1010000025",
      "ITEM": "40",
      "MATERIAL": "13000515",
      "MATERIAL_TEXT": "RM56A",
      "REQ_QTY": 33.575,
      "UOM": "KG",
      "ITEM_CATE": "L",
      "NO_OF_BATCH": "1",
      "BATCH": "241016A",
      "BATCH_QTY": 6.0,
      "BATCH_UOM": "KG",
      "STGE_LOC": "4110",
      "MVT_TYPE": "261",
      "OPERATION": "0010"
    },
    {
      "PROCESS_ORDER": "1010000025",
      "ITEM": "50",
      "MATERIAL": "13000344",
      "MATERIAL_TEXT": "TV14",
      "REQ_QTY": 110.6,
      "UOM": "KG",
      "ITEM_CATE": "L",
      "NO_OF_BATCH": "1",
      "BATCH": "241105A",
      "BATCH_QTY": 110.6,
      "BATCH_UOM": "KG",
      "STGE_LOC": "4110",
      "MVT_TYPE": "261",
      "OPERATION": "0010"
    },
    {
      "PROCESS_ORDER": "1010000030",
      "ITEM": "10",
      "MATERIAL": "13000367",
      "MATERIAL_TEXT": "TW215S",
      "REQ_QTY": 5240.0,
      "UOM": "KG",
      "ITEM_CATE": "L",
      "NO_OF_BATCH": "1",
      "BATCH": "241202A",
      "BATCH_QTY": 5240.0,
      "BATCH_UOM": "KG",
      "STGE_LOC": "4800",
      "MVT_TYPE": "261",
      "OPERATION": "0010"
    },
    {
      "PROCESS_ORDER": "1010000030",
      "ITEM": "100",
      "MATERIAL": "13000335",
      "MATERIAL_TEXT": "TT20C",
      "REQ_QTY": 50.0,
      "UOM": "KG",
      "ITEM_CATE": "L",
      "NO_OF_BATCH": "1",
      "BATCH": "241101A",
      "BATCH_QTY": 50.0,
      "BATCH_UOM": "KG",
      "STGE_LOC": "4110",
      "MVT_TYPE": "261",
      "OPERATION": "0010"
    },
    {
      "PROCESS_ORDER": "1010000030",
      "ITEM": "20",
      "MATERIAL": "13000268",
      "MATERIAL_TEXT": "TR77",
      "REQ_QTY": 100.0,
      "UOM": "KG",
      "ITEM_CATE": "L",
      "NO_OF_BATCH": "1",
      "BATCH": "240919A",
      "BATCH_QTY": 100.0,
      "BATCH_UOM": "KG",
      "STGE_LOC": "4110",
      "MVT_TYPE": "261",
      "OPERATION": "0010"
    },
    {
      "PROCESS_ORDER": "1010000030",
      "ITEM": "30",
      "MATERIAL": "13000334",
      "MATERIAL_TEXT": "TT165S",
      "REQ_QTY": 1000.0,
      "UOM": "KG",
      "ITEM_CATE": "L",
      "NO_OF_BATCH": "1",
      "BATCH": "241101A",
      "BATCH_QTY": 789.679,
      "BATCH_UOM": "KG",
      "STGE_LOC": "4800",
      "MVT_TYPE": "261",
      "OPERATION": "0010"
    },
    {
      "PROCESS_ORDER": "1010000030",
      "ITEM": "30",
      "MATERIAL": "13000334",
      "MATERIAL_TEXT": "TT165S",
      "REQ_QTY": 1000.0,
      "UOM": "KG",
      "ITEM_CATE": "L",
      "NO_OF_BATCH": "2",
      "BATCH": "241126A",
      "BATCH_QTY": 210.321,
      "BATCH_UOM": "KG",
      "STGE_LOC": "4800",
      "MVT_TYPE": "261",
      "OPERATION": "0010"
    },
    {
      "PROCESS_ORDER": "1010000030",
      "ITEM": "40",
      "MATERIAL": "13000622",
      "MATERIAL_TEXT": "TW190PA",
      "REQ_QTY": 3150.0,
      "UOM": "KG",
      "ITEM_CATE": "L",
      "NO_OF_BATCH": "1",
      "BATCH": "241118A",
      "BATCH_QTY": 3150.0,
      "BATCH_UOM": "KG",
      "STGE_LOC": "4800",
      "MVT_TYPE": "261",
      "OPERATION": "0010"
    },
    {
      "PROCESS_ORDER": "1010000030",
      "ITEM": "50",
      "MATERIAL": "13000360",
      "MATERIAL_TEXT": "TW6",
      "REQ_QTY": 100.0,
      "UOM": "KG",
      "ITEM_CATE": "L",
      "NO_OF_BATCH": "1",
      "BATCH": "",
      "BATCH_QTY": 0,
      "BATCH_UOM": "",
      "STGE_LOC": "",
      "MVT_TYPE": "261",
      "OPERATION": "0010"
    },
    {
      "PROCESS_ORDER": "1010000030",
      "ITEM": "60",
      "MATERIAL": "13000253",
      "MATERIAL_TEXT": "TR198",
      "REQ_QTY": 10.0,
      "UOM": "KG",
      "ITEM_CATE": "L",
      "NO_OF_BATCH": "1",
      "BATCH": "",
      "BATCH_QTY": 0,
      "BATCH_UOM": "",
      "STGE_LOC": "",
      "MVT_TYPE": "261",
      "OPERATION": "0010"
    },
    {
      "PROCESS_ORDER": "1010000030",
      "ITEM": "70",
      "MATERIAL": "13000097",
      "MATERIAL_TEXT": "RM145A",
      "REQ_QTY": 200.0,
      "UOM": "KG",
      "ITEM_CATE": "L",
      "NO_OF_BATCH": "1",
      "BATCH": "241008A",
      "BATCH_QTY": 160.0,
      "BATCH_UOM": "KG",
      "STGE_LOC": "4110",
      "MVT_TYPE": "261",
      "OPERATION": "0010"
    },
    {
      "PROCESS_ORDER": "1010000030",
      "ITEM": "70",
      "MATERIAL": "13000097",
      "MATERIAL_TEXT": "RM145A",
      "REQ_QTY": 200.0,
      "UOM": "KG",
      "ITEM_CATE": "L",
      "NO_OF_BATCH": "2",
      "BATCH": "241101A",
      "BATCH_QTY": 40.0,
      "BATCH_UOM": "KG",
      "STGE_LOC": "4110",
      "MVT_TYPE": "261",
      "OPERATION": "0010"
    },
    {
      "PROCESS_ORDER": "1010000030",
      "ITEM": "80",
      "MATERIAL": "13000337",
      "MATERIAL_TEXT": "TT22T",
      "REQ_QTY": 100.0,
      "UOM": "KG",
      "ITEM_CATE": "L",
      "NO_OF_BATCH": "1",
      "BATCH": "",
      "BATCH_QTY": 0,
      "BATCH_UOM": "",
      "STGE_LOC": "",
      "MVT_TYPE": "261",
      "OPERATION": "0010"
    },
    {
      "PROCESS_ORDER": "1010000030",
      "ITEM": "90",
      "MATERIAL": "13000336",
      "MATERIAL_TEXT": "TT21U",
      "REQ_QTY": 50.0,
      "UOM": "KG",
      "ITEM_CATE": "L",
      "NO_OF_BATCH": "1",
      "BATCH": "241101A",
      "BATCH_QTY": 50.0,
      "BATCH_UOM": "KG",
      "STGE_LOC": "4110",
      "MVT_TYPE": "261",
      "OPERATION": "0010"
    }
  ],
  "PHASE_INFO": [
    {
      "PROCESS_ORDER": "1010000024",
      "TASK_LIST_TYPE": "2",
      "TASK_LIST_GROUP": "50000944",
      "GROUP_COUNTER": 1,
      "OPERATION": "0010",
      "SUP_OPER": "",
      "CTRL_KEY": "ZP01",
      "PLANT": "1000",
      "OPER_DESC": "Packing",
      "QUANTITY": 1000.0,
      "UNIT": "KG",
      "RESOURCE": "C2PM03",
      "RESOURCE_DESC": "Ribbon Powder Mixer 03",
      "STD_VALUE_KEY": "Z001",
      "STD_VALUE_1": 0,
      "ACT_TYPE_1": "",
      "ACT_UNIT_1": "",
      "STD_VALUE_2": 0,
      "ACT_TYPE_2": "",
      "ACT_UNIT_2": "",
      "STD_VALUE_3": 0,
      "ACT_TYPE_3": "",
      "ACT_UNIT_3": "",
      "STD_VALUE_4": 0,
      "ACT_TYPE_4": "",
      "ACT_UNIT_4": "",
      "STD_VALUE_5": 0,
      "ACT_TYPE_5": "",
      "ACT_UNIT_5": "",
      "STD_VALUE_6": 0,
      "ACT_TYPE_6": "",
      "ACT_UNIT_6": ""
    },
    {
      "PROCESS_ORDER": "1010000024",
      "TASK_LIST_TYPE": "2",
      "TASK_LIST_GROUP": "50000944",
      "GROUP_COUNTER": 2,
      "OPERATION": "0020",
      "SUP_OPER": "0010",
      "CTRL_KEY": "ZP01",
      "PLANT": "1000",
      "OPER_DESC": "PAPER BAG BLANK (25KG)",
      "QUANTITY": 1000.0,
      "UNIT": "KG",
      "RESOURCE": "C2PM03",
      "RESOURCE_DESC": "Ribbon Powder Mixer 03",
      "STD_VALUE_KEY": "Z001",
      "STD_VALUE_1": 0,
      "ACT_TYPE_1": "PP1002",
      "ACT_UNIT_1": "STD",
      "STD_VALUE_2": 0,
      "ACT_TYPE_2": "PP1001",
      "ACT_UNIT_2": "STD",
      "STD_VALUE_3": 0,
      "ACT_TYPE_3": "PP1003",
      "ACT_UNIT_3": "STD",
      "STD_VALUE_4": 0.67,
      "ACT_TYPE_4": "PP1004",
      "ACT_UNIT_4": "STD",
      "STD_VALUE_5": 0,
      "ACT_TYPE_5": "",
      "ACT_UNIT_5": "",
      "STD_VALUE_6": 0,
      "ACT_TYPE_6": "",
      "ACT_UNIT_6": ""
    },
    {
      "PROCESS_ORDER": "1010000023",
      "TASK_LIST_TYPE": "2",
      "TASK_LIST_GROUP": "50000943",
      "GROUP_COUNTER": 1,
      "OPERATION": "0010",
      "SUP_OPER": "",
      "CTRL_KEY": "ZP04",
      "PLANT": "1000",
      "OPER_DESC": "Mixing",
      "QUANTITY": 1000.0,
      "UNIT": "KG",
      "RESOURCE": "C2PM03",
      "RESOURCE_DESC": "Ribbon Powder Mixer 03",
      "STD_VALUE_KEY": "Z001",
      "STD_VALUE_1": 0,
      "ACT_TYPE_1": "",
      "ACT_UNIT_1": "",
      "STD_VALUE_2": 0,
      "ACT_TYPE_2": "",
      "ACT_UNIT_2": "",
      "STD_VALUE_3": 0,
      "ACT_TYPE_3": "",
      "ACT_UNIT_3": "",
      "STD_VALUE_4": 0,
      "ACT_TYPE_4": "",
      "ACT_UNIT_4": "",
      "STD_VALUE_5": 0,
      "ACT_TYPE_5": "",
      "ACT_UNIT_5": "",
      "STD_VALUE_6": 0,
      "ACT_TYPE_6": "",
      "ACT_UNIT_6": ""
    },
    {
      "PROCESS_ORDER": "1010000023",
      "TASK_LIST_TYPE": "2",
      "TASK_LIST_GROUP": "50000943",
      "GROUP_COUNTER": 2,
      "OPERATION": "0020",
      "SUP_OPER": "0010",
      "CTRL_KEY": "ZP04",
      "PLANT": "1000",
      "OPER_DESC": "Mixing",
      "QUANTITY": 1000.0,
      "UNIT": "KG",
      "RESOURCE": "C2PM03",
      "RESOURCE_DESC": "Ribbon Powder Mixer 03",
      "STD_VALUE_KEY": "Z001",
      "STD_VALUE_1": 1.0,
      "ACT_TYPE_1": "PP1002",
      "ACT_UNIT_1": "STD",
      "STD_VALUE_2": 1.0,
      "ACT_TYPE_2": "PP1001",
      "ACT_UNIT_2": "STD",
      "STD_VALUE_3": 1.0,
      "ACT_TYPE_3": "PP1003",
      "ACT_UNIT_3": "STD",
      "STD_VALUE_4": 0,
      "ACT_TYPE_4": "",
      "ACT_UNIT_4": "STD",
      "STD_VALUE_5": 0,
      "ACT_TYPE_5": "",
      "ACT_UNIT_5": "",
      "STD_VALUE_6": 0,
      "ACT_TYPE_6": "",
      "ACT_UNIT_6": ""
    },
    {
      "PROCESS_ORDER": "1010000025",
      "TASK_LIST_TYPE": "2",
      "TASK_LIST_GROUP": "50000853",
      "GROUP_COUNTER": 1,
      "OPERATION": "0010",
      "SUP_OPER": "",
      "CTRL_KEY": "ZP04",
      "PLANT": "1000",
      "OPER_DESC": "Mixing",
      "QUANTITY": 3950.0,
      "UNIT": "KG",
      "RESOURCE": "C4RT44",
      "RESOURCE_DESC": "Reaction Tank 44",
      "STD_VALUE_KEY": "Z001",
      "STD_VALUE_1": 0,
      "ACT_TYPE_1": "",
      "ACT_UNIT_1": "",
      "STD_VALUE_2": 0,
      "ACT_TYPE_2": "",
      "ACT_UNIT_2": "",
      "STD_VALUE_3": 0,
      "ACT_TYPE_3": "",
      "ACT_UNIT_3": "",
      "STD_VALUE_4": 0,
      "ACT_TYPE_4": "",
      "ACT_UNIT_4": "",
      "STD_VALUE_5": 0,
      "ACT_TYPE_5": "",
      "ACT_UNIT_5": "",
      "STD_VALUE_6": 0,
      "ACT_TYPE_6": "",
      "ACT_UNIT_6": ""
    },
    {
      "PROCESS_ORDER": "1010000025",
      "TASK_LIST_TYPE": "2",
      "TASK_LIST_GROUP": "50000853",
      "GROUP_COUNTER": 2,
      "OPERATION": "0020",
      "SUP_OPER": "0010",
      "CTRL_KEY": "ZP04",
      "PLANT": "1000",
      "OPER_DESC": "Mixing",
      "QUANTITY": 3950.0,
      "UNIT": "KG",
      "RESOURCE": "C4RT44",
      "RESOURCE_DESC": "Reaction Tank 44",
      "STD_VALUE_KEY": "Z001",
      "STD_VALUE_1": 3.0,
      "ACT_TYPE_1": "PP1002",
      "ACT_UNIT_1": "STD",
      "STD_VALUE_2": 3.0,
      "ACT_TYPE_2": "PP1001",
      "ACT_UNIT_2": "STD",
      "STD_VALUE_3": 3.0,
      "ACT_TYPE_3": "PP1003",
      "ACT_UNIT_3": "STD",
      "STD_VALUE_4": 0,
      "ACT_TYPE_4": "",
      "ACT_UNIT_4": "STD",
      "STD_VALUE_5": 0,
      "ACT_TYPE_5": "",
      "ACT_UNIT_5": "",
      "STD_VALUE_6": 0,
      "ACT_TYPE_6": "",
      "ACT_UNIT_6": ""
    },
    {
      "PROCESS_ORDER": "1010000030",
      "TASK_LIST_TYPE": "2",
      "TASK_LIST_GROUP": "50000137",
      "GROUP_COUNTER": 1,
      "OPERATION": "0010",
      "SUP_OPER": "",
      "CTRL_KEY": "ZP04",
      "PLANT": "1000",
      "OPER_DESC": "Mixing",
      "QUANTITY": 10000.0,
      "UNIT": "KG",
      "RESOURCE": "C4RT46",
      "RESOURCE_DESC": "Reaction Tank 46",
      "STD_VALUE_KEY": "Z001",
      "STD_VALUE_1": 0,
      "ACT_TYPE_1": "",
      "ACT_UNIT_1": "",
      "STD_VALUE_2": 0,
      "ACT_TYPE_2": "",
      "ACT_UNIT_2": "",
      "STD_VALUE_3": 0,
      "ACT_TYPE_3": "",
      "ACT_UNIT_3": "",
      "STD_VALUE_4": 0,
      "ACT_TYPE_4": "",
      "ACT_UNIT_4": "",
      "STD_VALUE_5": 0,
      "ACT_TYPE_5": "",
      "ACT_UNIT_5": "",
      "STD_VALUE_6": 0,
      "ACT_TYPE_6": "",
      "ACT_UNIT_6": ""
    },
    {
      "PROCESS_ORDER": "1010000030",
      "TASK_LIST_TYPE": "2",
      "TASK_LIST_GROUP": "50000137",
      "GROUP_COUNTER": 2,
      "OPERATION": "0020",
      "SUP_OPER": "0010",
      "CTRL_KEY": "ZP04",
      "PLANT": "1000",
      "OPER_DESC": "Mixing",
      "QUANTITY": 10000.0,
      "UNIT": "KG",
      "RESOURCE": "C4RT46",
      "RESOURCE_DESC": "Reaction Tank 46",
      "STD_VALUE_KEY": "Z001",
      "STD_VALUE_1": 5.1,
      "ACT_TYPE_1": "PP1002",
      "ACT_UNIT_1": "STD",
      "STD_VALUE_2": 5.1,
      "ACT_TYPE_2": "PP1001",
      "ACT_UNIT_2": "STD",
      "STD_VALUE_3": 5.1,
      "ACT_TYPE_3": "PP1003",
      "ACT_UNIT_3": "STD",
      "STD_VALUE_4": 0,
      "ACT_TYPE_4": "",
      "ACT_UNIT_4": "STD",
      "STD_VALUE_5": 0,
      "ACT_TYPE_5": "",
      "ACT_UNIT_5": "",
      "STD_VALUE_6": 0,
      "ACT_TYPE_6": "",
      "ACT_UNIT_6": ""
    }
  ],
  "GR_PROC_INFO": [],
  "TYPE": "",
  "MESSAGE": ""
};
