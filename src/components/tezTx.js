//@dev If transaction, then true and tab opened

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

    if (response.status === 200) {
      console.log("status: ", response.status)
      return true;
    } else {
      throw new Error(`Error! status: ${response.status}`);
    }
  } catch (err) {
    console.log(err);
  }
};

export default verifyTezTx;