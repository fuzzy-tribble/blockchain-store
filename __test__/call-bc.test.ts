import { TransactionRequest } from "@ethersproject/abstract-provider";
import { Interface } from "@ethersproject/abi";
import { JsonRpcProvider } from "@ethersproject/providers";
import { nwProtocols } from "../src/lib/config";
import { ethers } from "ethers";

// const txReq: TransactionRequest = {
//   to: aave.ethereum.proxyAddress,
//   data: iface.encodeFunctionData("getUserAccountData", [account]),
// };

const iface = new Interface(nwProtocols.ethereum.aave.lendingPoolAbi);
const provider: JsonRpcProvider = new ethers.providers.JsonRpcProvider(
  nwProtocols.ethereum.rpcUrl
);
console.log(nwProtocols.ethereum.rpcUrl);
// provider.ready()

// Get reserve list
const txReq0: TransactionRequest = {
  to: nwProtocols.ethereum.aave.proxyAddress,
  data: iface.encodeFunctionData("getReservesList"),
};
provider.call(txReq0).then((res) => {
  const decodedResult = iface.decodeFunctionResult("getReservesList", res);
  console.log("Reserve List: ", decodedResult);
});

// Get reserve data
let address = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const txReq1: TransactionRequest = {
  to: nwProtocols.ethereum.aave.proxyAddress,
  data: iface.encodeFunctionData("getReserveData", [address]),
};
provider.call(txReq1).then((res) => {
  const decodedResult = iface.decodeFunctionResult("getReserveData", res);
  console.log("Reserve[0] Data: ", decodedResult);
});
