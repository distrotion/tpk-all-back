const { MongoClient } = require('mongodb');
const logger = require('./dbLogger');

const DEFAULT_URL = 'mongodb://172.23.10.73:27017';

const MONGO_OPTS = {
  maxPoolSize: 10,   // parallel connections รองรับ Promise.all()
  minPoolSize: 2,    // keep warm
  serverSelectionTimeoutMS: 5000,
};

// Cache client ต่อ URL — สร้างครั้งเดียว ใช้ซ้ำ (ไม่ connect/close ทุกครั้ง)
const clientCache = new Map();

async function getClient(url = DEFAULT_URL) {
  if (!clientCache.has(url)) {
    const client = new MongoClient(url, MONGO_OPTS);
    await client.connect();
    client.on('error', err => {
      console.log('MongoDB client error:', url, err.message);
      clientCache.delete(url); // reset เพื่อ reconnect ครั้งต่อไป
    });
    clientCache.set(url, client);
  }
  return clientCache.get(url);
}

// ─── helpers ────────────────────────────────────────────────────────────────

function col(client, db, collection) {
  return client.db(db).collection(collection);
}

// ─── exports ─────────────────────────────────────────────────────────────────

exports.insertMany = async (db_input, collection_input, input) => {
  const t0 = Date.now();
  try {
    const client = await getClient();
    const res    = await col(client, db_input, collection_input).insertMany(input);
    logger.writeLog(DEFAULT_URL, 'insertMany', `INSERT ${db_input}.${collection_input}`, Date.now() - t0, input.length, 'OK');
    return res;
  } catch (err) {
    logger.writeLog(DEFAULT_URL, 'insertMany', `INSERT ${db_input}.${collection_input}`, Date.now() - t0, null, 'ERROR', err.message);
    console.log('insertMany error:', err.message);
    clientCache.delete(DEFAULT_URL);
    return err;
  }
};

exports.find = async (db_input, collection_input, input) => {
  try {
    const client = await getClient();
    return await col(client, db_input, collection_input)
      .find(input).limit(1000).sort({ "_id": -1 }).toArray();
  } catch (err) {
    console.log('find error:', err.message);
    clientCache.delete(DEFAULT_URL);
    return [];
  }
};

exports.findsome = async (db_input, collection_input, input) => {
  try {
    const client = await getClient();
    return await col(client, db_input, collection_input)
      .find(input).limit(500).sort({ "_id": -1 })
      .project({ "PO": 1, "CP": 1, "ALL_DONE": 1 }).toArray();
  } catch (err) {
    console.log('findsome error:', err.message);
    clientCache.delete(DEFAULT_URL);
    return [];
  }
};

exports.update = async (db_input, collection_input, input1, input2) => {
  const t0 = Date.now();
  try {
    const client = await getClient();
    const res    = await col(client, db_input, collection_input).updateOne(input1, input2);
    logger.writeLog(DEFAULT_URL, 'update', `UPDATE ${db_input}.${collection_input}`, Date.now() - t0, res.modifiedCount, 'OK');
    return res;
  } catch (err) {
    logger.writeLog(DEFAULT_URL, 'update', `UPDATE ${db_input}.${collection_input}`, Date.now() - t0, null, 'ERROR', err.message);
    console.log('update error:', err.message);
    clientCache.delete(DEFAULT_URL);
    return err;
  }
};

exports.findSAP = async (urls, db_input, collection_input, input) => {
  try {
    const client = await getClient(urls);
    return await col(client, db_input, collection_input)
      .find(input).limit(1000).sort({ "_id": -1 }).toArray();
  } catch (err) {
    console.log('findSAP error:', err.message);
    clientCache.delete(urls);
    return [];
  }
};

exports.findURL = async (urls, db_input, collection_input, input) => {
  try {
    const client = await getClient(urls);
    return await col(client, db_input, collection_input)
      .find(input).sort({ "_id": -1 }).toArray();
  } catch (err) {
    console.log('findURL error:', err.message);
    clientCache.delete(urls);
    return [];
  }
};
