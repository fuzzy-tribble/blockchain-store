import axios from "axios";
import qs from "qs";

const apiBaseUrl = "https://api.compound.finance/api";

const _unhealthyAccountRequest = async (maxHealth: number = 2) => {
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
_unhealthyAccountRequest();

const _cTokenRequest = async (): Promise<void> => {
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
// _cTokenRequest();

const accountSample = {
  accounts: [
    {
      address: "0x61c4458fbe4da898a498f50434076a7100b5f2c1",
      block_updated: null,
      health: {
        value:
          "1.99932927182682274843310459507550165256122331687486576582722274608186958221914",
      },
      tokens: [
        {
          address: "0x39aa39c021dfbae8fac545936693ac917d5e7563",
          borrow_balance_underlying: { value: "20133.16921535351" },
          lifetime_borrow_interest_accrued: { value: "133.16921535351" },
          lifetime_supply_interest_accrued: { value: "0.0" },
          safe_withdraw_amount_underlying: { value: "0.0" },
          supply_balance_underlying: { value: "0.0" },
          symbol: "cUSDC",
        },
        {
          address: "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5",
          borrow_balance_underlying: { value: "0" },
          lifetime_borrow_interest_accrued: { value: "0" },
          lifetime_supply_interest_accrued: { value: "0.000998664973878" },
          safe_withdraw_amount_underlying: {
            value: "4.497858215521827499323492989",
          },
          supply_balance_underlying: { value: "12.000998664973878" },
          symbol: "cETH",
        },
      ],
      total_borrow_value_in_eth: { value: "4.501884269671230337336625392" },
      total_collateral_value_in_eth: { value: "9.000748998730408684997645814" },
    },
    {
      address: "0xb46d0e52e8cc8ad97f642fff3b4715225b35e480",
      block_updated: null,
      health: {
        value:
          "1.99925268291522045305056943136218252661939121561588682533678722065728455277740",
      },
      tokens: [
        {
          address: "0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9",
          borrow_balance_underlying: { value: "10532.983070498634" },
          lifetime_borrow_interest_accrued: { value: "147.837772498634" },
          lifetime_supply_interest_accrued: { value: "0.0" },
          safe_withdraw_amount_underlying: { value: "0.0" },
          supply_balance_underlying: { value: "0.0" },
          symbol: "cUSDT",
        },
        {
          address: "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5",
          borrow_balance_underlying: { value: "0" },
          lifetime_borrow_interest_accrued: { value: "0" },
          lifetime_supply_interest_accrued: { value: "0.0001441907417042" },
          safe_withdraw_amount_underlying: { value: "1.1551441907417042" },
          supply_balance_underlying: { value: "1.1551441907417042" },
          symbol: "cETH",
        },
        {
          address: "0xccf4429db6322d5c611ee964527d42e5d685dd6a",
          borrow_balance_underlying: { value: "0" },
          lifetime_borrow_interest_accrued: { value: "0" },
          lifetime_supply_interest_accrued: { value: "0.00028666072069706" },
          safe_withdraw_amount_underlying: {
            value: "0.1917396978963687337472542847",
          },
          supply_balance_underlying: { value: "0.41749036072069706" },
          symbol: "cWBTC2",
        },
      ],
      total_borrow_value_in_eth: { value: "2.355231324516465364772617319" },
      total_collateral_value_in_eth: { value: "4.708702544425511613544615641" },
    },
    {
      address: "0x237a6d794bce99e61d1226f2203ee2dc727a235d",
      block_updated: null,
      health: {
        value:
          "1.99742752634196279851626321700084267786409587556099961326585979999655007401559",
      },
      tokens: [
        {
          address: "0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9",
          borrow_balance_underlying: { value: "1511.4154371259576" },
          lifetime_borrow_interest_accrued: { value: "11.4154371259576" },
          lifetime_supply_interest_accrued: { value: "0.0" },
          safe_withdraw_amount_underlying: { value: "0.0" },
          supply_balance_underlying: { value: "0.0" },
          symbol: "cUSDT",
        },
        {
          address: "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5",
          borrow_balance_underlying: { value: "0" },
          lifetime_borrow_interest_accrued: { value: "0" },
          lifetime_supply_interest_accrued: { value: "0.0000689987300341" },
          safe_withdraw_amount_underlying: {
            value: "0.3368013789666294650717605114",
          },
          supply_balance_underlying: { value: "0.9000689987300341" },
          symbol: "cETH",
        },
      ],
      total_borrow_value_in_eth: { value: "0.3379605718580428065105429786" },
      total_collateral_value_in_eth: {
        value: "0.6750517490475256091511835435",
      },
    },
    {
      address: "0x7d1d311ee3b0624dad392147eb7a397d4007efda",
      block_updated: null,
      health: {
        value:
          "1.99736186669090003077576841622584268747349281584280185421055846075602146199026",
      },
      tokens: [
        {
          address: "0x35a18000230da775cac24873d00ff85bccded550",
          borrow_balance_underlying: { value: "0" },
          lifetime_borrow_interest_accrued: { value: "0" },
          lifetime_supply_interest_accrued: { value: "5.15064250397845" },
          safe_withdraw_amount_underlying: {
            value: "186.9504639046906245120557583",
          },
          supply_balance_underlying: { value: "499.63443976174875" },
          symbol: "cUNI",
        },
        {
          address: "0x39aa39c021dfbae8fac545936693ac917d5e7563",
          borrow_balance_underlying: { value: "3849.1518499239305" },
          lifetime_borrow_interest_accrued: { value: "176.9054139239305" },
          lifetime_supply_interest_accrued: { value: "0.0" },
          safe_withdraw_amount_underlying: { value: "0.0" },
          supply_balance_underlying: { value: "0.0" },
          symbol: "cUSDC",
        },
      ],
      total_borrow_value_in_eth: { value: "0.8606909314373532308407648001" },
      total_collateral_value_in_eth: { value: "1.719111245459641302271730861" },
    },
    {
      address: "0xe8e415a30140ada0942fd45ef5009bc6fad0a8fa",
      block_updated: null,
      health: {
        value:
          "1.99721640880973126113132011027603702102570112602245001207253087328082905825956",
      },
      tokens: [
        {
          address: "0x39aa39c021dfbae8fac545936693ac917d5e7563",
          borrow_balance_underlying: { value: "35253.093760763804" },
          lifetime_borrow_interest_accrued: { value: "471.939817763804" },
          lifetime_supply_interest_accrued: { value: "0.0" },
          safe_withdraw_amount_underlying: { value: "0.0" },
          supply_balance_underlying: { value: "0.0" },
          symbol: "cUSDC",
        },
        {
          address: "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5",
          borrow_balance_underlying: { value: "0" },
          lifetime_borrow_interest_accrued: { value: "0" },
          lifetime_supply_interest_accrued: { value: "0.006253100634322" },
          safe_withdraw_amount_underlying: {
            value: "7.853523646568569712419040461",
          },
          supply_balance_underlying: { value: "20.991490696634322" },
          symbol: "cETH",
        },
      ],
      total_borrow_value_in_eth: { value: "7.882780230039452219255948309" },
      total_collateral_value_in_eth: { value: "15.74361802247574203652087681" },
    },
    {
      address: "0xd1b8c856d3cd5a5236562abaaadd3401e652de31",
      block_updated: null,
      health: {
        value:
          "1.99653889303070675961285255831306611023276581849657317264527332023765676124561",
      },
      tokens: [
        {
          address: "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5",
          borrow_balance_underlying: { value: "0" },
          lifetime_borrow_interest_accrued: { value: "0" },
          lifetime_supply_interest_accrued: { value: "0.0009264484377551" },
          safe_withdraw_amount_underlying: {
            value: "0.5675148828211730927803032963",
          },
          supply_balance_underlying: { value: "1.5177582126047795" },
          symbol: "cETH",
        },
        {
          address: "0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9",
          borrow_balance_underlying: { value: "2549.7869702934154" },
          lifetime_borrow_interest_accrued: { value: "49.7869702934154" },
          lifetime_supply_interest_accrued: { value: "0.0" },
          safe_withdraw_amount_underlying: { value: "0.0" },
          supply_balance_underlying: { value: "0.0" },
          symbol: "cUSDT",
        },
      ],
      total_borrow_value_in_eth: { value: "0.5701459978701638535214278741" },
      total_collateral_value_in_eth: { value: "1.138318659453584633939114828" },
    },
    {
      address: "0x0845b04785b1fc11e0cf9012cba4feab6726a663",
      block_updated: null,
      health: {
        value:
          "1.99566495090654986679935593605925125203606784137965267036242165244672684929857",
      },
      tokens: [
        {
          address: "0x70e36f6bf80a52b3b46b3af8e106cc0ed743e8e4",
          borrow_balance_underlying: { value: "0" },
          lifetime_borrow_interest_accrued: { value: "0" },
          lifetime_supply_interest_accrued: { value: "0.0908445857076754" },
          safe_withdraw_amount_underlying: { value: "0.0" },
          supply_balance_underlying: { value: "0.0" },
          symbol: "cCOMP",
        },
        {
          address: "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5",
          borrow_balance_underlying: { value: "0" },
          lifetime_borrow_interest_accrued: { value: "0" },
          lifetime_supply_interest_accrued: { value: "0.07900908408800" },
          safe_withdraw_amount_underlying: {
            value: "27.45446006775306099178573902",
          },
          supply_balance_underlying: { value: "73.47791207923459" },
          symbol: "cETH",
        },
        {
          address: "0x39aa39c021dfbae8fac545936693ac917d5e7563",
          borrow_balance_underlying: { value: "123494.68245520159" },
          lifetime_borrow_interest_accrued: { value: "3941.05399720159" },
          lifetime_supply_interest_accrued: { value: "0.0" },
          safe_withdraw_amount_underlying: { value: "0.0" },
          supply_balance_underlying: { value: "0.0" },
          symbol: "cUSDC",
        },
      ],
      total_borrow_value_in_eth: { value: "27.61407120688891757886568743" },
      total_collateral_value_in_eth: { value: "55.10843405942594392997419141" },
    },
    {
      address: "0xb7017de2b0eec49ff3a370fb6d40cd97e6d9cff7",
      block_updated: null,
      health: {
        value:
          "1.99559260766408150499564704976798694676364735327071949435606495420295298999560",
      },
      tokens: [
        {
          address: "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5",
          borrow_balance_underlying: { value: "0" },
          lifetime_borrow_interest_accrued: { value: "0" },
          lifetime_supply_interest_accrued: { value: "0.000013011360397055" },
          safe_withdraw_amount_underlying: {
            value: "0.003741057726147912384971260886",
          },
          supply_balance_underlying: { value: "0.010013011216051282" },
          symbol: "cETH",
        },
        {
          address: "0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e",
          borrow_balance_underlying: { value: "16.195894505375524" },
          lifetime_borrow_interest_accrued: { value: "1.032258314187910" },
          lifetime_supply_interest_accrued: { value: "0.0" },
          safe_withdraw_amount_underlying: { value: "0.0" },
          supply_balance_underlying: { value: "0.0" },
          symbol: "cBAT",
        },
      ],
      total_borrow_value_in_eth: { value: "0.003763172093942021875203420125" },
      total_collateral_value_in_eth: {
        value: "0.007509758412038461328490860192",
      },
    },
    {
      address: "0xf549f08e0a1f57d2b4a39573a11c2e1d380a2c75",
      block_updated: null,
      health: {
        value:
          "1.99435403016927314890163022554653178624521978734638396772668495199199216356246",
      },
      tokens: [
        {
          address: "0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e",
          borrow_balance_underlying: { value: "24538.438211469143" },
          lifetime_borrow_interest_accrued: { value: "538.438211469143" },
          lifetime_supply_interest_accrued: { value: "35.583100075664" },
          safe_withdraw_amount_underlying: { value: "24114.528684215664" },
          supply_balance_underlying: { value: "24114.528684215664" },
          symbol: "cBAT",
        },
        {
          address: "0x39aa39c021dfbae8fac545936693ac917d5e7563",
          borrow_balance_underlying: { value: "0.0" },
          lifetime_borrow_interest_accrued: { value: "179.80993" },
          lifetime_supply_interest_accrued: { value: "0.0" },
          safe_withdraw_amount_underlying: { value: "0.0" },
          supply_balance_underlying: { value: "0.0" },
          symbol: "cUSDC",
        },
        {
          address: "0xface851a4921ce59e912d19329929ce6da6eb0c7",
          borrow_balance_underlying: { value: "735.632846318149" },
          lifetime_borrow_interest_accrued: { value: "14.8743381358541" },
          lifetime_supply_interest_accrued: { value: "0.1677206315720612496" },
          safe_withdraw_amount_underlying: { value: "0.0012396375541156696" },
          supply_balance_underlying: { value: "0.0012396375541156696" },
          symbol: "cLINK",
        },
        {
          address: "0xccf4429db6322d5c611ee964527d42e5d685dd6a",
          borrow_balance_underlying: { value: "1.972000163324464" },
          lifetime_borrow_interest_accrued: { value: "0.024000163324464" },
          lifetime_supply_interest_accrued: { value: "0.0" },
          safe_withdraw_amount_underlying: { value: "0.0" },
          supply_balance_underlying: { value: "0.0" },
          symbol: "cWBTC2",
        },
        {
          address: "0x35a18000230da775cac24873d00ff85bccded550",
          borrow_balance_underlying: { value: "0.0" },
          lifetime_borrow_interest_accrued: { value: "0.289385111909058" },
          lifetime_supply_interest_accrued: { value: "0.0" },
          safe_withdraw_amount_underlying: { value: "0.0" },
          supply_balance_underlying: { value: "0.0" },
          symbol: "cUNI",
        },
        {
          address: "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5",
          borrow_balance_underlying: { value: "0" },
          lifetime_borrow_interest_accrued: { value: "0" },
          lifetime_supply_interest_accrued: { value: "0.04055755438013" },
          safe_withdraw_amount_underlying: {
            value: "38.62866041178137686372539887",
          },
          supply_balance_underlying: { value: "98.64207473350086" },
          symbol: "cETH",
        },
      ],
      total_borrow_value_in_eth: { value: "38.92166111097382301159753840" },
      total_collateral_value_in_eth: { value: "77.62357169755331328442294990" },
    },
    {
      address: "0x112bb5dd677ec044f24c045db1a0ab3b167841ea",
      block_updated: null,
      health: {
        value:
          "1.9942516308036252951911497387292564524809022117667433443020518049839959506626",
      },
      tokens: [
        {
          address: "0x4b0181102a0112a2ef11abee5563bb4a3176c9d7",
          borrow_balance_underlying: { value: "2.0081918658210984" },
          lifetime_borrow_interest_accrued: { value: "0.0081918658210984" },
          lifetime_supply_interest_accrued: { value: "0.012099758450752" },
          safe_withdraw_amount_underlying: {
            value: "3.736500177759819215928014139",
          },
          supply_balance_underlying: { value: "10.012099758450752" },
          symbol: "cSUSHI",
        },
      ],
      total_borrow_value_in_eth: { value: "0.005595068766397626927797292110" },
      total_collateral_value_in_eth: {
        value: "0.01115797501184689551790271706",
      },
    },
  ],
  error: null,
  pagination_summary: {
    page_number: 1,
    page_size: 10,
    total_entries: 2594,
    total_pages: 260,
  },
  request: {
    addresses: [],
    block_number: 0,
    block_timestamp: 0,
    max_health: { value: "2.0" },
    min_borrow_value_in_eth: { value: "0.002" },
    network: "mainnet",
    page_number: 1,
    page_size: 10,
  },
};

const tokenSample = {
  cToken: [
    {
      borrow_cap: {
        value: "0",
      },
      borrow_rate: {
        value: "0.033953673881053246576006116",
      },
      cash: {
        value: "1696.652607097563282533",
      },
      collateral_factor: {
        value: "0",
      },
      comp_borrow_apy: {
        value: "0",
      },
      comp_supply_apy: {
        value: "0",
      },
      exchange_rate: {
        value: "0.020040659236631064",
      },
      interest_rate_model_address: "0xbae04cbf96391086dc643e842b517734e214d698",
      name: "Compound Augur",
      number_of_borrowers: 152,
      number_of_suppliers: 1368,
      reserve_factor: {
        value: "1.00000000000000000",
      },
      reserves: {
        value: "513.4018178759148107418000000",
      },
      supply_rate: {
        value: "0.000000000000000000000000000",
      },
      symbol: "cREP",
      token_address: "0x158079ee67fce2f58472a96584a73c7ab9ac95c1",
      total_borrows: {
        value: "54.126740267070820854",
      },
      total_supply: {
        value: "61743.35459120",
      },
      underlying_address: "0x1985365e9f78359a9b6ad760e32412f4a445e862",
      underlying_name: "Augur",
      underlying_price: {
        value: "0.005765457236801422",
      },
      underlying_symbol: "REP",
    },
    {
      borrow_cap: {
        value: "0",
      },
      borrow_rate: {
        value: "0.058991462946500432069503592",
      },
      cash: {
        value: "200581.921365597641632130",
      },
      collateral_factor: {
        value: "0",
      },
      comp_borrow_apy: {
        value: "0",
      },
      comp_supply_apy: {
        value: "0",
      },
      exchange_rate: {
        value: "0.021449754666696161",
      },
      interest_rate_model_address: "0xa1046abfc2598f48c44fb320d281d3f3c0733c9a",
      name: "Compound Sai",
      number_of_borrowers: 290,
      number_of_suppliers: 5888,
      reserve_factor: {
        value: "1.00000000000000000",
      },
      reserves: {
        value: "26660.72242475298126417000000",
      },
      supply_rate: {
        value: "0.000000000000000000000000000",
      },
      symbol: "cSAI",
      token_address: "0xf5dce57282a584d2746faf1593d3121fcac444dc",
      total_borrows: {
        value: "426.255879857905901282",
      },
      total_supply: {
        value: "8128179.43747404",
      },
      underlying_address: "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
      underlying_name: "Sai (Legacy Dai)",
      underlying_price: {
        value: "0.005285551865403238",
      },
      underlying_symbol: "SAI",
    },
    {
      borrow_cap: {
        value: "0",
      },
      borrow_rate: {
        value: "0.096096591814507214672661482",
      },
      cash: {
        value: "14345294.847333155756979924",
      },
      collateral_factor: {
        value: "0",
      },
      comp_borrow_apy: {
        value: "0",
      },
      comp_supply_apy: {
        value: "0",
      },
      exchange_rate: {
        value: "0.020211359641300713",
      },
      interest_rate_model_address: "0xfb564da37b41b2f6b6edcc3e56fbf523bd9f2012",
      name: "Compound TrueUSD",
      number_of_borrowers: 133,
      number_of_suppliers: 42,
      reserve_factor: {
        value: "0.07500000000000000",
      },
      reserves: {
        value: "90249.57866490046457744715000",
      },
      supply_rate: {
        value: "0.073635831883803181181223882",
      },
      symbol: "cTUSD",
      token_address: "0x12392f67bdf24fae0af363c24ac620a2f67dad86",
      total_borrows: {
        value: "73259869.617217392114811804",
      },
      total_supply: {
        value: "4329986524.36296847",
      },
      underlying_address: "0x0000000000085d4780b73119b644ae5ecd22b376",
      underlying_name: "TrueUSD",
      underlying_price: {
        value: "0.000223605346059383",
      },
      underlying_symbol: "TUSD",
    },
    {
      borrow_cap: {
        value: "0",
      },
      borrow_rate: {
        value: "0.023160019865964019283905276",
      },
      cash: {
        value: "2622.43149095",
      },
      collateral_factor: {
        value: "0.65000000000000000",
      },
      comp_borrow_apy: {
        value: "0",
      },
      comp_supply_apy: {
        value: "0",
      },
      exchange_rate: {
        value: "0.020204487712193021",
      },
      interest_rate_model_address: "0xbae04cbf96391086dc643e842b517734e214d698",
      name: "Compound Wrapped BTC",
      number_of_borrowers: 309,
      number_of_suppliers: 2112,
      reserve_factor: {
        value: "1.00000000000000000",
      },
      reserves: {
        value: "7.0762374310000000000000000",
      },
      supply_rate: {
        value: "0.000000000000000000000000000",
      },
      symbol: "cWBTC",
      token_address: "0xc11b1268c1a384e55c48c2391d8d480264a3a7f4",
      total_borrows: {
        value: "0.64479303",
      },
      total_supply: {
        value: "129476.18785535",
      },
      underlying_address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
      underlying_name: "Wrapped BTC",
      underlying_price: {
        value: "14.159127096551759200",
      },
      underlying_symbol: "WBTC",
    },
    {
      borrow_cap: {
        value: "25000.00000000000000000",
      },
      borrow_rate: {
        value: "0.034554982552182093275563696",
      },
      cash: {
        value: "826.563981385224708478",
      },
      collateral_factor: {
        value: "0.35000000000000000",
      },
      comp_borrow_apy: {
        value: "0",
      },
      comp_supply_apy: {
        value: "0",
      },
      exchange_rate: {
        value: "0.020002172906775906",
      },
      interest_rate_model_address: "0xd956188795ca6f4a74092ddca33e0ea4ca3a1395",
      name: "Compound Maker",
      number_of_borrowers: 20,
      number_of_suppliers: 43,
      reserve_factor: {
        value: "0.25000000000000000",
      },
      reserves: {
        value: "0.01434371628850235125000000000",
      },
      supply_rate: {
        value: "0.001108640194857256643417055",
      },
      symbol: "cMKR",
      token_address: "0x95b4ef2869ebd94beb4eee400a99824bf5dc325b",
      total_borrows: {
        value: "37.578036635310461497",
      },
      total_supply: {
        value: "43201.69005296",
      },
      underlying_address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
      underlying_name: "Maker",
      underlying_price: {
        value: "0.582538670287864015",
      },
      underlying_symbol: "MKR",
    },
    {
      borrow_cap: {
        value: "66000.00000000000000000",
      },
      borrow_rate: {
        value: "0.033814177099556285614267121",
      },
      cash: {
        value: "14249.732506208663464964",
      },
      collateral_factor: {
        value: "0.50000000000000000",
      },
      comp_borrow_apy: {
        value: "0",
      },
      comp_supply_apy: {
        value: "0",
      },
      exchange_rate: {
        value: "0.020020284177953688",
      },
      interest_rate_model_address: "0xd956188795ca6f4a74092ddca33e0ea4ca3a1395",
      name: "Compound Aave Token",
      number_of_borrowers: 25,
      number_of_suppliers: 68,
      reserve_factor: {
        value: "0.25000000000000000",
      },
      reserves: {
        value: "8.255515424995004096000000000",
      },
      supply_rate: {
        value: "0.001015552762176607774216296",
      },
      symbol: "cAAVE",
      token_address: "0xe65cdb6479bac1e22340e4e755fae7e509ecd06c",
      total_borrows: {
        value: "604.146826577219412778",
      },
      total_supply: {
        value: "741529.12543114",
      },
      underlying_address: "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
      underlying_name: "Aave Token",
      underlying_price: {
        value: "0.072812608837316758",
      },
      underlying_symbol: "AAVE",
    },
    {
      borrow_cap: {
        value: "90750.00000000000000000",
      },
      borrow_rate: {
        value: "0.067699894504439586331950178",
      },
      cash: {
        value: "458797.767983246158803012",
      },
      collateral_factor: {
        value: "0.60000000000000000",
      },
      comp_borrow_apy: {
        value: "14.041211647099082",
      },
      comp_supply_apy: {
        value: "2.2104777929417008",
      },
      exchange_rate: {
        value: "0.020358825099217082",
      },
      interest_rate_model_address: "0xd956188795ca6f4a74092ddca33e0ea4ca3a1395",
      name: "Compound Collateral",
      number_of_borrowers: 101,
      number_of_suppliers: 4846,
      reserve_factor: {
        value: "0.25000000000000000",
      },
      reserves: {
        value: "1653.663136043748956958750000",
      },
      supply_rate: {
        value: "0.008208443163454552704682313",
      },
      symbol: "cCOMP",
      token_address: "0x70e36f6bf80a52b3b46b3af8e106cc0ed743e8e4",
      total_borrows: {
        value: "91240.727410260637771261",
      },
      total_supply: {
        value: "26935976.39279055",
      },
      underlying_address: "0xc00e94cb662c3520282e6f5717214004a7f26888",
      underlying_name: "Compound Governance Token",
      underlying_price: {
        value: "0.081438091147312097",
      },
      underlying_symbol: "COMP",
    },
    {
      borrow_cap: {
        value: "1500.00000000000000000",
      },
      borrow_rate: {
        value: "0.048230469274102721158021180",
      },
      cash: {
        value: "64.014250598525060872",
      },
      collateral_factor: {
        value: "0.35000000000000000",
      },
      comp_borrow_apy: {
        value: "0",
      },
      comp_supply_apy: {
        value: "0",
      },
      exchange_rate: {
        value: "0.020058715900958894",
      },
      interest_rate_model_address: "0xd956188795ca6f4a74092ddca33e0ea4ca3a1395",
      name: "Compound yearn.finance",
      number_of_borrowers: 11,
      number_of_suppliers: 30,
      reserve_factor: {
        value: "0.25000000000000000",
      },
      reserves: {
        value: "0.02272893202687652150000000000",
      },
      supply_rate: {
        value: "0.003349967192872644156672633",
      },
      symbol: "cYFI",
      token_address: "0x80a2ae356fc9ef4305676f7a3e2ed04e12c33946",
      total_borrows: {
        value: "6.690913038839267693",
      },
      total_supply: {
        value: "3523.77664923",
      },
      underlying_address: "0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e",
      underlying_name: "yearn.finance",
      underlying_price: {
        value: "7.719149602242011600",
      },
      underlying_symbol: "YFI",
    },
    {
      borrow_cap: {
        value: "0",
      },
      borrow_rate: {
        value: "0.071687760992726866549140609",
      },
      cash: {
        value: "125522857.089016651305403874",
      },
      collateral_factor: {
        value: "0.65000000000000000",
      },
      comp_borrow_apy: {
        value: "5.212409488511693",
      },
      comp_supply_apy: {
        value: "0.7001020710700967",
      },
      exchange_rate: {
        value: "0.020546613514443877",
      },
      interest_rate_model_address: "0xbae04cbf96391086dc643e842b517734e214d698",
      name: "Compound 0x",
      number_of_borrowers: 248,
      number_of_suppliers: 3600,
      reserve_factor: {
        value: "0.25000000000000000",
      },
      reserves: {
        value: "1707894.873535668810039486100",
      },
      supply_rate: {
        value: "0.007155378895566026541165201",
      },
      symbol: "cZRX",
      token_address: "0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407",
      total_borrows: {
        value: "19704841.909384787560341735",
      },
      total_supply: {
        value: "6985083163.41153193",
      },
      underlying_address: "0xe41d2489571d322189246dafa5ebde1f4699f498",
      underlying_name: "0x",
      underlying_price: {
        value: "0.000285246408202227",
      },
      underlying_symbol: "ZRX",
    },
    {
      borrow_cap: {
        value: "11250000.00000000000000000",
      },
      borrow_rate: {
        value: "0.047938750165301218843291744",
      },
      cash: {
        value: "7638639.168547051792233580",
      },
      collateral_factor: {
        value: "0.60000000000000000",
      },
      comp_borrow_apy: {
        value: "10.787649304533065",
      },
      comp_supply_apy: {
        value: "0.6182596646516769",
      },
      exchange_rate: {
        value: "0.020233543443107427",
      },
      interest_rate_model_address: "0xd88b94128ff2b8cf2d7886cd1c1e46757418ca2a",
      name: "Compound Uniswap",
      number_of_borrowers: 167,
      number_of_suppliers: 2440,
      reserve_factor: {
        value: "0.25000000000000000",
      },
      reserves: {
        value: "44101.64101908496555238975000",
      },
      supply_rate: {
        value: "0.002114993816617986214709645",
      },
      symbol: "cUNI",
      token_address: "0x35a18000230da775cac24873d00ff85bccded550",
      total_borrows: {
        value: "486103.930460384570597624",
      },
      total_supply: {
        value: "399368577.26919940",
      },
      underlying_address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
      underlying_name: "Uniswap",
      underlying_price: {
        value: "0.005734563474979165",
      },
      underlying_symbol: "UNI",
    },
    {
      borrow_cap: {
        value: "0",
      },
      borrow_rate: {
        value: "0.051558603640533736312412178",
      },
      cash: {
        value: "3923594.484888046148190053",
      },
      collateral_factor: {
        value: "0.50000000000000000",
      },
      comp_borrow_apy: {
        value: "8.80789809568503",
      },
      comp_supply_apy: {
        value: "0.9075407700033455",
      },
      exchange_rate: {
        value: "0.020068430426100073",
      },
      interest_rate_model_address: "0xd956188795ca6f4a74092ddca33e0ea4ca3a1395",
      name: "Compound ChainLink Token",
      number_of_borrowers: 125,
      number_of_suppliers: 602,
      reserve_factor: {
        value: "0.25000000000000000",
      },
      reserves: {
        value: "3967.911150954845808273000000",
      },
      supply_rate: {
        value: "0.004043420057603906862519110",
      },
      symbol: "cLINK",
      token_address: "0xface851a4921ce59e912d19329929ce6da6eb0c7",
      total_borrows: {
        value: "469726.899175076222535948",
      },
      total_supply: {
        value: "218719320.82957406",
      },
      underlying_address: "0x514910771af9ca656af840dff83e8264ecf986ca",
      underlying_name: "ChainLink Token",
      underlying_price: {
        value: "0.007202328196572714",
      },
      underlying_symbol: "LINK",
    },
    {
      borrow_cap: {
        value: "0",
      },
      borrow_rate: {
        value: "0.055146342189475010218559613",
      },
      cash: {
        value: "111211899.404522229809813986",
      },
      collateral_factor: {
        value: "0.65000000000000000",
      },
      comp_borrow_apy: {
        value: "11.789429987428335",
      },
      comp_supply_apy: {
        value: "1.0404736516922863",
      },
      exchange_rate: {
        value: "0.020649356753863310",
      },
      interest_rate_model_address: "0xbae04cbf96391086dc643e842b517734e214d698",
      name: "Compound Basic Attention Token",
      number_of_borrowers: 562,
      number_of_suppliers: 6024,
      reserve_factor: {
        value: "0.25000000000000000",
      },
      reserves: {
        value: "3486850.496897698250095635150",
      },
      supply_rate: {
        value: "0.003745975800163402489844927",
      },
      symbol: "cBAT",
      token_address: "0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e",
      total_borrows: {
        value: "11028045.376545051902991350",
      },
      total_supply: {
        value: "5750934312.37038129",
      },
      underlying_address: "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
      underlying_name: "Basic Attention Token",
      underlying_price: {
        value: "0.000232353458013264",
      },
      underlying_symbol: "BAT",
    },
    {
      borrow_cap: {
        value: "0",
      },
      borrow_rate: {
        value: "0.025800522257732087070170114",
      },
      cash: {
        value: "170799.385559884735195954",
      },
      collateral_factor: {
        value: "0.40000000000000000",
      },
      comp_borrow_apy: {
        value: "0",
      },
      comp_supply_apy: {
        value: "0",
      },
      exchange_rate: {
        value: "0.020081214675777036",
      },
      interest_rate_model_address: "0xd956188795ca6f4a74092ddca33e0ea4ca3a1395",
      name: "Compound Sushi Token",
      number_of_borrowers: 37,
      number_of_suppliers: 102,
      reserve_factor: {
        value: "0.25000000000000000",
      },
      reserves: {
        value: "143.0312406043457539677500000",
      },
      supply_rate: {
        value: "0.000198169743319514953490511",
      },
      symbol: "cSUSHI",
      token_address: "0x4b0181102a0112a2ef11abee5563bb4a3176c9d7",
      total_borrows: {
        value: "1788.475105180349908885",
      },
      total_supply: {
        value: "8587370.44589600",
      },
      underlying_address: "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2",
      underlying_name: "SushiToken",
      underlying_price: {
        value: "0.002786122611899907",
      },
      underlying_symbol: "SUSHI",
    },
    {
      borrow_cap: {
        value: "0",
      },
      borrow_rate: {
        value: "0.122581477733798340879507248",
      },
      cash: {
        value: "110042069.308043",
      },
      collateral_factor: {
        value: "0",
      },
      comp_borrow_apy: {
        value: "1.3183901609260529",
      },
      comp_supply_apy: {
        value: "1.1279056602113036",
      },
      exchange_rate: {
        value: "0.021517176743488412",
      },
      interest_rate_model_address: "0xfb564da37b41b2f6b6edcc3e56fbf523bd9f2012",
      name: "Compound USDT",
      number_of_borrowers: 1753,
      number_of_suppliers: 5959,
      reserve_factor: {
        value: "0.07500000000000000",
      },
      reserves: {
        value: "2078015.894871275000000000000",
      },
      supply_rate: {
        value: "0.095919827360528281393411823",
      },
      symbol: "cUSDT",
      token_address: "0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9",
      total_borrows: {
        value: "643467252.368312",
      },
      total_supply: {
        value: "34922393153.12979744",
      },
      underlying_address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      underlying_name: "USDT",
      underlying_price: {
        value: "0.000223605346059383",
      },
      underlying_symbol: "USDT",
    },
    {
      borrow_cap: {
        value: "0",
      },
      borrow_rate: {
        value: "0.027318079704628560520907720",
      },
      cash: {
        value: "1564526.127555753852721083",
      },
      collateral_factor: {
        value: "0.75000000000000000",
      },
      comp_borrow_apy: {
        value: "3.6268131129806758",
      },
      comp_supply_apy: {
        value: "0.12944585670360276",
      },
      exchange_rate: {
        value: "0.020055611173045481",
      },
      interest_rate_model_address: "0x0c3f8df27e1a00b47653fde878d68d35f00714c0",
      name: "Compound Ether",
      number_of_borrowers: 1263,
      number_of_suppliers: 68749,
      reserve_factor: {
        value: "0.20000000000000000",
      },
      reserves: {
        value: "572.5423034480519031743000000",
      },
      supply_rate: {
        value: "0.000783214616515896157255312",
      },
      symbol: "cETH",
      token_address: "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5",
      total_borrows: {
        value: "58925.998396023760451066",
      },
      total_supply: {
        value: "80918979.21462806",
      },
      underlying_address: null,
      underlying_name: "Ether",
      underlying_price: {
        value: "1.000000000000000000",
      },
      underlying_symbol: "ETH",
    },
    {
      borrow_cap: {
        value: "0",
      },
      borrow_rate: {
        value: "0.088782916558253073058190648",
      },
      cash: {
        value: "652617934.815406",
      },
      collateral_factor: {
        value: "0.75000000000000000",
      },
      comp_borrow_apy: {
        value: "1.8603377237901952",
      },
      comp_supply_apy: {
        value: "1.5448949540516788",
      },
      exchange_rate: {
        value: "0.022320306662139486",
      },
      interest_rate_model_address: "0xd8ec56013ea119e7181d231e5048f90fbbe753c0",
      name: "Compound USD Coin",
      number_of_borrowers: 2977,
      number_of_suppliers: 218526,
      reserve_factor: {
        value: "0.07500000000000000",
      },
      reserves: {
        value: "10346663.44230197500000000000",
      },
      supply_rate: {
        value: "0.067631681766202727055666264",
      },
      symbol: "cUSDC",
      token_address: "0x39aa39c021dfbae8fac545936693ac917d5e7563",
      total_borrows: {
        value: "3174566177.382712",
      },
      total_supply: {
        value: "171002912573.33280189",
      },
      underlying_address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      underlying_name: "USD Coin",
      underlying_price: {
        value: "0.000223605346059383",
      },
      underlying_symbol: "USDC",
    },
    {
      borrow_cap: {
        value: "0",
      },
      borrow_rate: {
        value: "0.042640066925510842444593271",
      },
      cash: {
        value: "33313.49223544",
      },
      collateral_factor: {
        value: "0.65000000000000000",
      },
      comp_borrow_apy: {
        value: "5.746700466320309",
      },
      comp_supply_apy: {
        value: "0.4133763455861361",
      },
      exchange_rate: {
        value: "0.020048134455845107",
      },
      interest_rate_model_address: "0xf2e5db36b0682f2cd6bc805c3a4236194e01f4d5",
      name: "Compound Wrapped BTC",
      number_of_borrowers: 148,
      number_of_suppliers: 1219,
      reserve_factor: {
        value: "0.20000000000000000",
      },
      reserves: {
        value: "24.5542216180000000000000000",
      },
      supply_rate: {
        value: "0.002469211001340588094298130",
      },
      symbol: "cWBTC2",
      token_address: "0xccf4429db6322d5c611ee964527d42e5d685dd6a",
      total_borrows: {
        value: "2653.35835644",
      },
      total_supply: {
        value: "1792800.04578097",
      },
      underlying_address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
      underlying_name: "Wrapped BTC",
      underlying_price: {
        value: "14.159127096551759200",
      },
      underlying_symbol: "WBTC",
    },
    {
      borrow_cap: {
        value: "0",
      },
      borrow_rate: {
        value: "0.059725440741309383653180180",
      },
      cash: {
        value: "765311200.080949835866921204",
      },
      collateral_factor: {
        value: "0.75000000000000000",
      },
      comp_borrow_apy: {
        value: "1.8404980052483921",
      },
      comp_supply_apy: {
        value: "1.4881581821651668",
      },
      exchange_rate: {
        value: "0.021689793056434235",
      },
      interest_rate_model_address: "0xfb564da37b41b2f6b6edcc3e56fbf523bd9f2012",
      name: "Compound Dai",
      number_of_borrowers: 3064,
      number_of_suppliers: 19477,
      reserve_factor: {
        value: "0.15000000000000000",
      },
      reserves: {
        value: "13357588.92954963718679655115",
      },
      supply_rate: {
        value: "0.040747344659991382290491787",
      },
      symbol: "cDAI",
      token_address: "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643",
      total_borrows: {
        value: "3204970893.896911369108058698",
      },
      total_supply: {
        value: "182432561470.40544109",
      },
      underlying_address: "0x6b175474e89094c44da98b954eedeac495271d0f",
      underlying_name: "DAI",
      underlying_price: {
        value: "0.000223849746702626",
      },
      underlying_symbol: "DAI",
    },
  ],
  error: null,
  meta: null,
  request: {
    addresses: [],
    block_number: 0,
    block_timestamp: 0,
    meta: false,
    network: "mainnet",
  },
};
