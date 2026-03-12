const sql = require('mssql');
const config = {
  user: "sa",
  password: "Parker789",
  database: "",
  // server: '172.101.5.12',
  // server: '172.101.5.6',
  server: '172.23.10.59',
  pool: {
    // max: 10,
    // min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  }
}

exports.qurey = async (input) => {
  try {
    await sql.connect(config)
    let out;
    const result = await sql.query(input).then((v) => {
      out = v;
      return v;
    }).then(() => sql.close())
    return out;
  } catch (err) {
    return err;
  }
};

exports.qureyP = async (queryString, params = {}) => {
  try {
    await sql.connect(config);
    const request = new sql.Request();
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }
    const result = await request.query(queryString);
    await sql.close();
    return result;
  } catch (err) {
    return err;
  }
};


// .then((v) => console.log(v))
//     .then(() => sql.close())
