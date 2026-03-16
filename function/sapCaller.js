const axios = require('axios');
const fs    = require('fs');
const path  = require('path');

const SAP_BASE_URL  = 'http://172.23.10.168:14090/DATAGW';
const SAP_LOG_BASE  = path.join(__dirname, '..', 'logs', 'sap');

const CSV_HEADER = 'datetime,api,duration_ms,input,return_type,return_message,status,error\n';

// API ที่ไม่ต้อง log
const NO_LOG_APIS = new Set(['PPI002GET', 'QMI002GET']);

// cache folder สร้างแล้ว เพื่อไม่ต้อง existsSync ทุกครั้ง
const createdDirs = new Set();

function ensureDir(dir) {
  if (!createdDirs.has(dir)) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    createdDirs.add(dir);
  }
}

function csvEsc(val) {
  const s = String(val ?? '');
  return (s.includes(',') || s.includes('"') || s.includes('\n'))
    ? '"' + s.replace(/"/g, '""') + '"'
    : s;
}

function writeLog(apiName, durationMs, input, returnType, returnMessage, status, errMsg = '') {
  try {
    const now      = new Date();
    const dateStr  = now.toISOString().slice(0, 10);
    const datetime = now.toISOString().replace('T', ' ').slice(0, 23);
    // folder แยกตาม API name: logs/sap/PPI002GET/2026-03-13.csv
    const apiDir   = path.join(SAP_LOG_BASE, apiName);
    ensureDir(apiDir);
    const filePath = path.join(apiDir, `${dateStr}.csv`);
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, CSV_HEADER, 'utf8');
    const inputStr = typeof input === 'object' ? JSON.stringify(input) : String(input ?? '');
    const line = [
      csvEsc(datetime), csvEsc(apiName),       csvEsc(durationMs),
      csvEsc(inputStr), csvEsc(returnType), csvEsc(returnMessage), csvEsc(status), csvEsc(errMsg),
    ].join(',') + '\n';
    fs.appendFileSync(filePath, line, 'utf8');
  } catch (e) {
    console.error('sapCaller writeLog error:', e.message);
  }
}

/**
 * POST ไปที่ SAP DATAGW แล้ว log ทุก call → logs/sap/APINAME/YYYY-MM-DD.csv
 * @param {string} apiName  เช่น 'PPI002GET', 'QMI003SET'
 * @param {object} data     request body
 * @returns {object|null}   response.data หรือ null ถ้า error
 */
async function callSAPAPI(apiName, data) {
  const t0 = Date.now();
  try {
    const res = await axios.request({
      method: 'post',
      maxBodyLength: Infinity,
      url: `${SAP_BASE_URL}/${apiName}`,
      headers: { 'Content-Type': 'application/json' },
      data,
    });
    const d = res.data;
    let retType = '', retMsg = '';
    if (d?.['T_RETURN']?.[0]) {
      retType = d['T_RETURN'][0]['TYPE']    ?? '';
      retMsg  = d['T_RETURN'][0]['MESSAGE'] ?? '';
    } else if (Array.isArray(d?.['HEADER_INFO'])) {
      retType = `HEADER_INFO:${d['HEADER_INFO'].length}`;
    } else if (Array.isArray(d?.['ET_INSPCHAR'])) {
      retType = `ET_INSPCHAR:${d['ET_INSPCHAR'].length}`;
    }
    if (!NO_LOG_APIS.has(apiName)) writeLog(apiName, Date.now() - t0, data, retType, retMsg, 'OK');
    return d;
  } catch (err) {
    if (!NO_LOG_APIS.has(apiName)) writeLog(apiName, Date.now() - t0, data, '', '', 'ERROR', err.message);
    console.log(`${apiName} error:`, err.message);
    return null;
  }
}

module.exports = { callSAPAPI };
