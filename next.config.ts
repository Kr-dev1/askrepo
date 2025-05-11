const isDev = process.env.NODE_ENV === "development";

module.exports = isDev
  ? require("./next.config.dev")
  : require("./next.config.prod");
