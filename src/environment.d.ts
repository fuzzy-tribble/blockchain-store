// declare global env variable to define types
declare global {
    namespace NodeJS {
      interface ProcessEnv {
        DYDX_URL: string,
        ETHEREUM_NODE_URL: string,
        POLYGON_NODE_URLR: string,
      }
    }
  }
  
  export { };
  