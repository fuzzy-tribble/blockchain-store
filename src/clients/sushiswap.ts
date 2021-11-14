import Client from "../lib/client";
import { apiRequest } from "../helpers/api-helpers";
import { IConfig, IReserve, Reserve } from "../models";
import {
  SushiApiPair,
  formatPairingsFromApi,
} from "./helpers/sushiswap-helpers";

export default class Sushiswap extends Client {
  constructor(conf: IConfig) {
    super(conf);
  }

  addNewReserves = async (): Promise<IReserve[]> => {
    const reserves = await this._getReservesFromApi();
    await  Reserve.
  };

  updateReserves = async (): Promise<void> => {
    // TODO - update reserve data that needs to be updated
  };

  private _getReservesFromApi = async (): Promise<IReserve[]> => {
    const [res, pairings] = await apiRequest(
      this.conf.client,
      this.conf.dataSources.apis.GET_ALL_PAIRS
    );
    return formatPairingsFromApi(
      this.conf.client,
      this.conf.network,
      pairings as Array<SushiApiPair>
    );
  };
}
