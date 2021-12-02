import axios, { AxiosRequestConfig } from "axios";
import Logger from "../lib/logger";

export const apiRequest = async (
  clientName: string,
  networkRequest: AxiosRequestConfig
): Promise<any> => {
  let result = null;
  try {
    Logger.info({
      client: clientName,
      at: "Api#request",
      message: `Making network request: ${networkRequest.url}`,
    });
    const { data, status, statusText, headers, config } = await axios(
      networkRequest
    );
    if (status == 200) {
      result = data;
    } else {
      throw new Error(
        `ApiRequestError: status: ${status}, statusText: ${statusText}, headers: ${headers}`
      );
    }
  } catch (err) {
    Logger.error({
      client: clientName,
      at: "Api#request",
      message: "Couldn't fetch api data.",
      error: err,
    });
  } finally {
    return result;
  }
};
