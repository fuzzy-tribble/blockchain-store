import { clientConfigs } from "../lib/config";
import { Client } from "../lib/types";
import Aave from "./aave";

export const clientsList: Client[] = [
  // new Aave(clientConfigs.aaveMainnet),
  new Aave(clientConfigs.aaveTestnet),
];
