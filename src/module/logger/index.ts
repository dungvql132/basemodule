import winston, { createLogger, format } from "winston";

function generateLogger(type) {
  const logger = createLogger({
    levels: winston.config.syslog.levels,
    level: "info",
    format: format.combine(format.timestamp(), format.simple()),
    transports: [new winston.transports.File({ filename: `logs/app.log` })],
  });
  const typeLevelIndex = winston.config.syslog.levels[type];
  return {
    log: (message) => {
      logger[type](message);
    },
    update: function (level) {
      logger.level = level;
    },
  };
}

const loggers = {
  error: generateLogger("error"),
  warning: generateLogger("warning"),
  notice: generateLogger("notice"),
  info: generateLogger("info"),
  debug: generateLogger("debug"),
  updateLogLevel: function (level) {
    for (const key in this) {
      try {
        this[key].update(level);
      } catch (err) {}
    }
  },
};

export default loggers;
