// TODO - setup transports for preferred server logging
import winston from "winston";
import Transport from "winston-transport";

// const test = process.env.NODE_ENV === "test";
const test = true;
class StackTransport extends Transport {
  log(info, callback) {
    setImmediate(() => {
      if (info && info.error) {
        // eslint-disable-next-line
        console.error(info.error.stack);
      }
    });
    if (callback) {
      callback();
    }
  }
}

const alignedWithColorsAndTime = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf((info) => {
    const { timestamp, level, ...args } = info;

    const ts = timestamp.slice(0, 19).replace("T", " ");
    return `${ts} [${level}]: ${
      Object.keys(args).length ? JSON.stringify(args, null, 2) : ""
    }`;
  })
);

const transports = [
  new StackTransport({
    level: "info",
    handleExceptions: true,
  }),
  new winston.transports.File({
    filename: `./logs/${Math.floor(Date.now())}.log`,
  }),
];

if (test) {
  transports.push(
    new winston.transports.Console({
      level: "debug",
      handleExceptions: true,
      format: alignedWithColorsAndTime,
    }) as any
  );
}

const Logger = winston.createLogger({
  format: winston.format.combine(
    winston.format((info) => info)(),
    winston.format.json()
  ),
  transports,
  exitOnError: false,
});

export default Logger;
