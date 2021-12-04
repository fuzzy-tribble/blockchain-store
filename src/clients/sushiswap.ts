import Client from "../lib/client";
import { apiRequest } from "../helpers/api-helpers";
import { IConfig, IReserve, Reserve } from "../models";
import {
  SushiApiPair,
  formatPairingsFromApi,
} from "./helpers/sushiswap-helpers";
import { ClientFunctionResult, CollectionNames } from "../lib/types";

export default class Sushiswap extends Client {
  constructor(conf: IConfig) {
    super(conf);
  }

  getReserves = async (): Promise<ClientFunctionResult> => {
    let res: ClientFunctionResult = {
      success: false,
      client: this.conf.client,
      network: this.conf.network,
      collection: CollectionNames.RESERVES,
      data: null,
    };
    const reserves = await this._fetchReservesFromApi();
    if (reserves) {
      res.success = true;
      res.data = reserves;
    }
    return res;
  };

  updateReservePriceData = async (): Promise<ClientFunctionResult> => {
    // TODO - implement
    return {
      success: false,
      client: this.conf.client,
      network: this.conf.network,
      collection: CollectionNames.RESERVES,
      data: {},
    };
  };

  private _fetchReservesFromApi = async (): Promise<IReserve[] | null> => {
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
