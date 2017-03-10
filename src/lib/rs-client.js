const utils = require('./utils'),
      baseClient  = require('./base-client')
      ;

class Client {
  constructor(conf) {
    utils.validateConf(conf);
    this.conf = conf;
    this.base = baseClient.getBaseClient(conf);
  }

  *connect() {
    yield this.base.connect();
  }
}

module.exports = {
  Client: Client
};
