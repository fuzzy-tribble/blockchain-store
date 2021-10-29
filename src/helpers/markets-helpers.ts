import { TransactionRequest } from "@ethersproject/abstract-provider";
import { Interface } from "@ethersproject/abi";
import { JsonRpcProvider } from "@ethersproject/providers";
import { dataFiles, nwProtocols } from "../lib/config";
import { ethers } from "ethers";
import { db } from "./db-helpers";

const iface = new Interface(nwProtocols.ethereum.aave.lendingPoolAbi);
const getReservesListTxReq: TransactionRequest = {
  to: nwProtocols.ethereum.aave.proxyAddress,
  data: iface.encodeFunctionData("getReservesList"),
};

export const getMarkets = async () => {
  const res = await provider.call(getReservesListTxReq);
  const decodedRes = iface.decodeFunctionResult("getReservesList", res);
  console.log("decoded res: ", decodedRes[0]);

  updateMarketData(decodedRes[0]);
};

const updateMarketData = async (marketList: string[]) => {
  let markets: any[] = [];
  const marketsDb = db(dataFiles.markets);
  marketList.map(async (addr) => {
    console.log("getting market data for: ", addr);
    const getReserveDataTxReq: TransactionRequest = {
      to: nwProtocols.ethereum.aave.proxyAddress,
      data: iface.encodeFunctionData("getReserveData", [addr]),
    };
    const res = await provider.call(getReserveDataTxReq);
    const decodedRes = iface.decodeFunctionResult("getReserveData", res);
    console.log("data: ", decodedRes);
    // TODO - STOPPED HERE
    // TODO - fix this stupid ass shit
    markets.push({
      address: addr,
      data: decodedRes,
    });
    marketsDb.push("/markets", markets);
  });
};

// Usage Example
const provider: JsonRpcProvider = new ethers.providers.JsonRpcProvider(
  nwProtocols.ethereum.rpcUrl
);
getMarkets(provider);
