// declare global env variable to define types
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URL: string;
      INFURA_API_KEY: string;
      GRAPH_API_KEY: string;
    }
  }
}

export {};
