// import eventSocket, { EventSocket } from "../helpers/socket-helpers";
import { IConfig } from "../models";

export default abstract class Client {
  public conf: IConfig;
  // public eventSocket: EventSocket;

  constructor(conf: IConfig) {
    this.conf = conf;
    // this.eventSocket = eventSocket;
  }

  setup = async (): Promise<void> => {
    // No setup required, override if client-specific setup is required
  };
}
