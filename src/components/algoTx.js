//@dev Cors headers need to be modified. CORS - "No 'Access-Control-Allow-Origin' header. Use proxy? 

import axios from 'axios';

const getAlgoData = async (source) => {

let api = 'https://algoindexer.algoexplorerapi.io/v2/transactions?txid=';
let tx = source;

  try {
    const response = await axios.get(`${api}${tx}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });

    if (response.status === 200) {
      console.log("status: ", response.status)
      return true;
    } else {
      throw new Error(`Error! status: ${response.status}`);
    }
    // const result = await response.json();
    // return true;
  } catch (err) {
    console.log(err);
  }
}

export default getAlgoData;

