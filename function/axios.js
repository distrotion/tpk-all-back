const axios = require('axios');

// instance พร้อม timeout default 30s
const instance = axios.create({
  timeout: 30000,
});

exports.post = async (url, body) => {
  try {
    const res = await instance.post(url, body);
    return res.data;
  } catch (err) {
    const status = err.response?.status ?? err.code ?? err.message;
    console.error('axios.post error:', url, status);
    return status;
  }
};

exports.get = async (url) => {
  try {
    const res = await instance.get(url);
    return res.data;
  } catch (err) {
    const status = err.response?.status ?? err.code ?? err.message;
    console.error('axios.get error:', url, status);
    return status;
  }
};
