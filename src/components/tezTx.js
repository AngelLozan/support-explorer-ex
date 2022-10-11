//@dev If transaction, then true and tab opened. Working, but not neccessary in my opinion
//@dev (for accounts) api = "https://api.tzstats.com/explorer/account/{account}

import axios from "axios";

const verifyTezTx = async (source) => {
  let api = "https://api.tzstats.com/explorer/op/";
  let tx = source;

  try {
    const response = await axios.get(`${api}${tx}`, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });

    if (response.id) {
      console.log("Id: ", response.id)
      return true;
    } else {
      throw new Error(`Error! Id: ${response.id}`);
    }
  } catch (err) {
    console.log(err);
  }
};

export default verifyTezTx;