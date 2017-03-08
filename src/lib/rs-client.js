const utils = require('./utils');

class Client {
  constructor(conf) {
    utils.validateConf(conf);
    this.conf = conf;
  }
}

module.exports = {
  Client: Client
};
