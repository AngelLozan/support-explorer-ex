//@dev Cors headers need to be modified. CORS - "No 'Access-Control-Allow-Origin' header. Use proxy? 

import axios from 'axios';

const getAlgoData = async (source) => {

let proxy = "";
let api = 'https://algoindexer.algoexplorerapi.io/v2/transactions?txid=';
let tx = source;

  try {
    const response = await axios.get(`${proxy}${api}${tx}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json();
    return true;
  } catch (err) {
    console.log(err);
  }
}

export default getAlgoData;
