import { clientConfigs } from "../lib/config";
import { Client } from "../lib/types";
import Aave from "./aave";

const clients: Client[] = [
  // new Aave(clientConfigs.aaveMainnet),
  new Aave(clientConfigs.aaveTestnet),
];

export default clients;
