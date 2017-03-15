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

  *query(sql) {
    let res =  yield this.base.query(sql);
    return res;
  }

  *close() {
    yield this.base.close();
  }

  *update(sql) {
    return yield this.base.update(sql);
  }
}

module.exports = {
  Client: Client
};
