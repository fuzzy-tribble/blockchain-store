import axios from "axios";
import qs from "qs";
import Client from "../lib/client";
export default class Compound extends Client {
  // TODO - implement polling functions and parsers

  private _cTokenRequest = async (): Promise<void> => {
    const apiBaseUrl = "https://api.compound.finance/api";
    const accountRequest: any = await axios({
      url: `${apiBaseUrl}/v2/accounts`,
      method: "get",
      responseType: "json",
      // timeout: 3000,
      params: {
        addresses: [], // returns all accounts if empty
        block_number: 0, // returns latest if given 0
        meta: true,
        page_number: 1,
        page_size: 10,
      },
    });
    console.log(accountRequest.error);
  };
  private _unhealthyAccountRequest = async (maxHealth: number = 2) => {
    const apiBaseUrl = "https://api.compound.finance/api";
    const { data } = await axios({
      url: `${apiBaseUrl}/v2/account`,
      method: "get",
      responseType: "json",
      // timeout: 3000,
      params: {
        addresses: [], // returns all accounts if empty
        block_number: 0, // returns latest if given 0
        max_health: { value: "2.0" },
        min_borrow_value_in_eth: { value: "0.002" },
        page_number: 1,
        page_size: 10,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params);
      },
    });
    console.log(JSON.stringify(data));
  };
}
