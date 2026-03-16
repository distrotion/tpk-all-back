const sql    = require('mssql');
const logger = require('./dbLogger');

const SERVER = '172.23.10.59';

const config = {
  user: "sa",
  password: "Parker789",
  database: "",
  server: SERVER,
  pool: {
    max: 10,              // parallel connections รองรับ Promise.all()
    min: 2,               // keep warm — ไม่ต้องรอ reconnect
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
  }
};

// Pool สร้าง 1 ครั้ง ใช้ซ้ำทุก query (ไม่ connect/close ทุกครั้ง)
let pool = null;

async function getPool() {
  if (!pool) {
    pool = new sql.ConnectionPool(config);
    await pool.connect();
    pool.on('error', err => {
      console.log('mssql Pool error:', err);
      pool = null; // reset เพื่อ reconnect ครั้งต่อไป
    });
  }
  return pool;
}

const MAX_RETRY   = 5;   // จำนวนครั้งที่ retry สูงสุด
const RETRY_DELAY = 2000; // หน่วง ms ระหว่าง retry

const isInsert = (q) => /^\s*INSERT\s/i.test(q);
const sleep    = (ms) => new Promise(r => setTimeout(r, ms));

// ────────────────────────────────────────────────
// qurey — query ธรรมดา (INSERT จะ retry อัตโนมัติ)
// ────────────────────────────────────────────────
exports.qurey = async (input) => {
  const retries = isInsert(input) ? MAX_RETRY : 1;
  let lastErr;

  for (let attempt = 1; attempt <= retries; attempt++) {
    const t0 = Date.now();
    try {
      const p      = await getPool();
      const result = await p.request().query(input);
      const rows   = result.recordset?.length ?? 0;
      logger.writeLog(SERVER, 'qurey', input, Date.now() - t0, rows, 'OK');
      return result;
    } catch (err) {
      lastErr = err;
      pool    = null; // reset pool เพื่อให้ reconnect รอบหน้า
      logger.writeLog(SERVER, 'qurey', input, Date.now() - t0, null,
        attempt < retries ? `RETRY(${attempt})` : 'ERROR', err.message);
      console.log(`qurey error (attempt ${attempt}/${retries}):`, err.message);
      if (attempt < retries) await sleep(RETRY_DELAY * attempt);
    }
  }
  return lastErr;
};

// ────────────────────────────────────────────────
// qureyP — parameterised query (INSERT จะ retry อัตโนมัติ)
// ────────────────────────────────────────────────
exports.qureyP = async (queryString, params = {}) => {
  const retries = isInsert(queryString) ? MAX_RETRY : 1;
  let lastErr;

  for (let attempt = 1; attempt <= retries; attempt++) {
    const t0 = Date.now();
    try {
      const p       = await getPool();
      const request = p.request();
      for (const [key, value] of Object.entries(params)) {
        request.input(key, value);
      }
      const result = await request.query(queryString);
      const rows   = result.recordset?.length ?? 0;
      logger.writeLog(SERVER, 'qureyP', queryString, Date.now() - t0, rows, 'OK');
      return result;
    } catch (err) {
      lastErr = err;
      pool    = null;
      logger.writeLog(SERVER, 'qureyP', queryString, Date.now() - t0, null,
        attempt < retries ? `RETRY(${attempt})` : 'ERROR', err.message);
      console.log(`qureyP error (attempt ${attempt}/${retries}):`, err.message);
      if (attempt < retries) await sleep(RETRY_DELAY * attempt);
    }
  }
  return lastErr;
};
