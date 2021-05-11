const axios = require('axios')

async function getDataFromApi (url) {
      return await axios.get(url)
        .then(({ data }) => {
            return data;
        });
};

async function  postDataFromApi (url,data) {
  return  await axios.post(url,data)
    .then(({ data }) =>{
        return data;
    });
};

async function  putDataFromApi (url,data) {
  return  await axios.put(url,data)
    .then(({ data }) =>{
        return data;
    });
};
async function  deleteDataFromApi (url) {
  return await axios.delete(url)
    .then(({ data }) =>{
        return data;
    });
};


module.exports = {
  getDataFromApi,
  postDataFromApi,
  putDataFromApi,
  deleteDataFromApi
}