import Client from "../lib/client";
import { apiRequest } from "../helpers/api-helpers";
import { CollectionNames, IConfig, IReserve, Reserve } from "../models";
import {
  SushiApiPair,
  formatPairingsFromApi,
} from "./helpers/sushiswap-helpers";
import { ClientFunctionResult } from "../lib/types";

export default class Sushiswap extends Client {
  constructor(conf: IConfig) {
    super(conf);
  }

  addNewReserves = async (): Promise<ClientFunctionResult> => {
    const reserves = await this._getReservesFromApi();
    return {
      status: false,
      client: this.conf.client,
      network: this.conf.network,
      collection: CollectionNames.RESERVES,
      data: reserves,
    };
  };

  updateReservePriceData = async (): Promise<ClientFunctionResult> => {
    return {
      status: false,
      client: this.conf.client,
      network: this.conf.network,
      collection: CollectionNames.RESERVES,
      data: {},
    };
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
