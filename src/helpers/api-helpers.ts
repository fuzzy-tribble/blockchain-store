import axios, { AxiosRequestConfig } from "axios";
import Logger from "../lib/logger";

export const apiRequest = async (
  clientName: string,
  networkRequest: AxiosRequestConfig
): Promise<any> => {
  try {
    Logger.info({
      client: clientName,
      at: "Api#request",
      message: `Requesting data from network: ${networkRequest.url}`,
    });
    const res = await axios(networkRequest);
    return res.data;
  } catch (err) {
    Logger.error({
      client: clientName,
      at: "Api#request",
      message: "Couldn't get latest block.",
      error: err,
    });
  }
};
